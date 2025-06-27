import { changeLevel } from "../../utils.js";
import { END_SCREEN_URL } from "../../constants.js";

AFRAME.registerComponent('plane-departure', {
  schema: {
    duration: { type: 'number', default: 8000 },
    autoStart: { type: 'boolean', default: false }
  },

  init: function () {
    this.isAnimating = false;
    this.plane = null;
    this.originalCamera = null;
    this.animationCamera = null;
    
    this.el.addEventListener('game-completed', () => {
      this.startDepartureAnimation();
    });
  },

  startDepartureAnimation: function () {
    if (this.isAnimating) return;
    this.isAnimating = true;
    
    this.setupPlane();
    
    // Create cinematic camera
    this.setupCinematicCamera();
    
    this.runAnimationSequence();
  },

  setupPlane: function () {
    this.plane = document.createElement('a-entity');
    this.plane.id = 'departure-plane';
    
    this.plane.setAttribute('position', '35 -5 65');
    this.plane.setAttribute('rotation', '0 270 0');
    this.plane.setAttribute('gltf-model', '#planePhase4');
    this.plane.setAttribute('scale', '1 1 1');
    
    this.el.appendChild(this.plane);
    
    // Hide the crash site
    const crashSite = this.el.querySelector('[spawn-crash-site]');
    if (crashSite) {
      crashSite.setAttribute('visible', 'false');
    }
  },

  setupCinematicCamera: function () {
    // Store original camera
    this.originalCamera = this.el.querySelector('[camera]');
    
    // Create cinematic camera
    this.animationCamera = document.createElement('a-entity');
    this.animationCamera.id = 'cinematic-camera';
    this.animationCamera.setAttribute('camera', 'active: true');
    this.animationCamera.setAttribute('position', '30 8 90');
    this.animationCamera.setAttribute('rotation', '0 0 0');
    
    this.el.appendChild(this.animationCamera);
    
    // Disable original camera
    this.originalCamera.setAttribute('camera', 'active: false');
    
    // Disable player movement
    const character = document.querySelector('#characterContainer');
    if (character) {
      const characterMovComp = character.components["character-movement"];
      if (characterMovComp) {
        characterMovComp.isMovementDisabled = true;
      }

      character.setAttribute("visible", "false");
    }
  },

  runAnimationSequence: function () {
    const plane = this.plane;
    const camera = this.animationCamera;
    
    setTimeout(() => {
      plane.setAttribute('animation__taxi', {
        property: 'position',
        to: '35 -5 50',
        dur: 2500,
        easing: 'easeInQuad'
      });
    }, 1000);
    
    // Single smooth fly-away animation
    setTimeout(() => {
      plane.setAttribute('animation__complete_flight', {
        property: 'position',
        to: '35 35 -90',
        dur: 6000,
        easing: 'easeInQuad'
      });
      
      plane.setAttribute('animation__flight_rotation', {
        property: 'rotation',
        to: '5 280 3',
        dur: 6000,
        easing: 'easeInOutQuad'
      });
      
      // Camera follows the entire flight smoothly
      camera.setAttribute('animation__camera_follow', {
        property: 'rotation',
        to: '20 -15 0',
        dur: 6000,
        easing: 'easeInOutQuad'
      });
      
      camera.setAttribute('animation__camera_position', {
        property: 'position',
        to: '45 15 80', // Pull back for wider view
        dur: 6000,
        easing: 'easeInOutQuad'
      });
    }, 3200);
    
    setTimeout(() => {
      this.completeAnimation();
    }, this.data.duration);
  },

  completeAnimation: function () {
    // Fade to black
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: black;
      z-index: 10000;
      opacity: 0;
      transition: opacity 2s ease-in-out;
    `;
    document.body.appendChild(overlay);
    
    setTimeout(() => {
      overlay.style.opacity = '1';
    }, 100);
    
    // Go to end screen
    setTimeout(() => {
      changeLevel(END_SCREEN_URL);
    }, 2000);
  },

  remove: function () {
    // Clean up
    if (this.plane && this.plane.parentNode) {
      this.plane.parentNode.removeChild(this.plane);
    }
    if (this.animationCamera && this.animationCamera.parentNode) {
      this.animationCamera.parentNode.removeChild(this.animationCamera);
    }
    
    // Restore original camera
    if (this.originalCamera) {
      this.originalCamera.setAttribute('camera', 'active: true');
    }
  }
});
