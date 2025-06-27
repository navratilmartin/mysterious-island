import { CHARACTER_MAX_HEALTH } from "./constants";

const stateIdentifier = "__gameState"; // for local storage
const initialGameState = {
    levels: {
        pirateLevel: {
            isComplete: false,
        },
        dungeonLevel: {
            isComplete: false,
        },
        witchLevel: {
            isComplete: false,
            catPicked: false,
        }
    },
    hero: {
        health: CHARACTER_MAX_HEALTH,
        mana: 100,
        level: 1, // increased, when hero finishes a quest, kills enemies (?)
        stats: {
            strength: 4,
            magic: 2,
            dexterity: 2,
            vitality: 1,
            armor: 2,
            damage: 3,
        },
        inventory: [],
    },
};

export default class GameStateManager {
    static #state;

    /**
     * Returns current game state. If the state doesn't exist, a new state is created and stored in LocalStorage.
     * 
     * @returns {} current game state.
     */
    static getGameState() {
        if (this.#state) {
            return this.#state;
        } 

        const stateFromLocalStorage = JSON.parse(localStorage.getItem(stateIdentifier));
        if (!stateFromLocalStorage) {
            this.#state = initialGameState;
            const stateStr = JSON.stringify(this.#state);
            localStorage.setItem(stateIdentifier, stateStr);
        } else {
            this.#state = stateFromLocalStorage;
        }

        console.log("State after get", this.#state);

        return this.#state;
    }

    /**
     * Synchronize this state with LocalStorage.
     * 
     */
    static syncGameState() {
        const state = GameStateManager.getGameState();
        const stateStr = JSON.stringify(state);
        localStorage.setItem(stateIdentifier, stateStr);
        console.log("State after sync", state);
    }

    /**
     * Resets game state to {@linkcode initialGameState} and synchronizes with LocalStorage.
     * 
     */
    static resetGameState() {
        this.#state = initialGameState;
        GameStateManager.syncGameState();
    }

    /**
     * Sets level completeness in this state. Doesn't synchronize with LocalStorage.
     * Returns error, if level doesn't exist.
     * 
     * @param {string} levelName - level name (key) from {@linkcode initialGameState}.
     * @param {boolean} val - boolean that is used for level completeness.
     */
    static setLevelCompleteness(levelName, val) {
        const state = GameStateManager.getGameState();
        if (!state.levels[levelName]) return new Error("Level doesn't exist");
        state.levels[levelName].isComplete = val;
    }

    /**
     * Returns number of completed levels in this state.
     * 
     * @returns number of completed levels.
     */
    static getNumberOfCompletedLevels() {
        const state = GameStateManager.getGameState();
        let num = 0;
        for (const key in state.levels) {
            if (state.levels[key].isComplete) {
                num++;
            }
        }
        return num;
    }

    static characterHit(){
        const state = GameStateManager.getGameState();
        state.hero.health -= 1;
        GameStateManager.syncGameState();
        return state.hero.health <= 0;
    }

    static setFullCharacterHealth(){
        const state = GameStateManager.getGameState();
        state.hero.health = 10;
        GameStateManager.syncGameState();
    }

    static pickCat() {
        const state = GameStateManager.getGameState();
        state.levels["witchLevel"].catPicked = true;
        GameStateManager.syncGameState();
    }
}