import GameStateManager from "../../gameState.js";
import { changeLevel } from "../../utils.js";
import { DUNGEON_LEVEL_URL, PIRATE_LEVEL_URL } from "../../constants.js";

const state = GameStateManager.getGameState();

AFRAME.registerComponent("native", {
    schema: {
        radius: { type: 'number', default: 2 },
        model: { type: "selector" }
    },

    init: function () {
        const model = this.data.model;
        if (!model) {
            console.error("Model not found; provide valid selector");
            return;
        }

        this.model = model;
        this.player = document.querySelector('#character');
        this.bubble = this.el.querySelector('#native-bubble');
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
                this.model.setAttribute("animation-mixer", { clip: "CharacterArmature|Wave", crossFadeDuration: 0.2 });
            }
        } else {
            this.bubble.setAttribute('visible', false);
            if (!this.dialogActive) {
                this.model.setAttribute("animation-mixer", { clip: "CharacterArmature|Idle", crossFadeDuration: 0.2 });
            }
        }
    },
    startDialogue: function () {
        if (this.dialogActive) return;
        this.dialogActive = true;

        this.model.setAttribute("animation-mixer",{clip: "CharacterArmature|Yes"});

        if (state.levels.dungeonLevel.isComplete) {
            this.bubbleText.setAttribute('text', 'value: Thank you for your help with the ghost!; color: yellow');
            this.bubbleBox.setAttribute('geometry', "width: 4");
            setTimeout(() => {
                this.bubbleText.setAttribute('text', 'value: Press E for talk; color: white');
                this.bubbleBox.setAttribute('geometry', "width: 2")
                this.dialogActive = false;
            }, 4000); // 4 seconds
            return;
        }

        this.bubbleText.setAttribute('text', 'value: Welcome pilot, I need your help! I need you to beat the ghost in the dungeon.; color: yellow');
        this.bubbleBox.setAttribute('geometry', "width: 4");

        setTimeout(() => {
            changeLevel(DUNGEON_LEVEL_URL);
        }, 6000);
    }


});