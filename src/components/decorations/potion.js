import { CHARACTER_MAX_HEALTH } from "../../constants.js";
import GameStateManager from "../../gameState.js";

AFRAME.registerComponent("potion", {

    init: function (){
        this.player = document.querySelector('#characterContainer');
        this.takeable = false;

        this.onKeyDown = (e) => {
            if (e.key === 'e' || e.key === 'E') {
                this.drink();
            }
        };
        window.addEventListener('keydown', this.onKeyDown);
    },

    tick: function (time, delta) {
        const potionPos = new THREE.Vector3();
        const playerPos = new THREE.Vector3();

        this.el.object3D.getWorldPosition(potionPos);
        this.player.object3D.getWorldPosition(playerPos);

        const distance = potionPos.distanceTo(playerPos);

        if(distance <= 3){
            this.takeable = true;
        } else {
            this.takeable = false;
        }
    },

    drink: function (){
        if (this.takeable) {
            GameStateManager.setFullCharacterHealth();
            this.el.parentNode.removeChild(this.el);
            this.player.emit("update-health-progress", { healthVal: CHARACTER_MAX_HEALTH });
        }
    }

});