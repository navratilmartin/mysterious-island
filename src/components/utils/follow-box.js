AFRAME.registerComponent("follow-box", {
    schema: {
        target: { type: "selector" },
    },

    tick: (function () {
        // Create once
        const tmpv = new THREE.Vector3();

        return function (t, dt) {
            if (!this.data.target) return; // ignore when there is no target
            const target = this.data.target.object3D; // get the mesh

            // Track the position
            const position = target.getWorldPosition(tmpv); // get the world position
            this.el.object3D.position.lerp(tmpv, 0.5); // linear interpolation towards the world position
        };
    })(),
});

// https://stackoverflow.com/questions/71336022/how-can-i-get-a-third-person-perspective-for-a-model-using-aframe
// Piotr Adam Milewski <3 
