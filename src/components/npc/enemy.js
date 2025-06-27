import GameStateManager from "../../gameState.js";
import { changeLevel } from "../../utils.js";
import { ISLAND_LEVEL_URL } from "../../constants.js";

AFRAME.registerComponent("enemy", {
    schema: {
        type: { type: 'string' },
    },

    init: function () {
        this.model = this.el.children[0];
        this.player = document.querySelector('#characterContainer');

        if (this.data.type === "orc") {
            this.attacks = ["CharacterArmature|Punch", "CharacterArmature|Weapon"];
            this.idle = "CharacterArmature|Idle";
            this.deathAnimation = "CharacterArmature|Death";
            this.health = 5;
            this.attackCooldown = 3000;
        } else if (this.data.type === "ghost") {
            this.attacks = ["CharacterArmature|Punch", "CharacterArmature|Headbutt"];
            this.idle = "CharacterArmature|Flying_Idle";
            this.deathAnimation = "CharacterArmature|Death";
            this.health = 7;
            this.attackCooldown = 1500;
        } else if (this.data.type === "alien") {
            this.attacks = ["CharacterArmature|Punch", "CharacterArmature|Weapon"];
            this.idle = "CharacterArmature|Idle";
            this.deathAnimation = "CharacterArmature|Death";
            this.health = 3;
            this.attackCooldown = 2500;
        }

        this.lastAttackTime = 0;
        this.attackRange = 5;

        this.model.setAttribute('animation-mixer', {
            clip: this.idle,
            loop: 'repeat',
            crossFadeDuration: 0.2
        });

        // Handling transition between attacks/hits and idle
        this.model.addEventListener('animation-finished', (e) => {
            if (this.attacks.includes(e.detail.action._clip.name) || e.detail.action._clip.name === "CharacterArmature|HitReact") {
                this.model.removeAttribute("animation-mixer");
                this.model.setAttribute('animation-mixer', {
                    clip: this.idle,
                    crossFadeDuration: 0.2,
                });
            }
        });

    },

    tick: function (time, delta) {
        if (this.health <= 0) return;

        const npcPos = new THREE.Vector3();
        const playerPos = new THREE.Vector3();

        this.el.object3D.getWorldPosition(npcPos);
        this.player.object3D.getWorldPosition(playerPos);

        // Rotate enemy to player
        const direction = new THREE.Vector3().subVectors(playerPos, npcPos);
        direction.y = 0;
        if (direction.lengthSq() > 0) {
            direction.normalize();
            const angle = Math.atan2(direction.x, direction.z);
            this.el.object3D.rotation.y = angle;
        }

        const distance = npcPos.distanceTo(playerPos);

        const now = time;

        // If player is in range and cooldown is ready
        if ((distance <= this.attackRange) && ((now - this.lastAttackTime) > this.attackCooldown)) {
            const randomAttack = this.attacks[Math.floor(Math.random() * this.attacks.length)];
            this.model.setAttribute('animation-mixer', {
                clip: randomAttack,
                crossFadeDuration: 0.2,
                loop: "once",
            });

            // Make attack
            console.log('Enemy attacks player!');
            const playerCombat = this.player.components['character-combat'];
            if (playerCombat && typeof playerCombat.takeDamage === 'function') {
                playerCombat.takeDamage(1);
            }

            this.lastAttackTime = now;
        }
    },

    takeDamage: function (amount) {
        this.health -= amount;
        console.log(`Enemy health: ${this.health}`);

        if (this.health <= 0) {
            this.die();
        } else {
            this.model.setAttribute('animation-mixer', {
                clip: 'CharacterArmature|HitReact',
                crossFadeDuration: 0.2,
                loop: 'once',
            });
        }
    },

    die: function () {
        console.log("Enemy died");
        this.model.setAttribute('animation-mixer', {
            clip: this.deathAnimation,
            crossFadeDuration: 0.2,
            loop: "once",
        });

        setTimeout(() => {
                if (this.el && this.el.parentNode) {
                    this.el.parentNode.removeChild(this.el);
                }
                
                if (this.data.type === "ghost"){
                    GameStateManager.setLevelCompleteness("dungeonLevel", true);
                    GameStateManager.syncGameState();

                    setTimeout(() => {
                        changeLevel(ISLAND_LEVEL_URL);
                    }, 2000);
                }
        }, 500);
    }

});