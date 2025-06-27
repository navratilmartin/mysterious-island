AFRAME.registerComponent('map', {
    schema: {
        speed: { type: 'number', default: 20 },
    },

    init: function(){
        this.bubble = document.querySelector('#map-bubble');
        this.player = document.querySelector('#character');


        this.keyboardListener = (e) => {
            if (e.key.toLowerCase() === 'e' && this.bubble.getAttribute('visible')) {
                this.takeMap();
            }
        }
        // Keyboard listener
        window.addEventListener('keydown', this.keyboardListener);
    },

    takeMap: function(){
        this.el.parentNode.removeChild(this.el);
        const pirateEntity = document.querySelector('#pirateContainer');
        pirateEntity.setAttribute('pirate', 'mapTaken', true);

        // Update respawn position
        const characterEntity = document.querySelector('#characterContainer');
        characterEntity.setAttribute('river-respawn', 'respawnPosition', { x: 22, y: 2.430, z: 0 });

        // Remove listener
        window.removeEventListener('keydown', this.keyboardListener);
    },

    tick: function (time, timeDelta) {
        // Rotation
        const obj = this.el.object3D;

        const rotationDelta = (this.data.speed / 1000) * timeDelta;
        const rotationDeltaRad = THREE.MathUtils.degToRad(rotationDelta);

        obj.rotation.y += rotationDeltaRad;

        // Distance check
        const mapPos = new THREE.Vector3();
        const playerPos = new THREE.Vector3();

        this.el.object3D.getWorldPosition(mapPos);
        this.player.object3D.getWorldPosition(playerPos);

        const distance = mapPos.distanceTo(playerPos);

        if (distance < 2) {
            this.bubble.setAttribute('visible', true);
        } else {
            this.bubble.setAttribute('visible', false);
        }
    }
});