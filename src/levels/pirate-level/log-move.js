AFRAME.registerComponent('log-move', {
    schema: { speed: { type: 'number', default: 0.02 } },
    tick: function (time, timeDelta) {
        let pos = this.el.object3D.position;
        pos.z += this.data.speed;
        if (pos.z > 25) pos.z = -25; // return log at the beginning
    }
});