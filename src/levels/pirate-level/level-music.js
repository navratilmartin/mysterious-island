window.addEventListener('click', function () {
    const scene = document.querySelector('#pirate-level');
    const music = document.querySelector('#organ').querySelector('a-sound');

    if (scene.audioContext && scene.audioContext.state === 'suspended') {
        scene.audioContext.resume().then(() => {
            music.components.sound.playSound();
        });
    } else {
        music.components.sound.playSound();
    }
}, { once: true });