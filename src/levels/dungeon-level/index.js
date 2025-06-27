import "../../style.css";
import "../../components/character/character-movement.js";
import "../../components/character/character-combat.js";
import "../../components/utils/follow-box.js";
import "../../components/npc/enemy.js"
import "../../components/decorations/potion.js"
import "../../components/ui/health-bar.js";
import "../../components/ui/info-box.js";
import "../../components/ui/pause-menu.js";

document.querySelector("#app").innerHTML = /* html */`
  <!-- Health Bar -->
  <div id="health-container">
    <div id="health-container__progress"></div>
  </div>

  <a-scene 
    id="dungeon-level" 
    xr-mode-ui="enabled: false"
    physics="driver: ammo" 
    info-box="createOnInit: true; createOnInitText: Alright, I need to kill the ghost.."
    pause-menu
  >
    <a-assets>
        <a-asset-item id="characterModel" src="/models/character/character.glb"></a-asset-item>        
        <a-asset-item id="alienModel" src="/models/npc/enemy/alien.glb"></a-asset-item>        
        <a-asset-item id="ghostModel" src="/models/npc/enemy/ghost.glb"></a-asset-item>        
        <a-asset-item id="orcModel" src="/models/npc/enemy/orc.glb"></a-asset-item>        
        <a-asset-item id="slimeModel" src="/models/npc/enemy/slime.glb"></a-asset-item>   
        <a-asset-item id="torchModel" src="/models/decorations/torch.glb"></a-asset-item>     
        <a-asset-item id="lanternModel" src="/models/decorations/lantern.glb"></a-asset-item>  
        <a-asset-item id="potionModel" src="/models/decorations/potion.glb"></a-asset-item>        
        
        <img id="gravelTexture" src="/textures/gravel.jpg">
        <img id="stoneWallTexture" src="/textures/stone-wall.jpg">
    </a-assets>
    
    <!--Enemies-->
    <a-entity enemy="type: orc;" class="enemy" position="-16 0.6 21.5" rotation="0 180 0">
        <a-entity scale="3 3 3" gltf-model="#orcModel"></a-entity>
    </a-entity>
    <a-entity enemy="type: orc;" class="enemy" position="29 0.6 18" rotation="0 180 0">
        <a-entity scale="3 3 3" gltf-model="#orcModel"></a-entity>
    </a-entity>
    <a-entity enemy="type: alien;" class="enemy" position="6 0.5 14.3" rotation="0 180 0">
        <a-entity scale="1.5 1.5 1.5" gltf-model="#alienModel"></a-entity>
    </a-entity>
    <a-entity enemy="type: alien;" class="enemy" position="20.4 0.5 -16" rotation="0 180 0">
        <a-entity scale="1.5 1.5 1.5" gltf-model="#alienModel"></a-entity>
    </a-entity>
    <a-entity enemy="type: alien;" class="enemy" position="30.1 0.5 -12" rotation="0 180 0">
        <a-entity scale="1.5 1.5 1.5" gltf-model="#alienModel"></a-entity>
    </a-entity>
    <a-entity enemy="type: alien;" class="enemy" position="23.5 0.5 -30" rotation="0 180 0">
        <a-entity scale="1.5 1.5 1.5" gltf-model="#alienModel"></a-entity>
    </a-entity>
    <a-entity enemy="type: ghost;" class="enemy" position="-4 0 -13" rotation="0 180 0">
        <a-entity scale="2 2 2" gltf-model="#ghostModel"></a-entity>
    </a-entity>
    
    <!--Potion-->
    <a-entity potion gltf-model="#potionModel" position="-4 1.7 -29" scale="3 3 3"></a-entity>
    
    <!--Cave Outer-->
    <a-box ammo-body="type: static;" ammo-shape="type: box" material="src: #gravelTexture; repeat: 1 1; wrap: repeat" width="70" height="1" depth="70"></a-box>
    <a-box position="0 10 0" ammo-body="type: static;" ammo-shape="type: box" material="src: #gravelTexture; repeat: 3 10; wrap: repeat" width="70" height="1" depth="70"></a-box>
    <a-box position="-34.5 5 0" ammo-body="type: static;" ammo-shape="type: box" material="src: #stoneWallTexture; repeat: 7 1; wrap: repeat" width="1" height="10" depth="70"></a-box>
    <a-box position="34.5 5 0" ammo-body="type: static;" ammo-shape="type: box" material="src: #stoneWallTexture; repeat: 7 1; wrap: repeat" width="1" height="10" depth="70"></a-box>
    <a-box position="0 5 34.5" rotation="0 90 0" ammo-body="type: static;" ammo-shape="type: box" material="src: #stoneWallTexture; repeat: 7 1; wrap: repeat" width="1" height="10" depth="70"></a-box>
    <a-box position="0 5 -34.5" rotation="0 90 0" ammo-body="type: static;" ammo-shape="type: box" material="src: #stoneWallTexture; repeat: 7 1; wrap: repeat" width="1" height="10" depth="70"></a-box>
    <!--Cave Inner-->
    <a-box position="-24.5 5 25" ammo-body="type: static;" ammo-shape="type: box" material="src: #stoneWallTexture; repeat: 2 1; wrap: repeat" width="1" height="10" depth="20"></a-box>
    <a-box position="-20 5 4" rotation="0 90 0" ammo-body="type: static;" ammo-shape="type: box" material="src: #stoneWallTexture; repeat: 3 1; wrap: repeat" width="1" height="10" depth="30"></a-box>
    <a-box position="-5.5 5 13.5" ammo-body="type: static;" ammo-shape="type: box" material="src: #stoneWallTexture; repeat: 2 1; wrap: repeat" width="1" height="10" depth="20"></a-box>
    <a-box position="9 5 24" rotation="0 90 0" ammo-body="type: static;" ammo-shape="type: box" material="src: #stoneWallTexture; repeat: 3 1; wrap: repeat" width="1" height="10" depth="30"></a-box>
    <a-box position="23.5 5 13.5" ammo-body="type: static;" ammo-shape="type: box" material="src: #stoneWallTexture; repeat: 2 1; wrap: repeat" width="1" height="10" depth="20"></a-box>
    <a-box position="9 5 17.5" rotation="0 90 0" ammo-body="type: static;" ammo-shape="type: box" material="src: #stoneWallTexture; repeat: 1 1; wrap: repeat" width="1" height="10" depth="15"></a-box>
    <a-box position="2 5 11" rotation="0 90 0" ammo-body="type: static;" ammo-shape="type: box" material="src: #stoneWallTexture; repeat: 1 1; wrap: repeat" width="1" height="10" depth="15"></a-box>
    <a-box position="16 5 5" ammo-body="type: static;" ammo-shape="type: box" material="src: #stoneWallTexture; repeat: 2 1; wrap: repeat" width="1" height="10" depth="25"></a-box>
    <a-box position="-4.5 5 -7" rotation="0 90 0" ammo-body="type: static;" ammo-shape="type: box" material="src: #stoneWallTexture; repeat: 4 1; wrap: repeat" width="1" height="10" depth="40"></a-box>
    <a-box position="9 5 5.5" ammo-body="type: static;" ammo-shape="type: box" material="src: #stoneWallTexture; repeat: 1 1; wrap: repeat" width="1" height="10" depth="10"></a-box>
    <a-box position="2 5 -1.5" ammo-body="type: static;" ammo-shape="type: box" material="src: #stoneWallTexture; repeat: 1 1; wrap: repeat" width="1" height="10" depth="10"></a-box>
    <a-box position="-25 5 -16.5" ammo-body="type: static;" ammo-shape="type: box" material="src: #stoneWallTexture; repeat: 2 1; wrap: repeat" width="1" height="10" depth="20"></a-box>
    <a-box position="16 5 -17" ammo-body="type: static;" ammo-shape="type: box" material="src: #stoneWallTexture; repeat: 2 1; wrap: repeat" width="1" height="10" depth="19"></a-box>
    <a-box position="30 5 -7" rotation="0 90 0" ammo-body="type: static;" ammo-shape="type: box" material="src: #stoneWallTexture; repeat: 1 1; wrap: repeat" width="1" height="10" depth="10"></a-box>
    <a-box position="24.5 5 -11.5" ammo-body="type: static;" ammo-shape="type: box" material="src: #stoneWallTexture; repeat: 1 1; wrap: repeat" width="1" height="10" depth="10"></a-box>
    <a-box position="22.75 5 -26" rotation="0 90 0" ammo-body="type: static;" ammo-shape="type: box" material="src: #stoneWallTexture; repeat: 1 1; wrap: repeat" width="1" height="10" depth="12.5"></a-box>
    <a-box position="29.5 5 -21.5" ammo-body="type: static;" ammo-shape="type: box" material="src: #stoneWallTexture; repeat: 1 1; wrap: repeat" width="1" height="10" depth="10"></a-box>
    
    <!--Torch-->
    <a-entity gltf-model="#torchModel" position="-21.5 4 5" rotation="0 0 0" scale="2 2 2">
        <a-entity light="type: point; intensity: 8; distance: 27; decay: 0.75; color: #ffaa55" position="0 0.65 0.25"></a-entity>
    </a-entity>
    <a-entity gltf-model="#torchModel" position="11 4 33.7" rotation="0 180 0" scale="2 2 2">
        <a-entity light="type: point; intensity: 10; distance: 50; decay: 0.5; color: #ffaa55" position="0 0.65 0.25"></a-entity>
    </a-entity>
    <a-entity gltf-model="#torchModel" position="33.5 4 10.5" rotation="0 -90 0" scale="2 2 2">
        <a-entity light="type: point; intensity: 8; distance: 27; decay: 1.5; color: #ffaa55" position="0 0.65 0.25"></a-entity>
    </a-entity>
    <a-entity gltf-model="#torchModel" position="17.5 4 -1.5" rotation="0 90 0" scale="2 2 2">
        <a-entity light="type: point; intensity: 8; distance: 27; decay: 1.5; color: #ffaa55" position="0 0.65 0.25"></a-entity>
    </a-entity>
    <a-entity gltf-model="#torchModel" position="9 4 18.5" rotation="0 0 0" scale="2 2 2">
        <a-entity light="type: point; intensity: 8; distance: 27; decay: 1.5; color: #ffaa55" position="0 0.65 0.25"></a-entity>
    </a-entity>
    <a-entity gltf-model="#torchModel" position="9 4 -6" rotation="0 0 0" scale="2 2 2">
        <a-entity light="type: point; intensity: 8; distance: 27; decay: 1.5; color: #ffaa55" position="0 0.65 0.25"></a-entity>
    </a-entity>
    <a-entity gltf-model="#torchModel" position="-8 4 -6" rotation="0 0 0" scale="2 2 2">
        <a-entity light="type: point; intensity: 8; distance: 27; decay: 1.5; color: #ffaa55" position="0 0.65 0.25"></a-entity>
    </a-entity>
    <a-entity gltf-model="#torchModel" position="-25 4 -33.5" rotation="0 0 0" scale="2 2 2">
        <a-entity light="type: point; intensity: 8; distance: 27; decay: 1.5; color: #ffaa55" position="0 0.65 0.25"></a-entity>
    </a-entity>
    <a-entity gltf-model="#torchModel" position="24 4 -33.5" rotation="0 0 0" scale="2 2 2">
        <a-entity light="type: point; intensity: 8; distance: 27; decay: 1.5; color: #ffaa55" position="0 0.65 0.25"></a-entity>
    </a-entity>
    <a-entity gltf-model="#torchModel" position="22.5 4 -25" rotation="0 0 0" scale="2 2 2">
        <a-entity light="type: point; intensity: 8; distance: 27; decay: 1.5; color: #ffaa55" position="0 0.65 0.25"></a-entity>
    </a-entity>
    <a-entity gltf-model="#lanternModel" position="-4.5 9.5 -17" rotation="0 0 0" scale="2 2 2">
        <a-entity light="type: point; intensity: 9; distance: 27; decay: 0.5; color: #ffaa55" position="0 -1 -0.3"></a-entity>
        <a-entity light="type: point; intensity: 9; distance: 27; decay: 0.5; color: #ffaa55" position="0 -1 0.3"></a-entity>
    </a-entity>
       
    <!-- Character -->
    <a-entity 
        id="characterContainer"  
        character-movement="model: #character"
        ammo-body="type: dynamic; angularFactor: 0 0 0; mass: 20; emitCollisionEvents: true"
        position="-30 2 29.5"
        river-respawn
        character-combat="model: #character"
        health-bar
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
