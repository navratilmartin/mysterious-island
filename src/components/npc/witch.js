import GameStateManager from "../../gameState";
import { changeLevel } from "../../utils.js";
import { ISLAND_LEVEL_URL } from "../../constants.js";

const state = GameStateManager.getGameState();

AFRAME.registerComponent("witch", {
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
        this.bubble = this.el.querySelector('#witch-bubble');
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

        this.model.setAttribute("animation-mixer",{clip: "CharacterArmature|Interact"});

        if (state.levels.witchLevel.isComplete) {
            this.bubbleText.setAttribute('text', 'value: Thank you for finding my cat!; color: yellow');
            this.bubbleBox.setAttribute('geometry', "width: 3");
        } else if (state.levels.witchLevel.catPicked) {
            this.bubbleText.setAttribute('text', 'value: Oooh, my lovely cat. Thank you for your help. Here is the part for your plane.; color: yellow');
            this.bubbleBox.setAttribute('geometry', "width: 4");
            GameStateManager.setLevelCompleteness('witchLevel', true);
            GameStateManager.syncGameState();
            
            // Clear all witch quest flags since quest is now complete
            window.witchQuestStarted = false;
            window.witchCatFound = false;
            
            // Update pause menu objective back to default
            const pauseMenuComponent = document.querySelector('[pause-menu]');
            if (pauseMenuComponent && pauseMenuComponent.components['pause-menu']) {
                pauseMenuComponent.components['pause-menu'].recreatePauseMenu();
            }
            
            setTimeout(() =>{
                changeLevel(ISLAND_LEVEL_URL);
            }, 4000)
        } else {
            this.bubbleText.setAttribute('text', 'value: Welcome pilot! If you find my lost cat, I will give you a part for your broken plane.; color: yellow');
            this.bubbleBox.setAttribute('geometry', "width: 5");

            // Set flag that witch quest has started
            window.witchQuestStarted = true;
            
            // Trigger pause menu update if it exists
            const pauseMenuComponent = document.querySelector('[pause-menu]');
            if (pauseMenuComponent && pauseMenuComponent.components['pause-menu']) {
                // Force recreation of pause menu to update objective
                pauseMenuComponent.components['pause-menu'].recreatePauseMenu();
            }

            this.el.emit("reveal-info-box", { text: "Alright, find a cat.. Should be easy, right?" });
        }
        setTimeout(() => {
            this.bubbleText.setAttribute('text', 'value: Press E for talk; color: white');
            this.bubbleBox.setAttribute('geometry', "width: 2");
            this.dialogActive = false;
        }, 4000); // 4 seconds
    }


});