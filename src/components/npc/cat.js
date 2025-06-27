import GameStateManager from "../../gameState.js";

AFRAME.registerComponent("cat", {
    init: function (){
        this.player = document.querySelector('#characterContainer');
        this.model = this.el.querySelector("a-entity[gltf-model]");
        this.isTakeable = false;
        if (this.model) {
            this.model.setAttribute("animation-mixer", {
                clip: "AnimalArmature|AnimalArmature|AnimalArmature|Idle",
                crossFadeDuration: 0.2,
            });
        }

        this.keydownListener = (e) => {
            if (e.key.toLowerCase() === 'e' && this.isTakeable) {
                this.pickCat();
            }
        };

        // Keyboard listener
        window.addEventListener('keydown', this.keydownListener);
    },

    tick: function(){
        const catPos = new THREE.Vector3();
        const playerPos = new THREE.Vector3();

        this.el.object3D.getWorldPosition(catPos);
        this.player.object3D.getWorldPosition(playerPos);

        const direction = new THREE.Vector3().subVectors(playerPos, catPos);
        direction.y = 0;
        if (direction.lengthSq() > 0) {
            direction.normalize();
            const angle = Math.atan2(direction.x, direction.z);
            this.el.object3D.rotation.y = angle;
        }

        const distance = catPos.distanceTo(playerPos);
        if (distance <= 5){
            this.isTakeable = true;
        } else {
            this.isTakeable = false;
        }

    },

    pickCat: function (){
        window.removeEventListener('keydown', this.keydownListener);
        this.el.parentNode.removeChild(this.el);
        GameStateManager.pickCat();
        
        // Set flag that cat has been found but quest not completed yet
        window.witchCatFound = true;
        
        // Update pause menu objective to "return cat to witch"
        const pauseMenuComponent = document.querySelector('[pause-menu]');
        if (pauseMenuComponent && pauseMenuComponent.components['pause-menu']) {
            pauseMenuComponent.components['pause-menu'].recreatePauseMenu();
        }
    }

});