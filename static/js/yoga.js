/* =========================================
   MindCare AI - Yoga Module
   ========================================= */


/* Elements */

const yogaButtons =
    document.querySelectorAll(".start-yoga");

const timerSection =
    document.getElementById("timerSection");

const selectedYoga =
    document.getElementById("selectedYoga");

const timerDisplay =
    document.getElementById("timer");

const timerMessage =
    document.getElementById("timerMessage");

const startTimerButton =
    document.getElementById("startTimer");

const pauseTimerButton =
    document.getElementById("pauseTimer");

const resetTimerButton =
    document.getElementById("resetTimer");

const completeYogaButton =
    document.getElementById("completeYoga");

const yogaMessage =
    document.getElementById("yogaMessage");


/* Variables */

let currentYoga = "";

let currentDuration = 0;

let remainingSeconds = 0;

let timerInterval = null;

let timerRunning = false;


/* Format Time */

function formatTime(seconds) {

    const minutes =
        Math.floor(seconds / 60);

    const remaining =
        seconds % 60;

    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(remaining).padStart(2, "0")
    );
}


/* Update Display */

function updateTimerDisplay() {

    timerDisplay.textContent =
        formatTime(remainingSeconds);
}


/* Stop Timer */

function stopTimer() {

    if (timerInterval !== null) {

        clearInterval(timerInterval);

        timerInterval = null;
    }

    timerRunning = false;
}


/* Select Yoga */

yogaButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        stopTimer();

        yogaButtons.forEach(function (item) {
            item.parentElement.classList.remove("selected");
        });

        this.parentElement.classList.add("selected");

        currentYoga =
            this.dataset.yoga;

        currentDuration =
            parseInt(
                this.dataset.duration,
                10
            );

        remainingSeconds =
            currentDuration * 60;

        updateTimerDisplay();

        selectedYoga.textContent =
            currentYoga;

        timerMessage.textContent =
            "Your yoga session is ready. Press Start to begin.";

        yogaMessage.textContent = "";

        completeYogaButton.disabled = true;

        timerSection.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    });

});


/* Start Timer */

startTimerButton.addEventListener(
    "click",
    function () {

        if (!currentYoga) {

            timerMessage.textContent =
                "Please select a yoga activity first.";

            return;
        }

        if (remainingSeconds <= 0) {

            timerMessage.textContent =
                "Please reset the timer before starting again.";

            return;
        }

        if (timerRunning) {
            return;
        }

        timerRunning = true;

        timerMessage.textContent =
            "Yoga session in progress. Stay relaxed and breathe comfortably.";

        timerInterval =
            setInterval(function () {

                if (remainingSeconds > 0) {

                    remainingSeconds--;

                    updateTimerDisplay();
                }

                if (remainingSeconds === 0) {

                    stopTimer();

                    timerMessage.textContent =
                        "🎉 Great job! Your yoga session is complete.";

                    completeYogaButton.disabled =
                        false;
                }

            }, 1000);

    }
);


/* Pause Timer */

pauseTimerButton.addEventListener(
    "click",
    function () {

        if (!currentYoga) {

            timerMessage.textContent =
                "Please select a yoga activity first.";

            return;
        }

        if (!timerRunning) {

            timerMessage.textContent =
                "The timer is already paused.";

            return;
        }

        stopTimer();

        timerMessage.textContent =
            "⏸️ Yoga session paused. Press Start to continue.";

    }
);


/* Reset Timer */

resetTimerButton.addEventListener(
    "click",
    function () {

        stopTimer();

        if (!currentYoga) {

            remainingSeconds = 0;

            updateTimerDisplay();

            timerMessage.textContent =
                "Select a yoga activity above to begin.";

            completeYogaButton.disabled = true;

            return;
        }

        remainingSeconds =
            currentDuration * 60;

        updateTimerDisplay();

        timerMessage.textContent =
            "Timer reset. Press Start when you are ready.";

        completeYogaButton.disabled = true;

        yogaMessage.textContent = "";

    }
);


/* Complete Yoga */

completeYogaButton.addEventListener(
    "click",
    async function () {

        if (!currentYoga) {

            yogaMessage.textContent =
                "Please select a yoga activity first.";

            return;
        }

        if (remainingSeconds > 0) {

            yogaMessage.textContent =
                "Please complete the timer first.";

            return;
        }

        completeYogaButton.disabled = true;

        yogaMessage.textContent =
            "Saving your yoga session...";


        try {

            const response =
                await fetch(
                    "/save-yoga",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            yoga_name:
                                currentYoga,

                            duration:
                                currentDuration

                        })
                    }
                );


            const data =
                await response.json();


            if (response.ok && data.success) {

                yogaMessage.textContent =
                    "✅ " + data.message;

                timerMessage.textContent =
                    "You completed your yoga session successfully!";

            }
            else {

                yogaMessage.textContent =
                    "❌ " +
                    (
                        data.message ||
                        "Unable to save yoga session."
                    );

                completeYogaButton.disabled =
                    false;
            }

        }
        catch (error) {

            console.error(
                "Yoga save error:",
                error
            );

            yogaMessage.textContent =
                "❌ Server error. Please try again.";

            completeYogaButton.disabled =
                false;
        }

    }
);


/* Initial Display */

updateTimerDisplay();


console.log(
    "🧘‍♀️ MindCare AI Yoga Module loaded successfully."
);