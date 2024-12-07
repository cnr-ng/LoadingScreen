document.addEventListener('DOMContentLoaded', () => {
    const videoElement = document.getElementById('video');
    const infoBoxes = document.querySelectorAll('.info-box');
    const infoContainer = document.getElementById('info-container');

    if (!videoElement) {
        console.error('No element with id="video" found. Check your HTML.');
        return;
    }

    if (infoBoxes.length === 0) {
        console.error('No elements with class="info-box" found. Check your HTML.');
        return;
    }

    const videos = {
        LEFT: ['LEFT_1.mp4', 'LEFT_2.mp4', 'LEFT_3.mp4', 'LEFT_4.mp4'],
        RIGHT: ['RIGHT_1.mp4', 'RIGHT_2.mp4', 'RIGHT_3.mp4', 'RIGHT_4.mp4', 'RIGHT_5.mp4']
    };

    let chooseLeftNext = true;
    let lastLeftIndex = -1;
    let lastRightIndex = -1;

    let showTextTimeout = null;
    let hideTextBeforeEndTimeout = null;

    // We'll keep track of how many boxes have been shown so far
    // Once we reach the total number of boxes, we stop showing them.
    let showBoxesCounter = -1;
    let boxesShownCount = 0; // How many boxes have actually been shown

    const clearTimers = () => {
        if (showTextTimeout) {
            clearTimeout(showTextTimeout);
            showTextTimeout = null;
        }
        if (hideTextBeforeEndTimeout) {
            clearTimeout(hideTextBeforeEndTimeout);
            hideTextBeforeEndTimeout = null;
        }
    };

    const hideAllText = () => {
        infoBoxes.forEach(box => box.style.opacity = '0');
    };

    const showBox = () => {
        // Only show a box if we haven't shown all of them yet
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
        let lastIndex = side === 'LEFT' ? lastLeftIndex : lastRightIndex;
        let nextIndex;
        do {
            nextIndex = Math.floor(Math.random() * arr.length);
        } while (nextIndex === lastIndex && arr.length > 1);

        if (side === 'LEFT') {
            lastLeftIndex = nextIndex;
        } else {
            lastRightIndex = nextIndex;
        }

        return arr[nextIndex];
    };

    const updateMedia = () => {
        clearTimers();

        const side = chooseLeftNext ? 'LEFT' : 'RIGHT';
        chooseLeftNext = !chooseLeftNext;

        const currentVideo = getNextVideo(side);

        // Immediately hide text from previous run
        hideAllText();

        // Update video source
        videoElement.src = `./assets/${currentVideo}`;
        videoElement.play();

        // Position the info container based on which side the video is on
        if (currentVideo.includes('LEFT')) {
            infoContainer.style.left = '75%';
            infoContainer.style.transform = 'translate(-50%, -50%)';
        } else {
            infoContainer.style.left = '25%';
            infoContainer.style.transform = 'translate(-50%, -50%)';
        }

        videoElement.onloadedmetadata = () => {
            const duration = videoElement.duration;

            // Only schedule showing/hiding boxes if we still have boxes left to show
            if (boxesShownCount < infoBoxes.length) {
                // Show text 1 second after the video starts playing
                showTextTimeout = setTimeout(() => {
                    showBox();
                }, 1000);

                // Hide text 1 second before the video ends if possible
                if (duration > 2) {
                    hideTextBeforeEndTimeout = setTimeout(() => {
                        hideAllText();
                    }, (duration - 1) * 1000);
                }
            } else {
                // We've shown all boxes. Don't show any text at all.
                hideAllText();
            }
        };
    };

    videoElement.addEventListener('ended', updateMedia);

    // Start the first video
    updateMedia();
});
