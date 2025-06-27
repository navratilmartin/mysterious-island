import GameStateManager from "../../gameState";

AFRAME.registerComponent("spawn-crash-site", {
    schema: {},

    init() {
        this.planePhaseModelId = `#planePhase${GameStateManager.getNumberOfCompletedLevels()}`;
        this.add3DModels();
    },

    add3DModels() {
        const crashSite = /* html */ `
            <a-entity ammo-body="type: static;" ammo-shape="type: box" gltf-model=${this.planePhaseModelId} position="0 -0.2 -3" scale="2 2 2" shadow="cast: true"></a-entity>
            <a-entity ammo-body="type: static;" ammo-shape="type: box" gltf-model="#generator" position="5.2 -0.67 0.48" scale="0.5 0.5 0.5" rotation="0 45 0" shadow="cast: true"></a-entity>

            <a-entity gltf-model="#gear" position="-3 -0.85 1" scale="0.2 0.2 0.2" rotation="90 0 0"></a-entity>
            <a-entity gltf-model="#gear" position="-2 -0.85 0.5" scale="0.2 0.2 0.2" rotation="90 0 0"></a-entity>
            <a-entity gltf-model="#gear" position="4 -0.85 -3" scale="0.2 0.2 0.2" rotation="90 0 0"></a-entity>
            <a-entity gltf-model="#gear" position="3 -0.85 -2" scale="0.2 0.2 0.2" rotation="90 0 0"></a-entity>
            <a-entity gltf-model="#gear" position="4 -0.85 1" scale="0.2 0.2 0.2" rotation="90 0 0"></a-entity>
            <a-entity gltf-model="#gear" position="5 -0.85 -0.5" scale="0.2 0.2 0.2" rotation="90 0 0"></a-entity>

            <a-entity ammo-body="type: static;" ammo-shape="type: box" gltf-model="#tent" position="-11 -0.87 -6" rotation="0 12 0" scale="0.2 0.2 0.2" shadow="cast: true"></a-entity>
            <a-entity ammo-body="type: static;" ammo-shape="type: box" gltf-model="#campingStuff" position="-10 -0.025 2" scale="2 2 2" rotation="0 -132 0" shadow="cast: true">
                <a-entity id="lanternLight" light="type: point; intensity: 20; distance: 15; decay: 1; color: #ffa50a" position="0.25 1 0.37"></a-entity>
            </a-entity>
            <a-entity ammo-body="type: static;" ammo-shape="type: box" gltf-model="#bonfire" position="-10 -0.86 -1.7" scale="3 3 3" rotation="0 90 0" shadow="cast: true"></a-entity>
        `;

        this.el.innerHTML = crashSite;
    },
});
