import GameStateManager from "../../gameState.js";
import "../../components/ui/info-box.js";
import "../../components/animations/plane-departure.js";

const state = GameStateManager.getGameState();

AFRAME.registerComponent('check-levels-completion', {
    dependencies: ["info-box", "plane-departure"],

    init: function (){
        this.checkIfPlayerWon();
    },

    checkIfPlayerWon() {
        let numberOfCompletedLevels = 0;
        let numberOfLevels = 0;
        for (const level in state.levels){
            numberOfLevels ++;
            if(state.levels[level].isComplete){
                numberOfCompletedLevels++;
            }
        }
        console.log(numberOfLevels);
        console.log(numberOfCompletedLevels);
        if (numberOfCompletedLevels === numberOfLevels){
            // Trigger plane departure animation instead of immediate level change
            this.el.emit('game-completed');
            return true;
        }
        
        if (numberOfCompletedLevels !== 0) {
            const componentsToFind = numberOfLevels - numberOfCompletedLevels; // each level = plane's component
            this.el.emit("reveal-info-box", { text: `Nice! I've just got the component. I need to find ${componentsToFind} more.`, delay: 0 });
        }

        return false;
    }
});