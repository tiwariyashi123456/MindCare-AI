document.addEventListener("DOMContentLoaded", function () {

    // =========================================================
    // EXERCISE TIMER VARIABLES
    // =========================================================

    let selectedExerciseName = "";
    let selectedDuration = 0;
    let remainingSeconds = 0;
    let timerInterval = null;
    let timerRunning = false;


    // =========================================================
    // GET HTML ELEMENTS
    // =========================================================

    const exerciseCards =
        document.querySelectorAll(".exercise-card");

    const startExerciseButtons =
        document.querySelectorAll(".start-exercise");

    const videoButtons =
        document.querySelectorAll(".video-btn");


    const timerElement =
        document.getElementById("timer");

    const timerMessage =
        document.getElementById("timerMessage");

    const selectedExercise =
        document.getElementById("selectedExercise");

    const startTimerButton =
        document.getElementById("startTimer");

    const pauseTimerButton =
        document.getElementById("pauseTimer");

    const resetTimerButton =
        document.getElementById("resetTimer");

    const completeExerciseButton =
        document.getElementById("completeExercise");

    const exerciseMessage =
        document.getElementById("exerciseMessage");


    // =========================================================
    // VIDEO ELEMENTS
    // =========================================================

    const videoModal =
        document.getElementById("videoModal");

    const videoTitle =
        document.getElementById("videoTitle");

    const youtubeExerciseVideo =
        document.getElementById(
            "youtubeExerciseVideo"
        );

    const exerciseVideo =
        document.getElementById("exerciseVideo");

    const videoStatus =
        document.getElementById("videoStatus");

    const closeVideo =
        document.getElementById("closeVideo");


    // =========================================================
    // FORMAT TIMER
    // =========================================================

    function formatTime(totalSeconds) {

        const minutes =
            Math.floor(totalSeconds / 60);

        const seconds =
            totalSeconds % 60;

        return (
            String(minutes).padStart(2, "0") +
            ":" +
            String(seconds).padStart(2, "0")
        );
    }


    // =========================================================
    // UPDATE TIMER DISPLAY
    // =========================================================

    function updateTimerDisplay() {

        if (!timerElement) {
            return;
        }

        timerElement.textContent =
            formatTime(remainingSeconds);
    }


    // =========================================================
    // SELECT EXERCISE
    // =========================================================

    startExerciseButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                selectedExerciseName =
                    button.getAttribute(
                        "data-exercise"
                    ) || "";

                selectedDuration =
                    parseInt(
                        button.getAttribute(
                            "data-duration"
                        ) || "0",
                        10
                    );


                // Stop previous timer
                clearInterval(timerInterval);

                timerInterval = null;
                timerRunning = false;


                // Set duration
                remainingSeconds =
                    selectedDuration * 60;


                // Update timer
                updateTimerDisplay();


                // Update heading
                if (selectedExercise) {

                    selectedExercise.textContent =
                        selectedExerciseName;

                }


                // Update message
                if (timerMessage) {

                    timerMessage.textContent =
                        selectedExerciseName +
                        " selected. Press Start to begin.";

                }


                // Clear previous message
                if (exerciseMessage) {

                    exerciseMessage.textContent = "";

                }


                // Disable complete button
                if (completeExerciseButton) {

                    completeExerciseButton.disabled =
                        true;

                }


                // Scroll to timer
                const timerSection =
                    document.getElementById(
                        "timerSection"
                    );

                if (timerSection) {

                    timerSection.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                }

            }
        );

    });


    // =========================================================
    // START TIMER
    // =========================================================

    if (startTimerButton) {

        startTimerButton.addEventListener(
            "click",
            function () {

                // No exercise selected
                if (!selectedExerciseName) {

                    if (timerMessage) {

                        timerMessage.textContent =
                            "⚠️ Please select an exercise first.";

                    }

                    return;
                }


                // Already running
                if (timerRunning) {
                    return;
                }


                // Timer finished
                if (remainingSeconds <= 0) {

                    if (timerMessage) {

                        timerMessage.textContent =
                            "⚠️ Please select an exercise again.";

                    }

                    return;
                }


                // Start timer
                timerRunning = true;


                if (timerMessage) {

                    timerMessage.textContent =
                        "▶ " +
                        selectedExerciseName +
                        " is in progress...";

                }


                timerInterval =
                    setInterval(
                        function () {

                            if (remainingSeconds > 0) {

                                remainingSeconds--;

                                updateTimerDisplay();

                            }


                            // Timer completed
                            if (remainingSeconds <= 0) {

                                clearInterval(
                                    timerInterval
                                );

                                timerInterval = null;

                                timerRunning = false;


                                if (timerMessage) {

                                    timerMessage.textContent =
                                        "🎉 Exercise time completed!";

                                }


                                // Enable complete
                                if (completeExerciseButton) {

                                    completeExerciseButton.disabled =
                                        false;

                                }

                            }

                        },
                        1000
                    );

            }
        );

    }


    // =========================================================
    // PAUSE TIMER
    // =========================================================

    if (pauseTimerButton) {

        pauseTimerButton.addEventListener(
            "click",
            function () {

                if (!timerRunning) {

                    if (timerMessage) {

                        timerMessage.textContent =
                            "⏸ Timer is already paused.";

                    }

                    return;
                }


                clearInterval(timerInterval);

                timerInterval = null;

                timerRunning = false;


                if (timerMessage) {

                    timerMessage.textContent =
                        "⏸ Timer paused.";

                }

            }
        );

    }


    // =========================================================
    // RESET TIMER
    // =========================================================

    if (resetTimerButton) {

        resetTimerButton.addEventListener(
            "click",
            function () {

                clearInterval(timerInterval);

                timerInterval = null;

                timerRunning = false;


                if (selectedExerciseName) {

                    remainingSeconds =
                        selectedDuration * 60;

                } else {

                    remainingSeconds = 0;

                }


                updateTimerDisplay();


                if (timerMessage) {

                    if (selectedExerciseName) {

                        timerMessage.textContent =
                            "🔄 Timer reset. Press Start to begin.";

                    } else {

                        timerMessage.textContent =
                            "Select an exercise above to begin.";

                    }

                }


                if (completeExerciseButton) {

                    completeExerciseButton.disabled =
                        true;

                }


                if (exerciseMessage) {

                    exerciseMessage.textContent = "";

                }

            }
        );

    }


    // =========================================================
    // COMPLETE EXERCISE
    // =========================================================

    if (completeExerciseButton) {

        completeExerciseButton.addEventListener(
            "click",
            async function () {

                if (!selectedExerciseName) {

                    if (exerciseMessage) {

                        exerciseMessage.textContent =
                            "⚠️ Please select an exercise first.";

                    }

                    return;
                }


                completeExerciseButton.disabled =
                    true;


                if (exerciseMessage) {

                    exerciseMessage.textContent =
                        "⏳ Saving your exercise...";

                }


                try {

                    const response =
                        await fetch(
                            "/save-exercise",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body: JSON.stringify({

                                    exercise_name:
                                        selectedExerciseName,

                                    duration:
                                        selectedDuration,

                                    completed: 1

                                })
                            }
                        );


                    const data =
                        await response.json();


                    if (
                        response.ok &&
                        data.success
                    ) {

                        if (exerciseMessage) {

                            exerciseMessage.textContent =
                                "✅ Exercise completed and saved successfully!";

                        }

                    } else {

                        if (exerciseMessage) {

                            exerciseMessage.textContent =
                                data.message ||
                                "⚠️ Exercise could not be saved.";

                        }


                        // Allow retry
                        completeExerciseButton.disabled =
                            false;

                    }

                } catch (error) {

                    console.error(
                        "Exercise save error:",
                        error
                    );


                    if (exerciseMessage) {

                        exerciseMessage.textContent =
                            "⚠️ Exercise completed, but there was a problem saving it.";

                    }


                    // Allow retry
                    completeExerciseButton.disabled =
                        false;

                }

            }
        );

    }


    // =========================================================
    // YOUTUBE VIDEO ID FUNCTION
    // =========================================================

    function getYouTubeVideoId(url) {

        if (!url) {
            return null;
        }


        try {

            const parsedUrl =
                new URL(url);


            // ---------------------------------------------
            // youtu.be/VIDEO_ID
            // ---------------------------------------------

            if (
                parsedUrl.hostname === "youtu.be" ||
                parsedUrl.hostname === "www.youtu.be"
            ) {

                const id =
                    parsedUrl.pathname
                        .replace("/", "")
                        .split("/")[0];

                return id || null;

            }


            // ---------------------------------------------
            // youtube.com
            // ---------------------------------------------

            if (
                parsedUrl.hostname.includes(
                    "youtube.com"
                )
            ) {

                // youtube.com/watch?v=VIDEO_ID
                const watchId =
                    parsedUrl.searchParams.get("v");

                if (watchId) {

                    return watchId;

                }


                // youtube.com/embed/VIDEO_ID
                const embedMatch =
                    parsedUrl.pathname.match(
                        /\/embed\/([^/?]+)/
                    );

                if (embedMatch) {

                    return embedMatch[1];

                }


                // youtube.com/shorts/VIDEO_ID
                const shortsMatch =
                    parsedUrl.pathname.match(
                        /\/shorts\/([^/?]+)/
                    );

                if (shortsMatch) {

                    return shortsMatch[1];

                }

            }

        } catch (error) {

            console.error(
                "Invalid YouTube URL:",
                error
            );

        }


        return null;
    }


    // =========================================================
    // CREATE YOUTUBE EMBED URL
    // =========================================================

    function getYouTubeEmbedUrl(url) {

        const videoId =
            getYouTubeVideoId(url);


        if (!videoId) {

            return null;

        }


        return (
            "https://www.youtube.com/embed/" +
            videoId +
            "?autoplay=1&rel=0"
        );

    }


    // =========================================================
    // CHECK WHETHER URL IS YOUTUBE
    // =========================================================

    function isYouTubeUrl(url) {

        if (!url) {
            return false;
        }


        return (
            url.includes("youtube.com") ||
            url.includes("youtu.be")
        );

    }


    // =========================================================
    // HIDE BOTH VIDEO TYPES
    // =========================================================

    function hideAllVideos() {

        // Hide YouTube
        if (youtubeExerciseVideo) {

            youtubeExerciseVideo.src = "";

            youtubeExerciseVideo.style.display =
                "none";

        }


        // Stop local video
        if (exerciseVideo) {

            exerciseVideo.pause();

            exerciseVideo.removeAttribute(
                "src"
            );

            exerciseVideo.load();

            exerciseVideo.style.display =
                "none";

        }

    }


    // =========================================================
    // OPEN VIDEO MODAL
    // =========================================================

    function openVideoModal() {

        if (!videoModal) {
            return;
        }


        videoModal.classList.add("active");

        videoModal.style.display =
            "flex";

    }


    // =========================================================
    // CLOSE VIDEO MODAL
    // =========================================================

    function closeExerciseVideo() {

        hideAllVideos();


        if (videoStatus) {

            videoStatus.textContent = "";

        }


        if (videoModal) {

            videoModal.classList.remove(
                "active"
            );

            videoModal.style.display =
                "none";

        }

    }


    // =========================================================
    // WATCH VIDEO BUTTONS
    // =========================================================

    videoButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const videoSource =
                    button.getAttribute(
                        "data-video"
                    );

                const title =
                    button.getAttribute(
                        "data-title"
                    ) || "Exercise Video";


                // Set title
                if (videoTitle) {

                    videoTitle.textContent =
                        title;

                }


                // Clear old status
                if (videoStatus) {

                    videoStatus.textContent = "";

                }


                // Remove previous video
                hideAllVideos();


                // =================================================
                // YOUTUBE VIDEO
                // =================================================

                if (
                    videoSource &&
                    isYouTubeUrl(videoSource)
                ) {

                    const embedUrl =
                        getYouTubeEmbedUrl(
                            videoSource
                        );


                    if (
                        embedUrl &&
                        youtubeExerciseVideo
                    ) {

                        youtubeExerciseVideo.src =
                            embedUrl;

                        youtubeExerciseVideo.style.display =
                            "block";


                        if (videoStatus) {

                            videoStatus.textContent =
                                "▶ Playing exercise video";

                        }


                        openVideoModal();

                    } else {

                        if (videoStatus) {

                            videoStatus.textContent =
                                "⚠️ Unable to load this YouTube video.";

                        }


                        openVideoModal();

                    }

                }


                // =================================================
                // LOCAL MP4 VIDEO
                // =================================================

                else if (
                    videoSource &&
                    exerciseVideo
                ) {

                    exerciseVideo.src =
                        "/static/videos/" +
                        videoSource;

                    exerciseVideo.style.display =
                        "block";


                    exerciseVideo.load();


                    openVideoModal();


                    exerciseVideo.play()
                        .then(
                            function () {

                                if (videoStatus) {

                                    videoStatus.textContent =
                                        "▶ Playing exercise video";

                                }

                            }
                        )
                        .catch(
                            function () {

                                if (videoStatus) {

                                    videoStatus.textContent =
                                        "▶ Press the play button to start the video.";

                                }

                            }
                        );

                }


                // =================================================
                // NO VIDEO
                // =================================================

                else {

                    if (videoStatus) {

                        videoStatus.textContent =
                            "⚠️ Video is not available.";

                    }


                    openVideoModal();

                }

            }
        );

    });


    // =========================================================
    // CLOSE BUTTON
    // =========================================================

    if (closeVideo) {

        closeVideo.addEventListener(
            "click",
            function () {

                closeExerciseVideo();

            }
        );

    }


    // =========================================================
    // CLICK OUTSIDE VIDEO MODAL
    // =========================================================

    if (videoModal) {

        videoModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === videoModal
                ) {

                    closeExerciseVideo();

                }

            }
        );

    }


    // =========================================================
    // ESCAPE KEY CLOSE
    // =========================================================

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                closeExerciseVideo();

            }

        }
    );


    // =========================================================
    // VIDEO ERROR HANDLING
    // =========================================================

    if (exerciseVideo) {

        exerciseVideo.addEventListener(
            "error",
            function () {

                if (videoStatus) {

                    videoStatus.textContent =
                        "⚠️ Local video file could not be loaded.";

                }

            }
        );

    }


    // =========================================================
    // INITIAL TIMER
    // =========================================================

    remainingSeconds = 0;

    updateTimerDisplay();

});