import { ISLAND_LEVEL_URL } from "./constants.js";
import GameStateManager from "./gameState.js";
import { changeLevel } from "./utils.js";
import "./style.css"

GameStateManager.resetGameState();

document.querySelector("#app").innerHTML = /* html */ `
    <div id="start-screen">
    <div class="fog-overlay"></div>
    <div class="content">
      <h1>Mysterious Island</h1>
      <p>Find parts of your broken plane to get off the island.</p>
      <button id="playButton">Enter the Island</button>

      <div class="spacer"></div>

      <div class="divider"></div>

      <h2>Controls</h2>

      <div class="key-controls">
        <ul class="key-controls__list">
          <li class="key-controls-list__item">
            <kbd class="key-controls-list__key">W</kbd>
            <kbd class="key-controls-list__key">↑</kbd>
            &horbar; Move forward
          </li>
          <li class="key-controls-list__item">
            <kbd class="key-controls-list__key">A</kbd>
            <kbd class="key-controls-list__key">←</kbd>
            &horbar; Move to the left
          </li>
          <li class="key-controls-list__item">
            <kbd class="key-controls-list__key">S</kbd>
            <kbd class="key-controls-list__key">↓</kbd>
            &horbar; Move backward
          </li>
          <li class="key-controls-list__item">
            <kbd class="key-controls-list__key">D</kbd>
            <kbd class="key-controls-list__key">→</kbd>
            &horbar; Move to the right
          </li>
        </ul>

        <ul class="key-controls__list">
          <li class="key-controls-list__item">
            <kbd class="key-controls-list__key">E</kbd>
            &horbar; Talk to NPCs/Interact with objects
          </li>

          <li class="key-controls-list__item">
            <kbd class="key-controls-list__key">SPACE</kbd>
            &horbar; Jump
          </li>

          <li class="key-controls-list__item">
            <kbd class="key-controls-list__key">P</kbd>
            &horbar; Pause menu
          </li>

          <li class="key-controls-list__item">
            <kbd class="key-controls-list__key">Left Click</kbd>
            &horbar; Attack &lpar;in a dungeon&rpar;
          </li>
        </ul>
      </div>
    </div>
  </div>
`;

const playButton = document.querySelector("#playButton");
playButton.addEventListener("click", () => {
    changeLevel(ISLAND_LEVEL_URL);
});