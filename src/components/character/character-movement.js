const SPEED = 14;
const JUMP_STRENGTH = 8;

AFRAME.registerComponent("character-movement", {
    schema: {
        model: { type: "selector" },
    },

    /** @type {Component<any, System<any>>.el: Entity<ObjectMap<any>>} - alias for component's `this.el` */
    container: undefined,

    /** @type {AFRAME.AEntity} */
    characterModel: undefined,

    /** @type {(AFRAME.THREE.Vector3 | null)} */
    movementVelocity: null,

    movementDirections: {
        back: new AFRAME.THREE.Vector3(0, 0, SPEED),
        right: new AFRAME.THREE.Vector3(SPEED, 0, 0),
        forward: new AFRAME.THREE.Vector3(0, 0, -SPEED),
        left: new AFRAME.THREE.Vector3(-SPEED, 0, 0),
    },

    currentMovementDir: "right",

    characterModelRotY: 90,

    isLanded: true,

    isMovementDisabled: false,

    /** @type {import("three").Quaternion} - the world rotation of camera to correctly rotate the character */
    cameraWorldRotation: new AFRAME.THREE.Quaternion(),

    /** @type {} - temporary Ammo.js quaternion for rotating physics body to match camera rotation */
    tmpAmmoQuat: null,

    /** @type {} - temporary Ammo.js transform that is affected by `tmpAmmoQuat` to match camera rotation */
    tmpAmmoTr: null,

    init() {
        this.container = this.el;
        this.characterModel = this.data.model;

        if (!this.characterModel) {
            console.error("Model not found; provide valid selector");
            return;
        }

        this.setupModel();
        this.setKeyboardListeners();
        this.container.addEventListener("collidestart", () => {
            this.didLand();
        });

        setTimeout(() => {
            this.tmpAmmoQuat = new Ammo.btQuaternion();
            this.tmpAmmoTr = new Ammo.btTransform();
        }, 1000);
    },

    setKeyboardListeners() {
        document.addEventListener("keydown", (event) => {
            if (this.isMovementDisabled) return;

            switch (event.key) {
                case "ArrowLeft":
                case "a":
                    this.startMoving("left");
                    break;
                case "ArrowRight":
                case "d":
                    this.startMoving("right");
                    break;
                case "ArrowUp":
                case "w":
                    this.startMoving("forward");
                    break;
                case "ArrowDown":
                case "s":
                    this.startMoving("back");
                    break;
                case " ":
                    this.jump();
                    break;
            }
        });
        document.addEventListener("keyup", (e) => {
            // if (e.key !== " ") {
                this.stop();
            // }
        });
    },

    setupModel() {
        const charModel = this.characterModel;
        charModel.addEventListener("model-loaded", () => {
            // Center model's geometry
            const box = new AFRAME.THREE.Box3().setFromObject(charModel.getObject3D("mesh"));
            const center = box.getCenter(new AFRAME.THREE.Vector3());

            charModel.object3D.position.x += (charModel.object3D.position.x - center.x);
            charModel.object3D.position.y += (charModel.object3D.position.y - center.y);
            // charModel.object3D.position.z += (charModel.object3D.position.z - center.z);

            // Add collision shape after the model is loaded and centered
            charModel.setAttribute("ammo-shape", "type: hull");
        });
    },

    startMoving(direction) {
        const directions = Object.keys(this.movementDirections);
        let diff =
            directions.indexOf(direction) -
            directions.indexOf(this.currentMovementDir);
        diff = diff >= 3 ? diff - 4 : diff;
        diff = diff <= -3 ? diff + 4 : diff;

        this.characterModelRotY += diff * 90;
        this.currentMovementDir = direction;
        this.movementVelocity = this.movementDirections[direction].clone();

        if (!this.isLanded) {
            // Decrease movement speed when 'flying' (hero is running while being in jump)
            this.movementVelocity.x /= 2;
            this.movementVelocity.z /= 2;
        }

        // Rotate the character to the correct direction of movement
        this.characterModel.setAttribute("animation", {
            property: "rotation",
            to: { x: 0, y: this.characterModelRotY, z: 0 },
            dur: 500,
            easing: "easeOutQuad",
        });

        // Start character's animation
        this.characterModel.setAttribute("animation-mixer", {
            clip: "Run",
            crossFadeDuration: 0.2,
        });
    },

    stop() {
        if (!this.container.body) return;

        // Stop moving the character
        const currentVelocity = this.container.body.getLinearVelocity();
        const zeroVelocity = new Ammo.btVector3(0, currentVelocity.y(), 0);
        this.container.body.setLinearVelocity(zeroVelocity);
        Ammo.destroy(zeroVelocity);

        this.movementVelocity = null;
        this.characterModel.setAttribute("animation-mixer", {
            clip: "Idle",
            crossFadeDuration: 0.2,
        });
    },

    didLand() {
        const currentAmmoVelocity = this.container.body.getLinearVelocity();
        if (Math.floor(Math.abs(currentAmmoVelocity.y())) === 0) {
            this.isLanded = true;
        }

        return this.isLanded;
    },

    jump() {
        if (!this.isLanded) return;

        this.isLanded = false;

        const currentAmmoVelocity = this.container.body.getLinearVelocity();
        this.container.body.setLinearVelocity(new Ammo.btVector3(currentAmmoVelocity.x(), JUMP_STRENGTH, currentAmmoVelocity.z()));
        // TODO: create a jump animation in Blender
    },

    rotatePhysicsBodyToMatchCameraRotation() {
        if (!this.el.body || !this.tmpAmmoQuat || !this.tmpAmmoTr) return;

        const body = this.el.body;
        const tmpAmmoQuat = this.tmpAmmoQuat;
        const tmpAmmoTr = this.tmpAmmoTr;

        const tmpEuler = new AFRAME.THREE.Euler().setFromQuaternion(
            this.cameraWorldRotation, 
            "YXZ",
        );
        tmpEuler.x = 0;
        tmpEuler.z = 0;
        const rotationOnlyY = new AFRAME.THREE.Quaternion().setFromEuler(tmpEuler);
        tmpAmmoQuat.setValue(rotationOnlyY.x, rotationOnlyY.y, rotationOnlyY.z, rotationOnlyY.w);

        const currentTransform = body.getCenterOfMassTransform();
        const origin = currentTransform.getOrigin();
        tmpAmmoTr.setIdentity();
        tmpAmmoTr.setRotation(tmpAmmoQuat);
        tmpAmmoTr.setOrigin(origin);

        body.setCenterOfMassTransform(tmpAmmoTr);
        body.activate(); // make sure the physics body is not sleeping
    },

    tick() {
        const body = this.container.body;
        if (!body) return;

        this.el.sceneEl.camera.getWorldQuaternion(this.cameraWorldRotation);
        this.rotatePhysicsBodyToMatchCameraRotation();

        if (!this.movementVelocity) return;

        // Clone and rotate the velocity direction
        const worldVelocity = this.movementVelocity.clone().applyQuaternion(this.cameraWorldRotation);
        const currentAmmoVelocity = body.getLinearVelocity();
        const newAmmoVelocity = new Ammo.btVector3(
            worldVelocity.x,
            currentAmmoVelocity.y(), // keep Y axis the same
            worldVelocity.z
        );
        body.setLinearVelocity(newAmmoVelocity);
        body.setFriction(2);

        // Clean up
        Ammo.destroy(newAmmoVelocity);
    },
});
