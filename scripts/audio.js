const audioFiles = [
    'gta3.mp3',
    'gta4.mp3',
    'gta4_2.mp3',
    'gta5.mp3',
    'gtaSA.mp3',
    'gtaVC.mp3',
];

// Fisher-Yates shuffle implementation
const shuffleAudioArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

let currentAudioIndex = 0;
const shuffledAudio = shuffleAudioArray([...audioFiles]);

const getNextAudio = () => {
    if (currentAudioIndex >= shuffledAudio.length) {
        shuffleAudioArray(shuffledAudio);
        currentAudioIndex = 0;
    }
    return shuffledAudio[currentAudioIndex++];
};

document.addEventListener('DOMContentLoaded', () => {
    const audioElement = document.getElementById('backgroundAudio');
    
    const updateAudio = () => {
        const nextAudio = getNextAudio();
        audioElement.src = `assets/audio/${nextAudio}`;
        audioElement.play().catch(error => console.log('Audio playback error:', error));
    };

    audioElement.addEventListener('ended', updateAudio);
    updateAudio();
});