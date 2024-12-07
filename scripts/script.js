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

    // Track which side should be chosen next. Start with LEFT or RIGHT as you prefer.
    let chooseLeftNext = true; // Will toggle between true (LEFT) and false (RIGHT)

    // Track the last chosen video indexes for each side
    let lastLeftIndex = -1;
    let lastRightIndex = -1;

    let showTextTimeout = null;
    let hideTextBeforeEndTimeout = null;

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

    const showBox = (index) => {
        // In the original code, you used currentVideoIndex 
        // to determine which box to show. Now that we're randomizing, 
        // you can decide how to correlate videos to info-boxes. 
        // For simplicity, let's just show a box based on a global counter 
        // that increments each time a new video is played, 
        // or you can keep a separate counter.

        // Since we no longer have a pre-built sequence, let's maintain a global counter:
        showBoxesCounter = (showBoxesCounter + 1) % infoBoxes.length; 
        infoBoxes.forEach((box, i) => {
            box.style.opacity = (i === showBoxesCounter) ? '1' : '0';
        });
    };

    // Let's keep a simple global counter for info boxes:
    let showBoxesCounter = -1;

    // Function to get next random video from one side without repeating the last chosen
    const getNextVideo = (side) => {
        const arr = videos[side];
        let lastIndex = side === 'LEFT' ? lastLeftIndex : lastRightIndex;
        let nextIndex;
        // Keep picking a random index until it's not the same as the last one
        do {
            nextIndex = Math.floor(Math.random() * arr.length);
        } while (nextIndex === lastIndex && arr.length > 1);

        // Update the last chosen index
        if (side === 'LEFT') {
            lastLeftIndex = nextIndex;
        } else {
            lastRightIndex = nextIndex;
        }

        return arr[nextIndex];
    };

    const updateMedia = () => {
        clearTimers(); // Clear any timers from previous video

        // Determine which side to pick from next (LEFT or RIGHT)
        const side = chooseLeftNext ? 'LEFT' : 'RIGHT';
        chooseLeftNext = !chooseLeftNext; // Toggle for next round

        // Pick the next random video from the chosen side
        const currentVideo = getNextVideo(side);

        // Immediately hide text (to prevent old text from showing)
        hideAllText();

        // Update video source
        videoElement.src = `./assets/${currentVideo}`;
        videoElement.play();

        // Position the info container based on LEFT/RIGHT
        if (currentVideo.includes('LEFT')) {
            // Video on LEFT, text on RIGHT
            infoContainer.style.left = '75%';
            infoContainer.style.transform = 'translate(-50%, -50%)';
        } else {
            // Video on RIGHT, text on LEFT
            infoContainer.style.left = '25%';
            infoContainer.style.transform = 'translate(-50%, -50%)';
        }

        // Once metadata is loaded, we know the duration of the video
        videoElement.onloadedmetadata = () => {
            const duration = videoElement.duration;

            // Show text 1 second after the video starts playing
            showTextTimeout = setTimeout(() => {
                showBox();
            }, 1000);

            // Hide text 1 second before the video ends (if possible)
            if (duration > 2) {
                hideTextBeforeEndTimeout = setTimeout(() => {
                    hideAllText();
                }, (duration - 1) * 1000);
            }
        };
    };

    // When current video ends, switch to the next
    videoElement.addEventListener('ended', updateMedia);

    // Start the first video
    updateMedia();
});
