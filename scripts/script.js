document.addEventListener('DOMContentLoaded', () => {
    const videoElement = document.getElementById('video');
    const infoBoxes = document.querySelectorAll('.info-box');
    const infoContainer = document.getElementById('info-container');

    if (!videoElement || infoBoxes.length === 0) {
        console.error('Required elements not found. Check your HTML.');
        return;
    }

    // Fisher-Yates shuffle implementation
    const shuffleArray = array => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const videos = {
        LEFT: shuffleArray(['LEFT_1.mp4', 'LEFT_2.mp4', 'LEFT_3.mp4', 'LEFT_4.mp4', 
                           'LEFT_5.mp4', 'LEFT_6.mp4', 'LEFT_7.mp4', 'LEFT_8.mp4',]),
        RIGHT: shuffleArray(['RIGHT_1.mp4', 'RIGHT_2.mp4', 'RIGHT_3.mp4', 'RIGHT_4.mp4', 
                            'RIGHT_5.mp4', 'RIGHT_6.mp4', 'RIGHT_7.mp4', 'RIGHT_8.mp4', 'RIGHT_9.mp4'])
    };

    let chooseLeftNext = true;
    let currentLeftIndex = 0;
    let currentRightIndex = 0;

    let showTextTimeout = null;
    let hideTextBeforeEndTimeout = null;
    let showBoxesCounter = -1;
    let boxesShownCount = 0;

    const clearTimers = () => {
        if (showTextTimeout) clearTimeout(showTextTimeout);
        if (hideTextBeforeEndTimeout) clearTimeout(hideTextBeforeEndTimeout);
    };

    const hideAllText = () => {
        infoBoxes.forEach(box => box.style.opacity = '0');
    };

    const showBox = () => {
        if (boxesShownCount < infoBoxes.length) {
            showBoxesCounter = (showBoxesCounter + 1) % infoBoxes.length;
            infoBoxes.forEach((box, i) => {
                box.style.opacity = (i === showBoxesCounter) ? '1' : '0';
            });
            boxesShownCount++;
        }
    };

    const getNextVideo = (side) => {
        const arr = videos[side];
        let index = side === 'LEFT' ? currentLeftIndex : currentRightIndex;
        
        // Reset index and reshuffle when we've used all videos
        if (index >= arr.length) {
            shuffleArray(arr);
            index = 0;
            if (side === 'LEFT') {
                currentLeftIndex = 0;
            } else {
                currentRightIndex = 0;
            }
        }

        const video = arr[index];
        
        // Increment the appropriate index
        if (side === 'LEFT') {
            currentLeftIndex++;
        } else {
            currentRightIndex++;
        }

        return video;
    };

    const updateMedia = () => {
        clearTimers();

        const side = chooseLeftNext ? 'LEFT' : 'RIGHT';
        chooseLeftNext = !chooseLeftNext;

        const currentVideo = getNextVideo(side);
        hideAllText();

        videoElement.src = `./assets/video/${currentVideo}`;
        videoElement.play();

        infoContainer.style.left = currentVideo.includes('LEFT') ? '75%' : '25%';
        infoContainer.style.transform = 'translate(-50%, -50%)';

        videoElement.onloadedmetadata = () => {
            const duration = videoElement.duration;
            
            if (boxesShownCount < infoBoxes.length) {
                showTextTimeout = setTimeout(showBox, 1000);
                
                if (duration > 2) {
                    hideTextBeforeEndTimeout = setTimeout(hideAllText, (duration - 1) * 1000);
                }
            } else {
                hideAllText();
            }
        };
    };

    videoElement.addEventListener('ended', updateMedia);
    updateMedia();
});