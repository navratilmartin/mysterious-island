import GameStateManager from "../../gameState";

AFRAME.registerComponent("health-bar", {
    initialHealth: 0,

    currentHealth: 0,
    
    /** @type {HTMLElement | null} */
    healthBarContainer: null,

    events: {
        "update-health-progress": function (e) {
            const newHealth = e.detail.healthVal;
            const newHealthInPercentage = (newHealth / this.initialHealth) * 100;
            const currentHealthInPercentage = (this.currentHealth / this.initialHealth) * 100;
            const healthBarProgressEl = this.healthBarContainer.children[0];

            healthBarProgressEl.animate(
                [
                    { width: `${currentHealthInPercentage}%` },
                    { width: `${newHealthInPercentage}%` },
                ],
                {
                    duration: 300,
                    fill: "forwards",
                }
            );

            this.currentHealth = newHealth;
        }
    },

    init() {
        this.healthBarContainer = document.getElementById("health-container");
        if (!this.healthBarContainer) {
            console.error("Failed to get health bar container");
            return;
        }

        this.initialHealth = GameStateManager.getGameState().hero.health;
        this.currentHealth = this.initialHealth;
    }
});