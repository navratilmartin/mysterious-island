import "../../components/character/character-movement.js";
import "../../components/decorations/spawn-crash-site.js";
import "../../components/npc/witch.js";
import "../../components/npc/pirate.js";
import "../../components/npc/native.js";
import "../../components/npc/cat.js";
import "../../components/island/island.js";
import "../../levels/island/level-music.js";
import "../../levels/island/check-levels-completion.js";
import "../../levels/island/wings.js";
import "../../components/utils/follow-box.js";
import "../../components/utils/day-night-cycle.js";
import "../../components/ui/pause-menu.js";
import "./ocean-respawn.js";
import "../../style.css";

document.querySelector("#app").innerHTML = /* html */ `
  <a-scene 
    id="scene" 
    xr-mode-ui="enabled: false"
    physics="driver: ammo" 
    check-levels-completion
    day-night-cycle="cycleDuration: 90000; sunSpeed: 0.8"
    pause-menu
  >
    <a-assets>
        <a-asset-item id="characterModel" src="/models/character/character.glb"></a-asset-item>
        <a-asset-item id="islandModel" src="/models/terrain/Island.glb"></a-asset-item>
        <a-asset-item id="planePhase0" src="/models/airplane/airplane_without_wheels_screw_wings.glb"></a-asset-item>
        <a-asset-item id="planePhase1" src="/models/airplane/airplane_without_wheels_screw.glb"></a-asset-item>
        <a-asset-item id="planePhase2" src="/models/airplane/airplane_without_wheels.glb"></a-asset-item>
        <a-asset-item id="planePhase3" src="/models/airplane/airplane.glb"></a-asset-item>
        <a-asset-item id="planePhase4" src="/models/airplane/airplane_with_character.glb"></a-asset-item>
        <a-asset-item id="generator" src="/models/decorations/generator.glb"></a-asset-item>
        <a-asset-item id="gear" src="/models/decorations/gear.glb"></a-asset-item>
        <a-asset-item id="tent" src="/models/decorations/tent.glb"></a-asset-item>
        <a-asset-item id="campingStuff" src="/models/decorations/camping_stuff.glb"></a-asset-item>
        <a-asset-item id="bonfire" src="/models/decorations/bonfire.glb"></a-asset-item>
        <a-asset-item id="witchModel" src="/models/npc/ally/witch.glb"></a-asset-item>
        <a-asset-item id="pirateModel" src="/models/npc/ally/pirate.glb"></a-asset-item>
        <a-asset-item id="nativeModel" src="/models/npc/ally/native.glb"></a-asset-item>
        <a-asset-item id="catModel" src="/models/npc/ally/cat.glb"></a-asset-item>
        <a-asset-item id="tree1" src="/models/decorations/tree.glb"></a-asset-item>
        <a-asset-item id="tree2" src="/models/decorations/tree2.glb"></a-asset-item>
        <a-asset-item id="tree3" src="/models/decorations/tree3.glb"></a-asset-item>
        <a-asset-item id="tree4" src="/models/decorations/tree4.glb"></a-asset-item>
        <a-asset-item id="tree5" src="/models/decorations/tree5.glb"></a-asset-item>
        <a-asset-item id="bridgeModel" src="/models/decorations/bridge.glb"></a-asset-item>
        <a-asset-item id="bushModel" src="/models/decorations/bush.glb"></a-asset-item>
        <a-asset-item id="witchHouseModel" src="/models/decorations/witch-house.glb"></a-asset-item>
        <a-asset-item id="mushroomsModel" src="/models/decorations/mushrooms.glb"></a-asset-item>
        <a-asset-item id="shipModel" src="/models/decorations/ship.glb"></a-asset-item>
        <a-asset-item id="beachChairsModel" src="/models/decorations/beach-chairs.glb"></a-asset-item>
        <a-asset-item id="sandCastleModel" src="/models/decorations/sand-castle.glb"></a-asset-item>
        <a-asset-item id="crabModel" src="/models/decorations/crab.glb"></a-asset-item>
        <a-asset-item id="palmModel" src="/models/decorations/palm.glb"></a-asset-item>
        <a-asset-item id="farmModel" src="/models/decorations/farm.glb"></a-asset-item>
        <a-asset-item id="cowModel" src="/models/decorations/cow.glb"></a-asset-item>
        <a-asset-item id="stumpModel" src="/models/decorations/stump.glb"></a-asset-item>
        <a-asset-item id="treesAndRockModel" src="/models/decorations/trees-and-rock.glb"></a-asset-item>
        <a-asset-item id="logModel" src="/models/decorations/log.glb"></a-asset-item>
        <a-asset-item id="rockModel" src="/models/decorations/rock.glb"></a-asset-item>
        <a-asset-item id="wingsModel" src="/models/decorations/wings.glb"></a-asset-item>
        <a-asset-item id="tikiHeadModel" src="/models/decorations/tiki-head.glb"></a-asset-item>
        <a-asset-item id="mysticTreeModel" src="/models/decorations/mystic-tree.glb"></a-asset-item>
        <a-asset-item id="grassGreenModel" src="/models/decorations/grass-green.glb"></a-asset-item>
        
        <img id="gravelTexture" src="/textures/gravel.jpg">
        <audio id="meow" src="/sounds/meow.mp3"></audio>
        <audio id="moo" src="/sounds/moo.mp3"></audio>
        <audio id="drown-sound" src="/sounds/drown.mp3"></audio>
    </a-assets>
    
    <!--Sounds-->
    <a-entity id="drownSound" sound="src: #drown-sound; autoplay: false; volume: 10"></a-entity>
    
    <!--Sky-->
    <a-entity id="environment" environment="
      ground: none;
      dressing: none;
      skyType: atmosphere;
      lighting: distant;
      fog: 0.3;
      shadow: true;
    "></a-entity>

    <!--Ocean-->
    <a-ocean id="ocean"
        color="#1e90ff"
         width="500"
         depth="500"
         density="20"
         speed="1"
         position="0 -6.3 0"
         ammo-body="type: static; emitCollisionEvents: true"
         ammo-shape="type: box"></a-ocean>
         
    <!--River-->
     <a-ocean color="#4fc3f7"
         width="65"
         depth="140"
         density="20"
         speed="0.5"
         position="-6 -1.887 -8"></a-ocean>
     <a-ocean color="#4fc3f7"
         width="40"
         depth="40"
         density="20"
         speed="0.5"
         position="46.25 -1.887 3.7"></a-ocean>
    
    <!--Bridge-->
    <a-entity gltf-model="#bridgeModel" position="23.88 -1.325 2.97" rotation="0 90 0" scale="2 1.5 2" ammo-body="type: static;" ammo-shape="type: mesh"></a-entity>
    <a-entity gltf-model="#bridgeModel" position="17.2 -1.325 -42.85"  scale="2 1.5 2" ammo-body="type: static;" ammo-shape="type: mesh"></a-entity>

    <!-- Ground -->
    <a-entity
        id="island"
        island="modelId: #islandModel; pos: 0 -1 0; rot: 0 0 0; scale: 0.3 1 0.3"
        shadow="cast: true; receive: true"
    ></a-entity>

    <!-- Character -->
    <a-entity 
        id="characterContainer"  
        character-movement="model: #character"
        ammo-body="type: dynamic; angularFactor: 0 0 0; mass: 20; emitCollisionEvents: true"
        position="39 0.51 79"
        ocean-respawn="respawnPosition: 39 0.51 79;"
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
    
    <!-- Witch -->
    <a-entity witch="model: #witch" position="-45 0.28 10.5">
        <a-entity id="witch" gltf-model="#witchModel" scale="2 1.5 2"></a-entity>
        <a-entity id="witch-bubble" visible="false" position="0 3.5 0">
            <a-box id="bubble-box" geometry="height: 0.5; width: 2; depth: 0.1" material="color: black; opacity: 0.7"></a-box>
            <a-entity id="bubble-text" text="value: Press E for talk; align: center; color: white; width: 4" position="0 0 0.05"> </a-entity>
        </a-entity>
    </a-entity>
    
    <!--Cat-->
    <a-entity id="cat" cat position="-44 -1 -75">
        <a-entity gltf-model="#catModel" scale="0.5 0.5 0.5"></a-entity>
        <a-sound src="#meow" loop="true" autoplay="false" volume="0.1"></a-sound>
        <a-entity level-music></a-entity>
    </a-entity>
    
    <!-- Pirate -->
    <a-entity pirate="model: #pirate" position="29 -0.9 -17.5">
        <a-entity id="pirate" gltf-model="#pirateModel" scale="2 1.5 2"></a-entity>
        <a-entity id="pirate-bubble" visible="false" position="0 3.5 0">
            <a-box id="bubble-box" geometry="height: 0.5; width: 2; depth: 0.1" material="color: black; opacity: 0.7"></a-box>
            <a-entity id="bubble-text" text="value: Press E for talk; align: center; color: white; width: 4" position="0 0 0.05"> </a-entity>
        </a-entity>
    </a-entity>
    
    <!-- Native -->
    <a-entity native="model: #native" position="-29 2.1 -45">
        <a-entity id="native" gltf-model="#nativeModel" scale="2 2 2"></a-entity>
        <a-entity id="native-bubble" visible="false" position="0 3.5 0">
            <a-box id="bubble-box" geometry="height: 0.5; width: 2; depth: 0.1" material="color: black; opacity: 0.7"></a-box>
            <a-entity id="bubble-text" text="value: Press E for talk; align: center; color: white; width: 4" position="0 0 0.05"> </a-entity>
        </a-entity>
    </a-entity>
    
    <!-- Plane crash site -->
    <a-entity spawn-crash-site position="35.5 0 71" rotation="0 175 0"></a-entity>

    <!-- Camera -->
    <a-entity 
        follow-box="target: #characterContainer" 
        look-controls="pointerLockEnabled: true"
    >
        <a-entity camera position="0 1.6 3" ></a-entity>
    </a-entity>
    
    <!--Rock-->
    <a-entity gltf-model="#rockModel" position="-3.6 -0.98 -30" rotation="0 30 0" scale="8 8 8" ammo-body="type: static;" ammo-shape="type: mesh"></a-entity>
    <a-entity gltf-model="#rockModel" position="-37.5 1.9 -36.65" rotation="0 30 0" scale="8 8 8" ammo-body="type: static;" ammo-shape="type: mesh"></a-entity>
    <a-entity gltf-model="#rockModel" position="-56.9 1.9 -37.6" rotation="0 90 0" scale="8 8 8" ammo-body="type: static;" ammo-shape="type: mesh"></a-entity>
    <a-entity gltf-model="#rockModel" position="-50 17.1 -44.8" rotation="0 130 0" scale="8 8 8" ammo-body="type: static;" ammo-shape="type: mesh"></a-entity>
    <a-entity gltf-model="#rockModel" position="-10 9.9 -38.5" rotation="0 130 0" scale="8 8 8" ammo-body="type: static;" ammo-shape="type: mesh"></a-entity>
    <a-entity gltf-model="#rockModel" position="-14.8 9.9 -64.2" rotation="0 130 0" scale="8 8 8" ammo-body="type: static;" ammo-shape="type: mesh"></a-entity>
    <a-entity gltf-model="#rockModel" position="-39 2.2 -62.5" rotation="0 130 0" scale="8 8 8" ammo-body="type: static;" ammo-shape="type: mesh"></a-entity>
    <a-entity gltf-model="#rockModel" position="-58.4 2.2 -52.7" rotation="0 130 0" scale="8 8 8" ammo-body="type: static;" ammo-shape="type: mesh"></a-entity>
    <a-entity wings gltf-model="#wingsModel" scale="0.01 0.01 0.01" position="-54.00071 17.90941 -56.10526" rotation="0 -120 0"></a-entity>
      
    <!--Farm-->
    <a-entity gltf-model="#farmModel" position="-49 -0.17 59" scale="8 8 8" rotation="0 115 0" ammo-body="type: static;" ammo-shape="type: mesh"></a-entity>
    <a-entity id="cow" position="-51.31903 -0.24498 47.91676" rotation="0 60 0">
        <a-entity gltf-model="#cowModel" scale="0.5 0.5 0.5" animation-mixer="clip: Idle"></a-entity>
        <a-sound src="#moo" loop="true" autoplay="false" volume="0.2"></a-sound>
        <a-entity level-music></a-entity>
    </a-entity>
    
    <!--Beach-->
    <a-entity gltf-model="#crabModel" scale="0.001 0.001 0.001" position="8.59073 -4.28829 83.92255" rotation="0 -45 0"></a-entity>
    <a-entity gltf-model="#crabModel" scale="0.001 0.001 0.001" position="-17.19661 -5.13941 90.08331" rotation="0 38 0"></a-entity>
    <a-entity gltf-model="#beachChairsModel" scale="0.01 0.01 0.01" position="1.81758 -2.34948 78.09626"></a-entity>
    <a-entity gltf-model="#sandCastleModel" scale="0.01 0.01 0.01" position="-7.37258 -4.5284 83.81126" rotation="0 90 0"></a-entity>
    <a-entity gltf-model="#palmModel" position="-5.60087 -3.81526 75.07722"></a-entity>
        
    <!--Witch forest-->
    <a-entity gltf-model="#tree4" position="-45 5.4 18.8" scale="3 3 3"></a-entity>
    <a-entity gltf-model="#tree4" position="-35.8 5.4 10" scale="3 3 3"></a-entity>
    <a-entity gltf-model="#tree4" position="-31.5 3.6 20.6" scale="2 2 2"></a-entity>
    <a-entity gltf-model="#tree4" position="-43 3.6 7.6" scale="2 2 2"></a-entity>
    <a-entity gltf-model="#tree4" position="-38.17 7.1 16.8" scale="4 4 4"></a-entity>
    <a-entity gltf-model="#tree4" position="-51.4 4.2 0.1" scale="3 3 3"></a-entity>
    <a-entity gltf-model="#tree4" position="-41 7.55 -3.2" scale="5 5 5"></a-entity>
    <a-entity gltf-model="#tree4" position="-50 2.45 -9" scale="2 2 2"></a-entity>
    <a-entity gltf-model="#tree4" position="-61.3 4.2 5.5" scale="3 3 3"></a-entity>
    <a-entity gltf-model="#tree4" position="-67 7.55 15.2" scale="5 5 5"></a-entity>
    <a-entity gltf-model="#tree4" position="-59.7 5.9 -5.7" scale="4 4 4"></a-entity>
    <a-entity gltf-model="#tree4" position="-61.5 4.2 26" scale="3 3 3"></a-entity>
    <a-entity gltf-model="#tree4" position="-67 7.55 -16.5" scale="5 5 5"></a-entity>
    <a-entity gltf-model="#tree4" position="-71 4.2 -7" scale="3 3 3"></a-entity>
    <a-entity gltf-model="#tree4" position="-68.2 5.9 1.45" scale="4 4 4"></a-entity>
    <a-entity gltf-model="#tree4" position="-55 4.2 -16.4" scale="3 3 3"></a-entity>
    <!--Witch house-->
    <a-entity gltf-model="#witchHouseModel" position="-52.3011 0.21905 14.51631" scale="3 3 3" rotation="0 -90 0" ammo-body="type: static;" ammo-shape="type: mesh"></a-entity>
    <!--Mushrooms-->
    <a-entity gltf-model="#mushroomsModel" position="-63.84635 -0.75 20.32835" scale="3 3 3" rotation="0 30 0"></a-entity>
    <a-entity gltf-model="#mushroomsModel" position="-70.9406 -0.75 -3.86192" scale="3 3 3"></a-entity>
    <a-entity gltf-model="#mushroomsModel" position="-54.39255 -0.75 -11.26295" scale="3 3 3"></a-entity>
    <a-entity gltf-model="#mushroomsModel" position="-48.30589 -0.75 2.07289" scale="3 3 3" rotation="0 60 0"></a-entity>
    <a-entity gltf-model="#mushroomsModel" position="-36.6043 0.4 13.67982" scale="3 3 3" rotation="0 90 0"></a-entity>
    <a-entity gltf-model="#mushroomsModel" position="-43.31942 0.4 20.23064" scale="3 3 3" rotation="0 -30 0"></a-entity>
    <!--Stumps-->
    <a-entity gltf-model="#stumpModel" position="-34.5 -0.98 28"></a-entity>
    <a-entity gltf-model="#stumpModel" position="-74 -0.98 7"></a-entity>
    <a-entity gltf-model="#stumpModel" position="-46.6 -0.98 -17.5"></a-entity>
    <a-entity gltf-model="#logModel" position="-35.5 -0.98 -12" rotation="0 30 0" scale="3 3 3"></a-entity>
    <a-entity gltf-model="#logModel" position="-73.7 -0.98 30.5" rotation="0 -30 0" scale="3 3 3"></a-entity>
    
    <!--Pirate forest-->
    <a-entity gltf-model="#tree5" position="27 1.8 -9.4" scale="7 7 7"></a-entity>
    <a-entity gltf-model="#tree5" position="35 1.8 -25" scale="7 7 7" rotation="0 30 0"></a-entity>
    <a-entity gltf-model="#tree5" position="25.5 1.8 -32" scale="7 7 7" rotation="0 60 0"></a-entity>
    <a-entity gltf-model="#tree5" position="43 1.8 -19" scale="7 7 7" rotation="0 30 0"></a-entity>
    <a-entity gltf-model="#tree3" position="39.5 5 -50" scale="3 3 3"></a-entity>
    <a-entity gltf-model="#tree2" position="51.5 6 -45" scale="5 5 5"></a-entity>
    <a-entity gltf-model="#tree3" position="35.8 4.1 -13.5" scale="3 3 3"></a-entity>
    <a-entity gltf-model="#logModel" position="33 -0.18 -61" rotation="0 -30 0" scale="3 3 3"></a-entity>
    <a-entity gltf-model="#logModel" position="49 -0.18 -52" rotation="0 30 0" scale="3 3 3"></a-entity>
    <a-entity gltf-model="#treesAndRockModel" scale="0.5 0.5 0.5" position="63.48214 -1.8 35.53184" rotation="0 -134.39 0" ammo-body="type: static;" ammo-shape="type: mesh"></a-entity>
    
    <a-entity gltf-model="#shipModel" position="145 -3.5 0" rotation="0 90 0" scale="2 2 2"></a-entity>
    
    <!--Cat tree-->
    <a-entity gltf-model="#tree5" position="-42.3 1.8 -76.4" scale="7 7 7" rotation="0 30 0"></a-entity>

    <!--Bushes-->
    <a-entity gltf-model="#bushModel" position="48 -1 56.5" scale="0.05 0.05 0.05"></a-entity>
    <a-entity gltf-model="#bushModel" position="45 -1 31" scale="0.05 0.05 0.05"></a-entity>
    <a-entity gltf-model="#bushModel" position="60 -1 20" scale="0.05 0.05 0.05"></a-entity>
    <a-entity gltf-model="#bushModel" position="67 -1 -31" scale="0.05 0.05 0.05"></a-entity>
    <a-entity gltf-model="#bushModel" position="-12 -1 41.5" scale="0.05 0.05 0.05"></a-entity>
    <a-entity gltf-model="#bushModel" position="-68 -1 63.5" scale="0.05 0.05 0.05"></a-entity>
    <a-entity gltf-model="#bushModel" position="-74 -1 23" scale="0.05 0.05 0.05"></a-entity>
    <a-entity gltf-model="#bushModel" position="-77 -1 -47.5" scale="0.05 0.05 0.05"></a-entity>
    <a-entity gltf-model="#bushModel" position="-91 -1 -20" scale="0.05 0.05 0.05"></a-entity>
    
    <!--Altar-->
    <a-entity gltf-model="#tikiHeadModel" scale="7 7 7" position="-12.50347 0.31857 -1.42031" rotation="0.37 0 -12.28" ammo-body="type: static;" ammo-shape="type: mesh"></a-entity>    
    <a-entity gltf-model="#tikiHeadModel" scale="7 7 7" position="-10.01149 0.44523 -9.99846" rotation="0 0 10.41" ammo-body="type: static;" ammo-shape="type: mesh"></a-entity>
    <a-entity gltf-model="#tikiHeadModel" scale="7 7 7" position="-1.27723 0.5 -14.70453" rotation="-8.83 -20 11.28" ammo-body="type: static;" ammo-shape="type: mesh"></a-entity>
    <a-entity gltf-model="#tikiHeadModel" scale="7 7 7" position="6.34139 0.18181 -7.57389" rotation="-12.06 30 0" ammo-body="type: static;" ammo-shape="type: mesh"></a-entity>
    <a-entity gltf-model="#tikiHeadModel" scale="7 7 7" position="6.34139 -0.68643 0.0013" rotation="9.42 90 0" ammo-body="type: static;" ammo-shape="type: mesh"></a-entity>
    <a-entity gltf-model="#tikiHeadModel" scale="7 7 7" position="-1.27723 0.15473 7.26202" rotation="-8.83 20 11.28" ammo-body="type: static;" ammo-shape="type: mesh"></a-entity>
    <a-entity gltf-model="#mysticTreeModel" scale="5 5 5" position="-2.23618 1.9 -2.86933" ammo-body="type: static;" ammo-shape="type: mesh"></a-entity>
    <a-entity gltf-model="#grassGreenModel" position="1.60896 -0.95135 6.87966" scale="2 2 2"></a-entity>
    <a-entity gltf-model="#grassGreenModel" position="-5.05031 -0.95135 4.23397" scale="2 1 2"></a-entity>
    <a-entity gltf-model="#grassGreenModel" position="-6.05494 -0.95135 0.54827" scale="2 1 2"></a-entity>
    <a-entity gltf-model="#grassGreenModel" position="-0.71503 -0.95135 -7.35038" scale="2 2 2"></a-entity>
    <a-entity gltf-model="#grassGreenModel" position="-8.10329 -0.95135 -3.87765" scale="2 2 2"></a-entity>
    <a-entity gltf-model="#grassGreenModel" position="8.69178 -0.95135 -3.87765" scale="2 2 2"></a-entity>
    <a-entity gltf-model="#grassGreenModel" position="5.63732 -0.95135 -11.89744" scale="2 1 2"></a-entity>
    <a-entity gltf-model="#grassGreenModel" position="-6.43148 -0.95135 -13.15852" scale="2 1 2"></a-entity>
    <a-entity gltf-model="#grassGreenModel" position="-13.40453 -0.95135 -7.37729" scale="2 1 2"></a-entity>
    <a-entity gltf-model="#grassGreenModel" position="-11.32916 -0.95135 5.1304" scale="2 2 2"></a-entity>
    </a-scene>
`;