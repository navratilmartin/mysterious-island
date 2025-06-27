import "../../style.css";
import "../../components/character/character-movement.js";
import "../../components/npc/pirate.js";
import "../../components/utils/follow-box.js";
import "../../components/ui/pause-menu.js";
import "./log-move.js"
import "./map.js"
import "./river-respawn.js"
import "./level-music.js"
import "../../components/ui/info-box.js";

const infoBoxText = "What the... Where am I? Need to talk to that pirate.";

document.querySelector("#app").innerHTML = /* html */ `
  <a-scene 
    id="pirate-level" 
    physics="driver: ammo" 
    info-box="createOnInit: true; createOnInitText: ${infoBoxText}"
    xr-mode-ui="enabled: false"
    pause-menu
  >
    <a-assets>
        <a-asset-item id="characterModel" src="/models/character/character.glb"></a-asset-item>
        <a-asset-item id="pirateModel" src="/models/npc/ally/pirate.glb"></a-asset-item>
        <a-asset-item id="mapModel" src="/models/decorations/map.glb"></a-asset-item>
        <a-asset-item id="treeModel" src="/models/decorations/tree.glb"></a-asset-item>
        <a-asset-item id="grassModel" src="/models/decorations/grass.glb"></a-asset-item>
        <a-asset-item id="organModel" src="/models/decorations/organ.glb"></a-asset-item>

        <img id="grassTexture" src="/textures/grass.jpg">
        <img id="riverTexture" src="/textures/river.jpg">
        <img id="logTexture" src="/textures/log.jpg">
        
        <audio id="level-music" src="/sounds/pirate-music.mp3"></audio>
        <audio id="drown-sound" src="/sounds/drown.mp3"></audio>
    </a-assets>
    
    <!--level sounds-->
    <a-entity id="organ" gltf-model="#organModel" position="-28 2 14.5" scale="2 2 2" rotation="0 -30 0">
        <a-sound src="#level-music" loop="true" volume="0.7"></a-sound>
        <a-entity level-music></a-entity>
    </a-entity>
    <a-entity id="drownSound" sound="src: #drown-sound; autoplay: false; volume: 10"></a-entity>

    <!--river-->
    <a-ocean color="#1e90ff" id="river" position="0 0.4 0" rotation="-90 0 0" width="30" depth="50" ammo-body="type: static; emitCollisionEvents: true" ammo-shape="type: box"></a-ocean>
    
    <!--trees-->
    <a-entity gltf-model="#treeModel" position="-30 1 -18" rotation="0 20 0"></a-entity>
    <a-entity gltf-model="#treeModel" position="-18 0 -22" rotation="0 70 0"></a-entity>
    <a-entity gltf-model="#treeModel" position="-32 1.5 -2" rotation="0 -20 0"></a-entity>
    <a-entity gltf-model="#treeModel" position="-30 0.7 16" rotation="0 38 0"></a-entity>
    <a-entity gltf-model="#treeModel" position="-25 0 20" rotation="0 0 0"></a-entity>
    <a-entity gltf-model="#treeModel" position="-18 1 22" rotation="0 55 0"></a-entity>
    <a-entity gltf-model="#treeModel" position="20 0.7 23" rotation="0 90 0"></a-entity>
    <a-entity gltf-model="#treeModel" position="31 1.5 12" rotation="0 120 0"></a-entity>
    <a-entity gltf-model="#treeModel" position="29 0 1" rotation="0 115 0"></a-entity>
    <a-entity gltf-model="#treeModel" position="26 0 -10" rotation="0 162 0"></a-entity>
    <a-entity gltf-model="#treeModel" position="21 1.5 -19" rotation="0 0 0"></a-entity>
    <a-entity gltf-model="#treeModel" position="32 1 -20" rotation="0 -87 0"></a-entity>
    
    <!--grass-->
    <a-entity gltf-model="#grassModel" position="-20 1 -18" rotation="0 20 0"></a-entity>
    <a-entity gltf-model="#grassModel" position="-31 1 -13" rotation="0 20 0"></a-entity>
    <a-entity gltf-model="#grassModel" position="-29 1 -1" rotation="0 20 0"></a-entity>
    <a-entity gltf-model="#grassModel" position="-28 1 -22" rotation="0 20 0"></a-entity>
    <a-entity gltf-model="#grassModel" position="-19 1 17" rotation="0 20 0"></a-entity>
    <a-entity gltf-model="#grassModel" position="16 1 18" rotation="0 20 0"></a-entity>
    <a-entity gltf-model="#grassModel" position="27 1 17" rotation="0 20 0"></a-entity>
    <a-entity gltf-model="#grassModel" position="31 1 -1" rotation="0 20 0"></a-entity>
    <a-entity gltf-model="#grassModel" position="23 1 -17" rotation="0 20 0"></a-entity>
    <a-entity gltf-model="#grassModel" position="17 1 -20" rotation="0 20 0"></a-entity>
    
    <!--grounds-->
    <a-box ammo-body="type: static;" ammo-shape="type: box" material="src: #grassTexture; repeat: 6 6; wrap: repeat" position="-25 0.5 0" width="20" height="1" depth="50"></a-box>
    <a-box ammo-body="type: static;" ammo-shape="type: box" material="src: #grassTexture; repeat: 6 6; wrap: repeat" position="25 0.5 0" width="20" height="1" depth="50"></a-box>
    
    <!--level boundaries-->
    <a-box position="0 5 26" width="70" height="10" depth="1" visible="false" ammo-body="type: static;" ammo-shape="type: box"></a-box>
    <a-box position="0 5 -26" width="70" height="10" depth="1" visible="false" ammo-body="type: static;" ammo-shape="type: box"></a-box>
    <a-box position="35.5 5 0" rotation="0 90 0" width="70" height="10" depth="1" visible="false" ammo-body="type: static;" ammo-shape="type: box"></a-box>
    <a-box position="-35.5 5 0" rotation="0 90 0" width="70" height="10" depth="1" visible="false" ammo-body="type: static;" ammo-shape="type: box"></a-box>
    
    <!--logs-->
    <a-box ammo-body="type: kinematic;" ammo-shape="type: box" material="src: #logTexture; repeat: 6 6; side: double" class="log" position="-13 0.7 -5" width="1" height="0.5" depth="3" log-move></a-box>
    <a-box ammo-body="type: kinematic;" ammo-shape="type: box" material="src: #logTexture; repeat: 6 6; side: double" class="log" position="-13 0.7 5" width="1" height="0.5" depth="3" log-move></a-box>
    <a-box ammo-body="type: kinematic;" ammo-shape="type: box" material="src: #logTexture; repeat: 6 6; side: double" class="log" position="-11 0.7 0" width="1" height="0.5" depth="3" log-move></a-box>
    <a-box ammo-body="type: kinematic;" ammo-shape="type: box" material="src: #logTexture; repeat: 6 6; side: double" class="log" position="-11 0.7 -11" width="1" height="0.5" depth="3" log-move></a-box>
    <a-box ammo-body="type: kinematic;" ammo-shape="type: box" material="src: #logTexture; repeat: 6 6; side: double" class="log" position="-8 0.7 -4" width="1" height="0.5" depth="3" log-move></a-box>
    <a-box ammo-body="type: kinematic;" ammo-shape="type: box" material="src: #logTexture; repeat: 6 6; side: double" class="log" position="-8 0.7 -17.5" width="1" height="0.5" depth="3" log-move></a-box>
    <a-box ammo-body="type: kinematic;" ammo-shape="type: box" material="src: #logTexture; repeat: 6 6; side: double" class="log" position="-8 0.7 4" width="1" height="0.5" depth="3" log-move></a-box>
    <a-box ammo-body="type: kinematic;" ammo-shape="type: box" material="src: #logTexture; repeat: 6 6; side: double" class="log" position="-5 0.7 9" width="1" height="0.5" depth="3" log-move></a-box>
    <a-box ammo-body="type: kinematic;" ammo-shape="type: box" material="src: #logTexture; repeat: 6 6; side: double" class="log" position="-5 0.7 -9" width="1" height="0.5" depth="3" log-move></a-box>
    <a-box ammo-body="type: kinematic;" ammo-shape="type: box" material="src: #logTexture; repeat: 6 6; side: double" class="log" position="-3 0.7 -16" width="1" height="0.5" depth="3" log-move></a-box>
    <a-box ammo-body="type: kinematic;" ammo-shape="type: box" material="src: #logTexture; repeat: 6 6; side: double" class="log" position="-3 0.7 2.5" width="1" height="0.5" depth="3" log-move></a-box>
    <a-box ammo-body="type: kinematic;" ammo-shape="type: box" material="src: #logTexture; repeat: 6 6; side: double" class="log" position="0 0.7 -1.5" width="1" height="0.5" depth="3" log-move></a-box>
    <a-box ammo-body="type: kinematic;" ammo-shape="type: box" material="src: #logTexture; repeat: 6 6; side: double" class="log" position="0 0.7 -11" width="1" height="0.5" depth="3" log-move></a-box>
    <a-box ammo-body="type: kinematic;" ammo-shape="type: box" material="src: #logTexture; repeat: 6 6; side: double" class="log" position="2 0.7 5" width="1" height="0.5" depth="3" log-move></a-box>
    <a-box ammo-body="type: kinematic;" ammo-shape="type: box" material="src: #logTexture; repeat: 6 6; side: double" class="log" position="2 0.7 -6" width="1" height="0.5" depth="3" log-move></a-box>
    <a-box ammo-body="type: kinematic;" ammo-shape="type: box" material="src: #logTexture; repeat: 6 6; side: double" class="log" position="5 0.7 10" width="1" height="0.5" depth="3" log-move></a-box>
    <a-box ammo-body="type: kinematic;" ammo-shape="type: box" material="src: #logTexture; repeat: 6 6; side: double" class="log" position="5 0.7 -12" width="1" height="0.5" depth="3" log-move></a-box>
    <a-box ammo-body="type: kinematic;" ammo-shape="type: box" material="src: #logTexture; repeat: 6 6; side: double" class="log" position="8 0.7 -18" width="1" height="0.5" depth="3" log-move></a-box>
    <a-box ammo-body="type: kinematic;" ammo-shape="type: box" material="src: #logTexture; repeat: 6 6; side: double" class="log" position="8 0.7 15.5" width="1" height="0.5" depth="3" log-move></a-box>
    <a-box ammo-body="type: kinematic;" ammo-shape="type: box" material="src: #logTexture; repeat: 6 6; side: double" class="log" position="8 0.7 3" width="1" height="0.5" depth="3" log-move></a-box>
    <a-box ammo-body="type: kinematic;" ammo-shape="type: box" material="src: #logTexture; repeat: 6 6; side: double" class="log" position="11 0.7 -23" width="1" height="0.5" depth="3" log-move></a-box>
    <a-box ammo-body="type: kinematic;" ammo-shape="type: box" material="src: #logTexture; repeat: 6 6; side: double" class="log" position="11 0.7 12" width="1" height="0.5" depth="3" log-move></a-box>
    <a-box ammo-body="type: kinematic;" ammo-shape="type: box" material="src: #logTexture; repeat: 6 6; side: double" class="log" position="13 0.7 -16.5" width="1" height="0.5" depth="3" log-move></a-box>
    <a-box ammo-body="type: kinematic;" ammo-shape="type: box" material="src: #logTexture; repeat: 6 6; side: double" class="log" position="13 0.7 6" width="1" height="0.5" depth="3" log-move></a-box>
    <a-box ammo-body="type: kinematic;" ammo-shape="type: box" material="src: #logTexture; repeat: 6 6; side: double" class="log" position="13 0.7 -0.5" width="1" height="0.5" depth="3" log-move></a-box>


    
    <!-- Světlo a obloha -->
    <a-sky color="#87CEEB"></a-sky>

    
    <!--map-->
    <a-entity map="speed: 100" gltf-model="#mapModel" position="22 2 0" rotation="0 -90 0" scale="0.2 0.2 0.2">
        <a-entity id="map-bubble" visible="false" position="0 13 0">
            <a-box id="bubble-box" geometry="height: 2.5; width: 10; depth: 0.5" material="color: black; opacity: 0.7"></a-box>
            <a-entity id="bubble-text" text="value: Press E to take the map; align: center; color: white; width: 20" position="0 0 0.25"> </a-entity>
        </a-entity>
    </a-entity>
    
      
    <!--pirate-->
    <a-entity id="pirateContainer" pirate="model: #pirate; inLevel: true" position="-24 1 10" rotation="0 180 0">
        <a-entity id="pirate" gltf-model="#pirateModel" scale="2 1.5 2"></a-entity>
        <a-entity id="pirate-bubble" visible="false" position="0 3.5 0">
            <a-box id="bubble-box" geometry="height: 0.5; width: 2; depth: 0.1" material="color: black; opacity: 0.7"></a-box>
            <a-entity id="bubble-text" text="value: Press E for talk; align: center; color: white; width: 4" position="0 0 0.05"> </a-entity>
        </a-entity>
    </a-entity>
    
    <!-- Character -->
    <a-entity 
        id="characterContainer"  
        character-movement="model: #character"
        ammo-body="type: dynamic; angularFactor: 0 0 0; mass: 20; emitCollisionEvents: true"
        position="-20 5 -5"
        river-respawn
    >
        <a-entity 
            id="character"
            gltf-model="#characterModel" 
            animation-mixer="clip: idle;" 
            position="0 0 0" 
            rotation="0 180 0" 
            scale="1 1 1" 
            shadow="cast: true"
        ></a-entity>
    </a-entity>

    <!-- Camera -->
    <a-entity 
        follow-box="target: #characterContainer" 
        look-controls="pointerLockEnabled: true"
    >
        <a-entity camera position="0 1.6 3" ></a-entity>
    </a-entity>
  </a-scene>
`;
