AFRAME.registerComponent('day-night-cycle', {
  schema: {
    cycleDuration:    { type: 'number',  default: 180000 },
    autoStart:        { type: 'boolean', default: true  },
    sunSpeed:         { type: 'number',  default: 1     },
    showTimeIndicator:{ type: 'boolean', default: true  }
  },

  init: function () {
    this.sunAngle    = 0;
    this.isRunning   = false;
    this.animationFrame = null;
    this.lastTime    = 0;

    this.environmentEl = this.el.querySelector('#environment') || this.el.querySelector('[environment]');
    if (!this.environmentEl) {
      console.error('day-night-cycle: no environment component found (id="environment" or [environment])');
      return;
    }

    this.createLightingElements();

    if (this.data.showTimeIndicator) {
      this.createTimeIndicator();
    }

    // initial position = sunrise
    this.updateSunPosition();
    if (this.data.autoStart) {
      this.startCycle();
    }
  },

  createLightingElements: function () {
    this.ambientLight = document.createElement('a-light');
    this.ambientLight.setAttribute('type', 'ambient');
    this.ambientLight.setAttribute('color', '#ffffff');
    this.ambientLight.setAttribute('intensity', 0.4);
    this.el.appendChild(this.ambientLight);

    // directional sun/moon
    this.directionalLight = document.createElement('a-light');
    this.directionalLight.setAttribute('type', 'directional');
    this.directionalLight.setAttribute('castShadow', 'true');
    this.directionalLight.setAttribute('intensity', 0.6); // Reduce max sun intensity
    this.el.appendChild(this.directionalLight);

    // night sky light - invisible ambient lighting for nighttime
    this.nightSkyLight = document.createElement('a-light');
    this.nightSkyLight.setAttribute('type', 'ambient');
    this.nightSkyLight.setAttribute('color', '#416973');
    this.nightSkyLight.setAttribute('intensity', 0);
    this.el.appendChild(this.nightSkyLight);
  }, 

  createTimeIndicator: function () {
    // Create HTML overlay for responsive positioning
    this.indicator = document.createElement('div');
    this.indicator.id = 'time-indicator-overlay';
    this.indicator.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      z-index: 1000;
      pointer-events: none;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;
    
    this.indicator.innerHTML = `
      <div style="
        background: rgba(0, 0, 0, 0.7);
        padding: 8px 12px;
        border-radius: 4px;
        text-align: center;
        min-width: 80px;
      ">
        <div id="time-text" style="
          color: #FFF;
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 2px;
        ">SUNRISE</div>
        <div id="time-clock" style="
          color: #FFD700;
          font-size: 12px;
          font-weight: bold;
        ">06:00</div>
      </div>
    `;
    
    document.body.appendChild(this.indicator);
  },

  startCycle: function () {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.animate();
  },

  stopCycle: function () {
    this.isRunning = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  },

  animate: function () {
    if (!this.isRunning) return;
    const now       = performance.now();
    const deltaTime = now - this.lastTime;
    this.lastTime   = now;

    const degPerMs     = 360 / this.data.cycleDuration;
    const increment    = degPerMs * deltaTime * this.data.sunSpeed;
    this.sunAngle      = (this.sunAngle + increment) % 360;

    this.updateSunPosition();
    if (this.data.showTimeIndicator) {
      this.updateTimeDisplay();
    }

    this.animationFrame = requestAnimationFrame(this.animate.bind(this));
  },

  updateSunPosition: function () {
    const rad   = this.sunAngle * Math.PI / 180;
    const R     = 30;                        // how far the sun/light orbits
    const x     = R * Math.cos(rad);
    const y     = R * Math.sin(rad);
    const z     = 0;

    // move the actual directional light in world space
    this.directionalLight.setAttribute('position', `${x} ${y} ${z}`);

    let intensity = 0;
    let nightSkyIntensity = 0;
    
    if (y > 0) {
      // Daytime - intensity based on sun height, but cap maximum intensity
      intensity = Math.min(y * 0.8, 0.6);
      nightSkyIntensity = 0;
    } else {
      // Nighttime - very dim moonlight
      intensity = 0.05;
      nightSkyIntensity = Math.abs(y) * 0.15;
    }
    
    this.directionalLight.setAttribute('intensity', intensity);
    this.nightSkyLight.setAttribute('intensity', nightSkyIntensity);

    // also tell the environment sky/fog where the sun is
    this.environmentEl.setAttribute('environment', 'lightPosition', `${x} ${y} ${z}`);

    if (y > 0) {
      // daytime fog
      const fogVal = (y > 0.5 ? 0.1 : 0.4);
      this.environmentEl.setAttribute('environment', 'fog', fogVal);
    } else {
      // night fog
      this.environmentEl.setAttribute('environment', 'fog', 0.6);
    }
  },

  updateTimeDisplay: function () {
    const txtEl  = document.getElementById('time-text');
    const clkEl  = document.getElementById('time-clock');
    if (!txtEl || !clkEl) return;

    let label, color;
    if (this.sunAngle < 45)       { label = 'SUNRISE'; color = '#FFB6C1'; }
    else if (this.sunAngle < 135) { label = 'DAY';     color = '#87CEEB'; }
    else if (this.sunAngle < 225) { label = 'SUNSET';  color = '#FF6347'; }
    else                          { label = 'NIGHT';   color = '#B0C4DE'; }

    // compute clock: 0° → 6:00, 90° → 12:00, etc.
    let h24 = (this.sunAngle / 15 + 6) % 24;
    const h = Math.floor(h24);
    const m = Math.floor((h24 - h) * 60);
    const timeStr = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`;

    txtEl.textContent = label;
    txtEl.style.color = color;
    clkEl.textContent = timeStr;
  },

  setSunAngle: function (angle) {
    this.sunAngle = angle % 360;
    this.updateSunPosition();
    if (this.data.showTimeIndicator) this.updateTimeDisplay();
  },
  getSunAngle:      function () { return this.sunAngle; },
  getCurrentTimeOfDay: function () {
    const y = Math.sin(this.sunAngle * Math.PI/180);
    if (y <= 0) return 'NIGHT';
    if (this.sunAngle < 45 || this.sunAngle > 315) return 'SUNRISE';
    if (this.sunAngle < 135) return 'DAY';
    if (this.sunAngle < 225) return 'SUNSET';
    return 'NIGHT';
  },
  setTimeToSunrise: function(){ this.setSunAngle(   0); },
  setTimeToNoon:    function(){ this.setSunAngle(  90); },
  setTimeToSunset:  function(){ this.setSunAngle( 180); },
  setTimeToMidnight:function(){ this.setSunAngle( 270); },

  remove: function () {
    this.stopCycle();
    if (this.indicator && this.indicator.parentNode) {
      this.indicator.parentNode.removeChild(this.indicator);
    }
  }
});
