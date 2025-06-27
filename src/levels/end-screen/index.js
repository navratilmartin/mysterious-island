import { ISLAND_LEVEL_URL } from "../../constants.js";
import GameStateManager from "../../gameState.js";
import { changeLevel } from "../../utils.js";
import "../../style.css"

document.querySelector("#app").innerHTML = /* html */ `
    <div id="end-screen">
    <div class="fog-overlay"></div>
    <div class="content">
      <h1>Mysterious Island</h1>
      <p>Congratulations! You've just escaped from the island.</p>
      <button id="playButton">Play again</button>
    </div>
  </div>
`;

const playButton = document.querySelector("#playButton");
playButton.addEventListener("click", () => {
    GameStateManager.resetGameState();
    changeLevel(ISLAND_LEVEL_URL);
});