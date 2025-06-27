AFRAME.registerComponent("island", {
    schema: {
        pos: { type: "vec3", default: { x: 0, y: 0, z: 0 } },
        rot: { type: "vec3", default: { x: 0, y: 0, z: 0 } },
        scale: { type: "vec3", default: { x: 0, y: 0, z: 0 } },
        modelId: { type: "string" }
    },

    init() {
        this.el.setAttribute("gltf-model", `${this.data.modelId}`);
        this.el.addEventListener("model-loaded", () => {
            this.el.setAttribute("position", this.data.pos);
            this.el.setAttribute("rotation", this.data.rot);
            this.el.setAttribute("scale", this.data.scale);
            this.el.setAttribute("ammo-body", {
                type: "static",
            });
            this.el.setAttribute("ammo-shape", {
                type: "mesh",
            });
            this.el.setAttribute("shadow", {
                receive: "true",
                cast: "false",
            });

            // grab the mesh 
            let model = this.el.getObject3D("mesh");
            // find the node with the basic material     
            model.traverse(function(node) {
                // ignore bones and other nodes without any material 
                if (!node.material) return;

                // keep the reference to the old material - we want to dispose it later
                var tmp = node.material
                // substitute the material     
                node.material = new THREE.MeshStandardMaterial({
                   skinning: true, // the original material is using skinning
                   map: node.material.map, // we want the original texture
                   roughness: 0.8, // make it less shiny
                   metalness: 0.0 // grass shouldn't be metallic
                });
                // update and clean up
                node.material.needsUpdate = true;
                tmp.dispose()
            })
        });
    },
});
