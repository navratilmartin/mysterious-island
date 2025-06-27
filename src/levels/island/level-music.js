window.addEventListener('click', function () {
    const scene = document.querySelector('#scene');
    const meow = document.querySelector('#cat').querySelector('a-sound');
    const moo = document.querySelector('#cow').querySelector('a-sound');

    if (scene.audioContext && scene.audioContext.state === 'suspended') {
        scene.audioContext.resume().then(() => {
            meow.components.sound.playSound();
            moo.components.sound.playSound();
        });
    } else {
        meow.components.sound.playSound();
        moo.components.sound.playSound();
    }
}, { once: true });