AFRAME.registerComponent('ocean-respawn', {
    schema: {
        respawnPosition: { type: 'vec3', default: { x: -20, y: 2.430, z: -5 } }
    },

    init: function() {
        const characterEl = this.el;
        const drownSound = document.querySelector('#drownSound');

        characterEl.addEventListener('collidestart', (event) => {
            const collidedEntity = event.detail.targetEl;

            if (collidedEntity && collidedEntity.id === 'ocean') {
                console.log('Character fell into the ocean! Respawn...');
                this.respawnCharacter();
            }
        });
    },

    respawnCharacter: function() {
        const characterEl = this.el;
        const respawnPos = this.data.respawnPosition;

        const ammoBodyComponent = characterEl.components['ammo-body'];

        if (ammoBodyComponent && ammoBodyComponent.body) {
            const ammoBody = ammoBodyComponent.body;

            ammoBody.setLinearVelocity(new Ammo.btVector3(0, 0, 0));
            ammoBody.setAngularVelocity(new Ammo.btVector3(0, 0, 0));
            console.log('Physical body speed reset.');

            characterEl.setAttribute('position', respawnPos);
            console.log('A-Frame position set to:', characterEl.getAttribute('position'));

            characterEl.setAttribute('rotation', '0 180 0');
            console.log('A-Frame rotation set to:', characterEl.getAttribute('rotation'));

            // --- Important physical body sync ---
            ammoBodyComponent.syncToPhysics();

            ammoBody.setActivationState(1);

            drownSound.setAttribute('position', respawnPos)
            drownSound.components.sound.playSound();

        } else {
            console.warn('river-respawn: Cannot find ammo-body or its body on the entity.');
        }
    }
});