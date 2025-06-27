let pauseMenuInstance = null;

AFRAME.registerComponent("pause-menu", {
    schema: {
        pauseKey: { type: "string", default: "p" }
    },

    init() {
        // If there's already a pause menu instance, don't create another one
        if (pauseMenuInstance) {
            return;
        }
        
        pauseMenuInstance = this;
        this.isPaused = false;
        this.pauseOverlay = null;
        this.keyListener = null;
        
        this.createPauseMenu();
        this.setupKeyListener();
        
        // Store reference to character movement component to disable it
        this.characterEntity = document.querySelector('[character-movement]');
    },

    setupKeyListener() {
        if (this.keyListener) {
            document.removeEventListener("keydown", this.keyListener);
        }
        
        this.keyListener = (event) => {
            if (event.key.toLowerCase() === this.data.pauseKey.toLowerCase()) {
                event.preventDefault();
                this.togglePause();
            }
        };
        
        document.addEventListener("keydown", this.keyListener);
    },

    getLevelObjective() {
        const sceneId = this.el.sceneEl.id;
        
        switch(sceneId) {
            case 'scene':
                // Check witch quest states
                if (this.hasPlayerTalkedToWitch()) {
                    if (this.hasPlayerFoundCat()) {
                        return {
                            title: "Return the Cat to the Witch",
                            description: "Great! You found the witch's cat. Now return to the witch in the forest to complete the quest and receive your plane part. She should be near her house in the wooded area."
                        };
                    } else {
                        return {
                            title: "Find the Witch's Lost Cat",
                            description: "The witch has asked you to find her missing cat! Look around the island for a small cat - it should be near a tree somewhere. Once you find it, get close and press E to pick it up."
                        };
                    }
                }
                
                return {
                    title: "Explore the Mysterious Island", 
                    description: "Your plane crashed on this strange island! Find all the scattered plane parts to repair your aircraft and escape. Talk to the NPCs around the island - they might have the parts you need or know where to find them."
                };
            case 'pirate-level':
                return {
                    title: "Retrieve the Map for the Pirate",
                    description: "You've entered a mystical realm! Find the map and bring it back to the Pirate to get a broken plane part. Be careful not to fall into the river or you'll be sent back to the start!"
                };
            case 'dungeon-level':
                return {
                    title: "Defeat the Dungeon Ghost",
                    description: "You're trapped in a dangerous dungeon! Defeat the ghost enemy to complete this challenge and progress further. Use left-click to attack, collect health potions when needed, and stay alert!"
                };
            default:
                return {
                    title: "Mysterious Island Adventure",
                    description: "Find all parts of your broken plane scattered around the mysterious island. Talk to NPCs for help and explore different areas to collect the pieces you need to escape!"
                };
        }
    },

    createPauseMenu() {
        this.pauseOverlay = document.createElement('div');
        this.pauseOverlay.id = 'pause-menu-overlay';
        this.pauseOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
            z-index: 10000;
            display: none;
            justify-content: center;
            align-items: center;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        `;

        const objective = this.getLevelObjective();

        this.pauseOverlay.innerHTML = `
            <div style="
                background: linear-gradient(135deg, rgba(20, 30, 50, 0.95), rgba(40, 60, 90, 0.95));
                border: 2px solid rgba(255, 255, 255, 0.2);
                border-radius: 15px;
                padding: 40px;
                max-width: 600px;
                width: 90%;
                height: min(80%, 650px);
                overflow-y: auto;
                text-align: center;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(10px);
            ">
                <h1 style="
                    color: #fff;
                    margin-top: 0;
                    font-size: 2.5em;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
                    margin-bottom: 10px;
                ">Game Paused</h1>
                
                <p style="
                    color: #ccc;
                    font-size: 1.1em;
                    margin-bottom: 30px;
                ">Press <kbd style="background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px; color: #fff;">P</kbd> to resume</p>

                <div style="display: flex; gap: 40px; justify-content: center; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 250px;">
                        <h2 style="color: #87CEEB; margin-bottom: 20px; font-size: 1.5em;">Movement</h2>
                        <div style="text-align: left;">
                            <div style="margin-bottom: 12px; color: #ddd;">
                                <kbd style="background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px; margin-right: 8px; color: #fff; min-width: 30px; display: inline-block; text-align: center;">W</kbd>
                                <kbd style="background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px; margin-right: 12px; color: #fff; min-width: 30px; display: inline-block; text-align: center;">↑</kbd>
                                Move forward
                            </div>
                            <div style="margin-bottom: 12px; color: #ddd;">
                                <kbd style="background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px; margin-right: 8px; color: #fff; min-width: 30px; display: inline-block; text-align: center;">A</kbd>
                                <kbd style="background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px; margin-right: 12px; color: #fff; min-width: 30px; display: inline-block; text-align: center;">←</kbd>
                                Move left
                            </div>
                            <div style="margin-bottom: 12px; color: #ddd;">
                                <kbd style="background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px; margin-right: 8px; color: #fff; min-width: 30px; display: inline-block; text-align: center;">S</kbd>
                                <kbd style="background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px; margin-right: 12px; color: #fff; min-width: 30px; display: inline-block; text-align: center;">↓</kbd>
                                Move backward
                            </div>
                            <div style="margin-bottom: 12px; color: #ddd;">
                                <kbd style="background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px; margin-right: 8px; color: #fff; min-width: 30px; display: inline-block; text-align: center;">D</kbd>
                                <kbd style="background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px; margin-right: 12px; color: #fff; min-width: 30px; display: inline-block; text-align: center;">→</kbd>
                                Move right
                            </div>
                            <div style="margin-bottom: 12px; color: #ddd;">
                                <kbd style="background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px; margin-right: 12px; color: #fff; min-width: 50px; display: inline-block; text-align: center;">SPACE</kbd>
                                Jump
                            </div>
                        </div>
                    </div>

                    <div style="flex: 1; min-width: 250px;">
                        <h2 style="color: #FFB6C1; margin-bottom: 20px; font-size: 1.5em;">Actions</h2>
                        <div style="text-align: left;">
                            <div style="margin-bottom: 12px; color: #ddd;">
                                <kbd style="background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px; margin-right: 12px; color: #fff; min-width: 30px; display: inline-block; text-align: center;">E</kbd>
                                Talk to NPCs / Interact
                            </div>
                            <div style="margin-bottom: 12px; color: #ddd;">
                                <kbd style="background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px; margin-right: 12px; color: #fff; min-width: 80px; display: inline-block; text-align: center;">Left Click</kbd>
                                Attack (in dungeon)
                            </div>
                            <div style="margin-bottom: 12px; color: #ddd;">
                                <kbd style="background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px; margin-right: 12px; color: #fff; min-width: 30px; display: inline-block; text-align: center;">P</kbd>
                                Pause menu
                            </div>
                        </div>

                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.2);">
                            <h3 style="color: #FFD700; margin-bottom: 15px; font-size: 1.2em;">${objective.title}</h3>
                            <p style="color: #ddd; font-size: 0.95em; line-height: 1.4;">
                                ${objective.description}
                            </p>
                        </div>
                    </div>
                </div>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.2);">
                    <button id="resume-game-btn" style="
                        background: linear-gradient(135deg, #4CAF50, #45a049);
                        color: white;
                        border: none;
                        padding: 12px 30px;
                        font-size: 16px;
                        border-radius: 8px;
                        cursor: pointer;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                        transition: all 0.2s ease;
                    " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 12px rgba(0, 0, 0, 0.4)'" 
                       onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 8px rgba(0, 0, 0, 0.3)'">
                        Resume Game
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(this.pauseOverlay);

        const resumeBtn = this.pauseOverlay.querySelector('#resume-game-btn');
        resumeBtn.addEventListener('click', () => {
            this.togglePause();
        });
    },

    recreatePauseMenu() {
        // Remove existing pause menu
        if (this.pauseOverlay && this.pauseOverlay.parentNode) {
            this.pauseOverlay.parentNode.removeChild(this.pauseOverlay);
        }
        
        // Recreate with updated objective
        this.createPauseMenu();
    },

    togglePause() {
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            this.pauseGame();
        } else {
            this.resumeGame();
        }
    },

    pauseGame() {
        // Show pause overlay
        this.pauseOverlay.style.display = 'flex';
        
        // Disable character movement
        if (this.characterEntity && this.characterEntity.components['character-movement']) {
            this.characterEntity.components['character-movement'].isMovementDisabled = true;
        }
        
        // Pause A-Frame scene animations
        this.el.sceneEl.pause();
        
        // Stop any playing sounds
        const audioElements = document.querySelectorAll('[sound]');
        audioElements.forEach(el => {
            const soundComponent = el.components.sound;
            if (soundComponent && soundComponent.isPlaying) {
                soundComponent.pauseSound();
            }
        });
    },

    resumeGame() {
        this.pauseOverlay.style.display = 'none';
        
        if (this.characterEntity && this.characterEntity.components['character-movement']) {
            this.characterEntity.components['character-movement'].isMovementDisabled = false;
        }
        
        this.el.sceneEl.play();
        
        const audioElements = document.querySelectorAll('[sound]');
        audioElements.forEach(el => {
            const soundComponent = el.components.sound;
            if (soundComponent && soundComponent.el.hasAttribute('data-was-playing')) {
                soundComponent.playSound();
                soundComponent.el.removeAttribute('data-was-playing');
            }
        });
    },

    hasPlayerTalkedToWitch() {
        // Check if witch quest flag is set
        return window.witchQuestStarted || false;
    },

    hasPlayerFoundCat() {
        // Check if cat has been picked up
        return window.witchCatFound || false;
    },

    remove() {
        if (this.keyListener) {
            document.removeEventListener("keydown", this.keyListener);
            this.keyListener = null;
        }
        
        if (this.pauseOverlay && this.pauseOverlay.parentNode) {
            this.pauseOverlay.parentNode.removeChild(this.pauseOverlay);
        }
        
        if (pauseMenuInstance === this) {
            pauseMenuInstance = null;
        }
    }
});
