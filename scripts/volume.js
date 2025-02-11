$(document).ready(function () {
    const $input = $("#sliderInput"),
        steps = parseInt($input.attr("data-steps"), 10),
        $slider = $("<div class='vslider'><ul class='vslider_sticks'></ul></div>").appendTo($input.parent());
    const audio = $("#backgroundAudio")[0];

    // show volume
    // $(".volume-container").addClass("fade-in");

    // Hide the default input range
    $input.hide();

    // Load saved volume preference and validate it
    let savedVolume = parseFloat(localStorage.getItem("volume"));
    if (isNaN(savedVolume) || savedVolume < 0 || savedVolume > 1) {
        savedVolume = parseFloat($input.attr("value")); // Use default value if invalid
    }

    // Set the audio volume and log the value for debugging
    audio.volume = savedVolume;
    // console.log('Initial volume set to:', audio.volume); // Debug


    // Check if the audio is playing
    if (audio.paused) {
        // console.log('Audio is paused. Attempting to play.');
        audio.play(); // Try to play if it's paused
    }

    // Render slider sticks
    for (let i = 0; i < steps; i++) {
        $("<li></li>").appendTo($slider.find(".vslider_sticks"));
    }

    // Helper functions
    const renderUI = (percent) => {
        const activeSteps = Math.round(percent * steps);
        $(".vslider_sticks > li").removeClass("active");

        for (let i = 0; i < activeSteps; i++) {
            $(".vslider_sticks > li").eq(i).addClass("active");
        }

        // Update audio volume
        audio.volume = percent;

        // Log the volume to check it's being applied correctly
        // console.log('Volume set to:', audio.volume); // Debugging statement

        // Save volume to localStorage
        localStorage.setItem("volume", percent);
    };

    const getPercent = (event) => {
        const sliderWidth = $(".vslider_sticks").width();
        const offsetX = event.pageX - $slider.offset().left;
        let percent = offsetX / sliderWidth;
        percent = Math.max(0, Math.min(1, percent)); // Ensure percent is within range
        return percent;
    };

    // Dragging events
    const startDrag = (event) => {
        renderUI(getPercent(event));
        $(document.body).on("mousemove", onDrag);
        $(document.body).on("mouseup", stopDrag);
    };

    const onDrag = (event) => {
        renderUI(getPercent(event));
    };

    const stopDrag = () => {
        $(document.body).off("mousemove", onDrag);
        $(document.body).off("mouseup", stopDrag);
    };

    // Initialize slider with saved volume
    $slider.on("mousedown", startDrag);
    renderUI(savedVolume);
});
