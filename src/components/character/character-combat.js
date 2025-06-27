import GameStateManager from "../../gameState.js";
import { changeLevel } from "../../utils.js";
import { DUNGEON_LEVEL_URL, ISLAND_LEVEL_URL } from "../../constants.js";

const state = GameStateManager.getGameState();

AFRAME.registerComponent("character-combat", {
    schema: {
        model: { type: "selector" },
        attackRange: { type: "number", default: 3 },
        damage: { type: "number", default: 1 },
        health: { type: "number", default: 10 }
    },

    isPunchComplete: true,

    init: function () {
        this.characterModel = this.data.model;
        this.raycaster = new THREE.Raycaster();
        this.health = this.data.health;

        if (!this.characterModel) {
            console.error("Model not found; provide valid selector");
            return;
        }

        window.addEventListener('mousedown', (e) => {
           if (e.button === 0 && this.isPunchComplete){
               console.log('Levé tlačítko myši bylo stisknuto');
               this.el.components["character-movement"].isMovementDisabled = true;
               this.el.components["character-movement"].stop();
               setTimeout(() => {
                   this.punch();
               }, 210);
           }
        });

        // Handling character death
        this.characterModel.addEventListener("animation-finished", (e) => {
            if (e.detail.action._clip.name === "Death"){
                GameStateManager.setFullCharacterHealth();
                changeLevel(DUNGEON_LEVEL_URL);
            }
        });
    },

    punch: function () {
        this.isPunchComplete = false;

        // Raycaster origin + direction
        const origin = new THREE.Vector3();
        this.el.object3D.getWorldPosition(origin);

        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyQuaternion(this.el.object3D.quaternion);
        direction.normalize();

        this.raycaster.set(origin, direction);
        this.raycaster.far = this.data.attackRange;

        // Najdi enemy objekty
        const enemyEls = document.querySelectorAll(".enemy");
        const enemyObjects = [];
        enemyEls.forEach(el => {
            if (el.object3D) enemyObjects.push(el.object3D);
        });

        const intersects = this.raycaster.intersectObjects(enemyObjects, true);

        console.log("Raycaster intersects:", intersects.length);

        if (intersects.length > 0) {
            const enemyComp = findEnemyComponent(intersects[0].object);
            if (enemyComp) {
                console.log("Enemy hit! Damaging...");
                enemyComp.takeDamage(this.data.damage);
            }
        }

        this.characterModel.setAttribute('animation-mixer', { clip: "Punch", crossFadeDuration: 0.2, });
        
        setTimeout(() => {
            this.characterModel.setAttribute("animation-mixer", {
                clip: "Idle",
                crossFadeDuration: 0.2,
            });
            this.isPunchComplete = true;
            this.el.components["character-movement"].isMovementDisabled = false;
        }, 250);
    },

    takeDamage: function (amount) {
        if (GameStateManager.characterHit()){
            this.die();
        }
        console.log(`Character health: ${state.hero.health}`);
        this.el.emit("update-health-progress", { healthVal: state.hero.health });

    },

    die: function () {
        console.log("Character died");
        this.characterModel.setAttribute('animation-mixer', { clip: "Death", crossFadeDuration: 0.2, loop:"once" });
    }


});

function findEnemyComponent(object3D) {
    let el = object3D.el;
    while (el) {
        if (el.components && el.components.enemy) {
            return el.components.enemy;
        }
        // Pokračuj k rodiči v DOM stromu A-Frame
        el = el.parentEl;
    }
    return null;
}