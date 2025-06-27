import { END_SCREEN_URL } from "../../constants.js";
import { changeLevel } from "../../utils.js";

AFRAME.registerComponent('wings', {
       init: function(){
        this.player = document.querySelector('#characterContainer');
        this.takeable = false;

        this.keyboardListener = (e) => {
            if (e.key.toLowerCase() === 'e' && this.takeable) {
                changeLevel(END_SCREEN_URL);
            }
        }
        // Keyboard listener
        window.addEventListener('keydown', this.keyboardListener);
    },

    tick: function (time, timeDelta) {
        // Distance check
        const wingsPos = new THREE.Vector3();
        const playerPos = new THREE.Vector3();

        this.el.object3D.getWorldPosition(wingsPos);
        this.player.object3D.getWorldPosition(playerPos);

        const distance = wingsPos.distanceTo(playerPos);

        if (distance < 3) {
            this.takeable = true;
        } else {
            this.takeable = false;
        }
    },

    remove: function () {
        window.removeEventListener('keydown', this.keyboardListener);
    }
});