let timerInterval = null;

let totalSeconds = 300;
let remainingSeconds = 300;

let isRunning = false;


/* ================= GET ELEMENTS ================= */

const timerDisplay =
    document.getElementById("timerDisplay");

const durationSelect =
    document.getElementById("durationSelect");

const startBtn =
    document.getElementById("startBtn");

const pauseBtn =
    document.getElementById("pauseBtn");

const resetBtn =
    document.getElementById("resetBtn");

const timerMessage =
    document.getElementById("timerMessage");

const alarmSound =
    document.getElementById("alarmSound");


/* ================= ALARM SOUND ================= */

function playAlarm() {

    if (!alarmSound) {
        console.log("❌ Alarm sound element not found.");
        return;
    }

    alarmSound.pause();
    alarmSound.currentTime = 0;

    const playPromise = alarmSound.play();

    if (playPromise !== undefined) {

        playPromise
            .then(function () {

                console.log("🔔 Alarm sound played successfully.");

            })
            .catch(function (error) {

                console.log(
                    "❌ Alarm sound could not play:",
                    error
                );

            });

    }
}


/* ================= FORMAT TIME ================= */

function formatTime(seconds) {

    const minutes =
        Math.floor(seconds / 60);

    const secs =
        seconds % 60;

    return String(minutes).padStart(2, "0")
        + ":"
        + String(secs).padStart(2, "0");
}


/* ================= UPDATE DISPLAY ================= */

function updateDisplay() {

    if (timerDisplay) {

        timerDisplay.textContent =
            formatTime(remainingSeconds);

    }
}


/* ================= FINISH TIMER ================= */

function finishTimer() {

    clearInterval(timerInterval);

    timerInterval = null;

    isRunning = false;

    remainingSeconds = 0;

    updateDisplay();

    /* 🔔 PLAY REAL ALARM SOUND */
    playAlarm();

    /* Completion message */

    if (timerMessage) {

        timerMessage.textContent =
            "🎉 Great job! Your wellness session is complete.";

    }
}


/* ================= START TIMER ================= */

function startTimer() {

    if (isRunning) {

        return;

    }


    /*
        If timer is at zero,
        start again from selected duration.
    */

    if (remainingSeconds <= 0) {

        resetTimer();

    }


    isRunning = true;

    if (timerMessage) {

        timerMessage.textContent =
            "🧘 Wellness session is running...";

    }


    timerInterval =
        setInterval(function () {

            if (remainingSeconds > 0) {

                remainingSeconds--;

                updateDisplay();


                /*
                    When timer reaches zero,
                    finish immediately.
                */

                if (remainingSeconds === 0) {

                    finishTimer();

                }

            }

        }, 1000);

}


/* ================= PAUSE TIMER ================= */

function pauseTimer() {

    if (!isRunning) {

        return;

    }


    clearInterval(timerInterval);

    timerInterval = null;

    isRunning = false;


    if (timerMessage) {

        timerMessage.textContent =
            "⏸ Timer paused.";

    }

}


/* ================= RESET TIMER ================= */

function resetTimer() {

    clearInterval(timerInterval);

    timerInterval = null;

    isRunning = false;


    totalSeconds =
        parseInt(durationSelect.value);


    remainingSeconds =
        totalSeconds;


    updateDisplay();


    if (timerMessage) {

        timerMessage.textContent = "";

    }


    /*
        Stop alarm if it is playing.
    */

    if (alarmSound) {

        alarmSound.pause();

        alarmSound.currentTime = 0;

    }

}


/* ================= DURATION CHANGE ================= */

if (durationSelect) {

    durationSelect.addEventListener(
        "change",
        function () {

            resetTimer();

        }
    );

}


/* ================= BUTTON EVENTS ================= */

if (startBtn) {

    startBtn.addEventListener(
        "click",
        startTimer
    );

}


if (pauseBtn) {

    pauseBtn.addEventListener(
        "click",
        pauseTimer
    );

}


if (resetBtn) {

    resetBtn.addEventListener(
        "click",
        resetTimer
    );

}


/* ================= INITIAL DISPLAY ================= */

updateDisplay();