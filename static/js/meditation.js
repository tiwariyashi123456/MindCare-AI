document.addEventListener("DOMContentLoaded", function () {

    console.log("🧘 Meditation Module Loaded");


    // =====================================================
    // ELEMENTS
    // =====================================================

    const activityCards =
        document.querySelectorAll(".activity-card");

    const timerSection =
        document.getElementById("timerSection");

    const successSection =
        document.getElementById("successSection");

    const activityName =
        document.getElementById("activityName");

    const timer =
        document.getElementById("timer");

    const breathingText =
        document.getElementById("breathingText");

    const pauseButton =
        document.getElementById("pauseButton");

    const completeButton =
        document.getElementById("completeButton");

    const againButton =
        document.getElementById("againButton");

    const successMessage =
        document.getElementById("successMessage");


    // =====================================================
    // VARIABLES
    // =====================================================

    let selectedActivity = "";

    let selectedDuration = 0;

    let remainingSeconds = 0;

    let timerInterval = null;

    let isPaused = false;


    // =====================================================
    // FORMAT TIME
    // =====================================================

    function formatTime(seconds) {

        const minutes =
            Math.floor(seconds / 60);

        const secondsLeft =
            seconds % 60;

        return (
            String(minutes).padStart(2, "0")
            + ":" +
            String(secondsLeft).padStart(2, "0")
        );
    }


    // =====================================================
    // UPDATE TIMER DISPLAY
    // =====================================================

    function updateTimerDisplay() {

        timer.textContent =
            formatTime(remainingSeconds);
    }


    // =====================================================
    // BREATHING MESSAGE
    // =====================================================

    function updateBreathingText() {

        if (remainingSeconds % 8 < 4) {

            breathingText.textContent =
                "Breathe in slowly...";

        } else {

            breathingText.textContent =
                "Breathe out gently...";
        }
    }


    // =====================================================
    // START TIMER
    // =====================================================

    function startTimer() {

        clearInterval(timerInterval);

        timerInterval = setInterval(function () {

            if (isPaused) {
                return;
            }


            if (remainingSeconds > 0) {

                remainingSeconds--;

                updateTimerDisplay();

                updateBreathingText();

            } else {

                clearInterval(timerInterval);

                completeMeditation();
            }

        }, 1000);
    }


    // =====================================================
    // START ACTIVITY
    // =====================================================

    function startActivity(card) {

        selectedActivity =
            card.dataset.activity;

        selectedDuration =
            parseInt(
                card.dataset.duration,
                10
            );


        remainingSeconds =
            selectedDuration * 60;


        isPaused = false;


        activityName.textContent =
            selectedActivity;


        pauseButton.innerHTML =
            '<i class="bi bi-pause-fill"></i> Pause';


        updateTimerDisplay();

        updateBreathingText();


        // Show timer

        timerSection.style.display =
            "block";


        // Hide success

        successSection.style.display =
            "none";


        // Scroll to timer

        timerSection.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });


        startTimer();
    }


    // =====================================================
    // PAUSE / RESUME
    // =====================================================

    pauseButton.addEventListener(
        "click",
        function () {

            isPaused = !isPaused;


            if (isPaused) {

                pauseButton.innerHTML =
                    '<i class="bi bi-play-fill"></i> Resume';

            } else {

                pauseButton.innerHTML =
                    '<i class="bi bi-pause-fill"></i> Pause';
            }

        }
    );


    // =====================================================
    // COMPLETE MEDITATION
    // =====================================================

    function completeMeditation() {

        clearInterval(timerInterval);

        isPaused = true;


        timerSection.style.display =
            "none";


        successSection.style.display =
            "block";


        successMessage.textContent =
            selectedActivity +
            " meditation completed successfully!";


        saveMeditation();


        successSection.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }


    // =====================================================
    // COMPLETE BUTTON
    // =====================================================

    completeButton.addEventListener(
        "click",
        function () {

            completeMeditation();

        }
    );


    // =====================================================
    // SAVE MEDITATION TO FLASK
    // =====================================================

    function saveMeditation() {

        fetch("/save-meditation", {

            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({

                activity:
                    selectedActivity,

                duration:
                    selectedDuration

            })

        })

        .then(function (response) {

            return response.json();

        })

        .then(function (data) {

            console.log(
                "Meditation save response:",
                data
            );

        })

        .catch(function (error) {

            console.error(
                "Meditation save error:",
                error
            );

        });

    }


    // =====================================================
    // ACTIVITY BUTTONS
    // =====================================================

    activityCards.forEach(
        function (card) {

            const button =
                card.querySelector(
                    ".start-button"
                );


            button.addEventListener(
                "click",
                function () {

                    startActivity(card);

                }
            );

        }
    );


    // =====================================================
    // CHOOSE ANOTHER ACTIVITY
    // =====================================================

    againButton.addEventListener(
        "click",
        function () {

            clearInterval(timerInterval);

            timerSection.style.display =
                "none";

            successSection.style.display =
                "none";

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

});