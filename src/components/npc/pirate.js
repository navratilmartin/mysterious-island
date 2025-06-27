import { ISLAND_LEVEL_URL, PIRATE_LEVEL_URL } from "../../constants";
import { changeLevel } from "../../utils";
import GameStateManager from "../../gameState";

const state = GameStateManager.getGameState();

AFRAME.registerComponent("pirate", {
    schema: {
        radius: { type: 'number', default: 3 },
        model: { type: "selector" },
        inLevel: { type: "boolean", default: false},
        mapTaken: { type: "boolean", default: false}
    },

    init: function () {
        const model = this.data.model;
        if (!model) {
            console.error("Model not found; provide valid selector");
            return;
        }

        this.inLevel = this.data.inLevel
        this.model = model;
        this.player = document.querySelector('#character');
        this.bubble = this.el.querySelector('#pirate-bubble');
        this.bubbleBox = this.bubble.querySelector('#bubble-box');
        this.bubbleText = this.bubble.querySelector('#bubble-text');
        this.dialogActive = false;

        // Hide bubble
        if (this.bubble) {
            this.bubble.setAttribute('visible', false);
        }

        // Keyboard listener
        window.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'e' && this.bubble.getAttribute('visible')) {
                this.startDialogue();
            }
        });
    },

    tick: function () {
        if (!this.player || !this.bubble) return;

        const npcPos = new THREE.Vector3();
        const playerPos = new THREE.Vector3();

        this.el.object3D.getWorldPosition(npcPos);
        this.player.object3D.getWorldPosition(playerPos);

        const distance = npcPos.distanceTo(playerPos);

        if (distance < this.data.radius) {
            this.bubble.setAttribute('visible', true);

            // Look at character
            const dir = new THREE.Vector3().subVectors(playerPos, npcPos);
            dir.y = 0;
            this.model.object3D.lookAt(npcPos.clone().add(dir));

            // Bubble rotation
            const bubbleWorldPos = new THREE.Vector3();
            this.bubble.object3D.getWorldPosition(bubbleWorldPos);
            const bubbleLookTarget = new THREE.Vector3().copy(playerPos);
            bubbleLookTarget.y = bubbleWorldPos.y;
            this.bubble.object3D.lookAt(bubbleLookTarget);

            if (!this.dialogActive) {
                this.model.setAttribute("animation-mixer", { clip: "CharacterArmature|CharacterArmature|CharacterArmature|Wave|CharacterArmature|Wave", crossFadeDuration: 0.2 });
            }
        } else {
            this.bubble.setAttribute('visible', false);
            if (!this.dialogActive) {
                this.model.setAttribute("animation-mixer", { clip: "CharacterArmature|CharacterArmature|CharacterArmature|Idle|CharacterArmature|Idle", crossFadeDuration: 0.2 });
            }
        }
    },

    startDialogue: function () {
        if (this.dialogActive) return;
        this.dialogActive = true;

        this.model.setAttribute("animation-mixer",{clip: "CharacterArmature|CharacterArmature|CharacterArmature|Yes|CharacterArmature|Yes"});

        if (state.levels.pirateLevel.isComplete) {
            this.bubbleText.setAttribute('text', 'value: Thank you for your help!; color: yellow');
            this.bubbleBox.setAttribute('geometry', "width: 2");
            return;
        }

        if (this.data.mapTaken) {
            this.bubbleText.setAttribute('text', 'value: Thank you for the map, here is aircraft component as I promised.; color: yellow');
            this.bubbleBox.setAttribute('geometry', "width: 5")
            
            GameStateManager.setLevelCompleteness("pirateLevel", true);
            GameStateManager.syncGameState();

            setTimeout(() => {
                changeLevel(ISLAND_LEVEL_URL);
            }, 4000);
        } else if (this.inLevel) {
            this.bubbleText.setAttribute('text', 'value: Bring me the map from the other side of the river.; color: yellow');
            this.bubbleBox.setAttribute('geometry', "width: 4");
        } else {
            this.bubbleText.setAttribute('text', 'value: Welcome pilot, I need your help!; color: yellow');
            this.bubbleBox.setAttribute('geometry', "width: 3");
            setTimeout(() => {
                changeLevel(PIRATE_LEVEL_URL);
            }, 1000);
        }

        setTimeout(() => {
            this.bubbleText.setAttribute('text', 'value: Press E for talk; color: white');
            this.bubbleBox.setAttribute('geometry', "width: 2")
            this.dialogActive = false;
        }, 4000); // 4 seconds
    }

})