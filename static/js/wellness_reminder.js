/* =====================================================
   MINDCARE AI
   SMART WELLNESS REMINDER
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* =================================================
       GET ELEMENTS
       ================================================= */

    const reminderForm =
        document.getElementById("reminderForm");

    const reminderList =
        document.getElementById("reminderList");

    const reminderType =
        document.getElementById("reminderType");

    const reminderTitle =
        document.getElementById("reminderTitle");

    const reminderHour =
        document.getElementById("reminderHour");

    const reminderMinute =
        document.getElementById("reminderMinute");

    const reminderPeriod =
        document.getElementById("reminderPeriod");

    const reminderTime =
        document.getElementById("reminderTime");

    const repeatType =
        document.getElementById("repeatType");

    const reminderMessage =
        document.getElementById("reminderMessage");

    const saveReminderBtn =
        document.getElementById("saveReminderBtn");


    /* =================================================
       START APPLICATION
       ================================================= */

    loadReminders();

    requestNotificationPermission();

    startReminderChecker();


    /* =================================================
       FORM SUBMIT
       ================================================= */

    reminderForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const type =
                reminderType.value.trim();

            const title =
                reminderTitle.value.trim();

            const hour =
                reminderHour.value;

            const minute =
                reminderMinute.value;

            const period =
                reminderPeriod.value;

            const repeat =
                repeatType.value;

            const message =
                reminderMessage.value.trim();


            /* =================================================
               VALIDATION
               ================================================= */

            if (!type) {

                showMessage(
                    "Please select a reminder type.",
                    "error"
                );

                return;
            }


            if (!title) {

                showMessage(
                    "Please enter a reminder title.",
                    "error"
                );

                return;
            }


            if (!hour || !minute || !period) {

                showMessage(
                    "Please select hour, minute and AM/PM.",
                    "error"
                );

                return;
            }


            /* =================================================
               CONVERT 12-HOUR TIME TO 24-HOUR TIME
               ================================================= */

            let hour24 =
                parseInt(hour);


            if (period === "AM") {

                if (hour24 === 12) {

                    hour24 = 0;

                }

            } else {

                if (hour24 !== 12) {

                    hour24 = hour24 + 12;

                }

            }


            const formattedHour =
                String(hour24).padStart(2, "0");


            const finalTime =
                formattedHour + ":" + minute;


            reminderTime.value =
                finalTime;


            /* =================================================
               DISABLE SAVE BUTTON
               ================================================= */

            saveReminderBtn.disabled = true;

            saveReminderBtn.textContent =
                "Saving...";


            /* =================================================
               SEND DATA TO FLASK
               ================================================= */

            try {

                const response =
                    await fetch(
                        "/save-wellness-reminder",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                reminder_type:
                                    type,

                                reminder_title:
                                    title,

                                reminder_message:
                                    message,

                                reminder_time:
                                    finalTime,

                                repeat_type:
                                    repeat

                            })
                        }
                    );


                const data =
                    await response.json();


                /* =================================================
                   SUCCESS
                   ================================================= */

                if (
                    response.ok &&
                    data.success
                ) {

                    showMessage(
                        "✅ Reminder saved successfully!",
                        "success"
                    );


                    reminderForm.reset();


                    reminderTime.value =
                        "";


                    await loadReminders();


                } else {

                    showMessage(
                        data.message ||
                        "Unable to save reminder.",
                        "error"
                    );

                }


            } catch (error) {

                console.error(
                    "Save reminder error:",
                    error
                );


                showMessage(
                    "❌ Server error. Please try again.",
                    "error"
                );

            }


            /* =================================================
               ENABLE SAVE BUTTON
               ================================================= */

            saveReminderBtn.disabled =
                false;

            saveReminderBtn.textContent =
                "➕ Save Reminder";

        }
    );


    /* =================================================
       LOAD REMINDERS
       ================================================= */

    async function loadReminders() {

        try {

            const response =
                await fetch(
                    "/get-wellness-reminders"
                );


            const data =
                await response.json();


            if (
                response.ok &&
                data.success
            ) {

                displayReminders(
                    data.reminders
                );

            } else {

                displayEmptyState();

            }


        } catch (error) {

            console.error(
                "Load reminders error:",
                error
            );


            displayEmptyState();

        }

    }


    /* =================================================
       DISPLAY REMINDERS
       ================================================= */

    function displayReminders(reminders) {

        reminderList.innerHTML =
            "";


        if (
            !reminders ||
            reminders.length === 0
        ) {

            displayEmptyState();

            return;
        }


        reminders.forEach(
            function (reminder) {

                const item =
                    document.createElement("div");


                item.className =
                    "reminder-item";


                /* =================================================
                   ICON
                   ================================================= */

                const iconBox =
                    document.createElement("div");


                iconBox.className =
                    "reminder-icon";


                iconBox.textContent =
                    getReminderIcon(
                        reminder.reminder_type
                    );


                /* =================================================
                   INFORMATION
                   ================================================= */

                const info =
                    document.createElement("div");


                info.className =
                    "reminder-info";


                const details =
                    document.createElement("div");


                details.className =
                    "reminder-details";


                const title =
                    document.createElement("h3");


                title.textContent =
                    reminder.reminder_title;


                const message =
                    document.createElement("p");


                message.textContent =
                    reminder.reminder_message ||
                    "Wellness reminder";


                const time =
                    document.createElement("div");


                time.className =
                    "reminder-time";


                time.textContent =
                    "⏰ " +
                    formatTime(
                        reminder.reminder_time
                    ) +
                    " • " +
                    formatRepeat(
                        reminder.repeat_type
                    );


                details.appendChild(
                    title
                );

                details.appendChild(
                    message
                );

                details.appendChild(
                    time
                );


                info.appendChild(
                    iconBox
                );

                info.appendChild(
                    details
                );


                /* =================================================
                   ACTIONS
                   ================================================= */

                const actions =
                    document.createElement("div");


                actions.className =
                    "reminder-actions";


                /* =================================================
                   ENABLE / DISABLE TOGGLE
                   ================================================= */

                const toggleLabel =
                    document.createElement("label");


                toggleLabel.className =
                    "toggle";


                const toggleInput =
                    document.createElement("input");


                toggleInput.type =
                    "checkbox";


                toggleInput.checked =
                    Number(
                        reminder.enabled
                    ) === 1;


                const slider =
                    document.createElement("span");


                slider.className =
                    "slider";


                toggleInput.addEventListener(
                    "change",
                    function () {

                        updateReminderStatus(
                            reminder.id,
                            toggleInput.checked
                        );

                    }
                );


                toggleLabel.appendChild(
                    toggleInput
                );

                toggleLabel.appendChild(
                    slider
                );


                /* =================================================
                   DELETE BUTTON
                   ================================================= */

                const deleteButton =
                    document.createElement("button");


                deleteButton.type =
                    "button";


                deleteButton.className =
                    "action-btn delete-btn";


                deleteButton.textContent =
                    "🗑️ Delete";


                deleteButton.addEventListener(
                    "click",
                    function () {

                        deleteReminder(
                            reminder.id
                        );

                    }
                );


                actions.appendChild(
                    toggleLabel
                );

                actions.appendChild(
                    deleteButton
                );


                /* =================================================
                   FINAL ITEM
                   ================================================= */

                item.appendChild(
                    info
                );

                item.appendChild(
                    actions
                );


                reminderList.appendChild(
                    item
                );

            }
        );

    }


    /* =================================================
       EMPTY STATE
       ================================================= */

    function displayEmptyState() {

        reminderList.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    🔔
                </div>

                <h3>
                    No reminders yet
                </h3>

                <p>
                    Create your first wellness reminder above.
                </p>

            </div>

        `;

    }


    /* =================================================
       DELETE REMINDER
       ================================================= */

    async function deleteReminder(id) {

        const confirmed =
            confirm(
                "Are you sure you want to delete this reminder?"
            );


        if (!confirmed) {

            return;
        }


        try {

            const response =
                await fetch(
                    "/delete-wellness-reminder",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            id: id
                        })
                    }
                );


            const data =
                await response.json();


            if (
                response.ok &&
                data.success
            ) {

                showMessage(
                    "🗑️ Reminder deleted successfully.",
                    "success"
                );


                await loadReminders();


            } else {

                showMessage(
                    data.message ||
                    "Unable to delete reminder.",
                    "error"
                );

            }


        } catch (error) {

            console.error(
                "Delete reminder error:",
                error
            );


            showMessage(
                "❌ Server error. Please try again.",
                "error"
            );

        }

    }


    /* =================================================
       ENABLE / DISABLE REMINDER
       ================================================= */

    async function updateReminderStatus(
        id,
        enabled
    ) {

        try {

            const response =
                await fetch(
                    "/toggle-wellness-reminder",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            id: id,

                            enabled: enabled

                        })
                    }
                );


            const data =
                await response.json();


            if (
                response.ok &&
                data.success
            ) {

                showMessage(

                    enabled
                        ? "🔔 Reminder enabled."
                        : "🔕 Reminder disabled.",

                    "success"
                );


            } else {

                showMessage(
                    data.message ||
                    "Unable to update reminder.",
                    "error"
                );

            }


        } catch (error) {

            console.error(
                "Toggle reminder error:",
                error
            );


            showMessage(
                "❌ Unable to update reminder.",
                "error"
            );

        }

    }


    /* =================================================
       BROWSER NOTIFICATION PERMISSION
       ================================================= */

    function requestNotificationPermission() {

        if (
            !("Notification" in window)
        ) {

            console.log(
                "Browser notifications are not supported."
            );

            return;
        }


        if (
            Notification.permission ===
            "default"
        ) {

            Notification.requestPermission()
                .then(
                    function (permission) {

                        console.log(
                            "Notification permission:",
                            permission
                        );

                    }
                )
                .catch(
                    function (error) {

                        console.error(
                            "Notification permission error:",
                            error
                        );

                    }
                );

        }

    }


    /* =================================================
       START REMINDER CHECKER
       ================================================= */

    function startReminderChecker() {

        console.log(
            "🔔 Smart Reminder Checker Started"
        );


        checkReminders();


        /*
           Check every 5 seconds.
        */

        setInterval(
            checkReminders,
            5000
        );

    }


    /* =================================================
       CHECK REMINDERS
       ================================================= */

    async function checkReminders() {

        try {

            const response =
                await fetch(
                    "/get-wellness-reminders"
                );


            const data =
                await response.json();


            if (
                !response.ok ||
                !data.success
            ) {

                return;
            }


            const reminders =
                data.reminders || [];


            const now =
                new Date();


            const currentHour =
                String(
                    now.getHours()
                ).padStart(
                    2,
                    "0"
                );


            const currentMinute =
                String(
                    now.getMinutes()
                ).padStart(
                    2,
                    "0"
                );


            const currentTime =
                currentHour +
                ":" +
                currentMinute;


            /*
               Local date use karna better hai.
               toISOString UTC date de sakta hai.
            */

            const today =
                getLocalDate();


            reminders.forEach(
                function (reminder) {

                    /* Disabled reminder */

                    if (
                        Number(
                            reminder.enabled
                        ) !== 1
                    ) {

                        return;
                    }


                    /* Wrong time */

                    if (
                        reminder.reminder_time !==
                        currentTime
                    ) {

                        return;
                    }


                    /* Already triggered */

                    if (
                        hasReminderTriggered(
                            reminder.id,
                            today,
                            reminder.repeat_type
                        )
                    ) {

                        return;
                    }


                    /* Mark as triggered */

                    markReminderTriggered(
                        reminder.id,
                        today,
                        reminder.repeat_type
                    );


                    /* Trigger message */

                    triggerReminder(
                        reminder
                    );

                }
            );


        } catch (error) {

            console.error(
                "Reminder checker error:",
                error
            );

        }

    }


    /* =================================================
       LOCAL DATE
       ================================================= */

    function getLocalDate() {

        const now =
            new Date();


        const year =
            now.getFullYear();


        const month =
            String(
                now.getMonth() + 1
            ).padStart(
                2,
                "0"
            );


        const day =
            String(
                now.getDate()
            ).padStart(
                2,
                "0"
            );


        return (
            year +
            "-" +
            month +
            "-" +
            day
        );

    }


    /* =================================================
       CHECK DUPLICATE TRIGGER
       ================================================= */

    function hasReminderTriggered(
        id,
        date,
        repeatType
    ) {

        const key =
            "mindcare_reminder_" +
            id +
            "_" +
            date;


        const alreadyTriggered =
            localStorage.getItem(
                key
            );


        if (alreadyTriggered) {

            return true;
        }


        if (
            repeatType === "once"
        ) {

            const onceKey =
                "mindcare_once_reminder_" +
                id;


            if (
                localStorage.getItem(
                    onceKey
                )
            ) {

                return true;
            }

        }


        return false;

    }


    /* =================================================
       MARK REMINDER AS TRIGGERED
       ================================================= */

    function markReminderTriggered(
        id,
        date,
        repeatType
    ) {

        const key =
            "mindcare_reminder_" +
            id +
            "_" +
            date;


        localStorage.setItem(
            key,
            "true"
        );


        if (
            repeatType === "once"
        ) {

            const onceKey =
                "mindcare_once_reminder_" +
                id;


            localStorage.setItem(
                onceKey,
                "true"
            );

        }

    }


    /* =================================================
       TRIGGER REMINDER
       ================================================= */

    function triggerReminder(
        reminder
    ) {

        console.log(
            "🔔 REMINDER TRIGGERED:",
            reminder
        );


        /* =================================================
           BROWSER NOTIFICATION
           ================================================= */

        showBrowserNotification(
            reminder
        );


        /* =================================================
           ON PAGE POPUP
           ================================================= */

        showReminderPopup(
            reminder
        );

    }


    /* =================================================
       BROWSER NOTIFICATION
       ================================================= */

    function showBrowserNotification(
        reminder
    ) {

        if (
            !("Notification" in window)
        ) {

            return;
        }


        if (
            Notification.permission !==
            "granted"
        ) {

            console.log(
                "Notification permission not granted."
            );

            return;
        }


        try {

            const notification =
                new Notification(
                    "🔔 MindCare AI Reminder",
                    {

                        body:
                            reminder.reminder_message ||
                            reminder.reminder_title,

                        tag:
                            "mindcare-" +
                            reminder.id

                    }
                );


            notification.onclick =
                function () {

                    window.focus();

                    notification.close();

                };


        } catch (error) {

            console.error(
                "Notification error:",
                error
            );

        }

    }


    /* =================================================
       ON PAGE REMINDER POPUP
       ================================================= */

    function showReminderPopup(
        reminder
    ) {

        const oldPopup =
            document.getElementById(
                "wellnessReminderPopup"
            );


        if (oldPopup) {

            oldPopup.remove();
        }


        const popup =
            document.createElement(
                "div"
            );


        popup.id =
            "wellnessReminderPopup";


        popup.innerHTML = `

            <div class="wellness-popup-overlay">

                <div class="wellness-popup">

                    <div class="popup-icon">
                        🔔
                    </div>

                    <h2>
                        MindCare AI Reminder
                    </h2>

                    <h3>
                        ${escapeHtml(
                            reminder.reminder_title
                        )}
                    </h3>

                    <p>
                        ${escapeHtml(
                            reminder.reminder_message ||
                            "It's time for your wellness activity."
                        )}
                    </p>

                    <button
                        id="closeReminderPopup"
                        type="button">

                        ✓ Got it

                    </button>

                </div>

            </div>

        `;


        document.body.appendChild(
            popup
        );


        const closeButton =
            document.getElementById(
                "closeReminderPopup"
            );


        if (closeButton) {

            closeButton.addEventListener(
                "click",
                function () {

                    popup.remove();

                }
            );

        }


        /* Auto close after 15 seconds */

        setTimeout(
            function () {

                if (
                    document.body.contains(
                        popup
                    )
                ) {

                    popup.remove();

                }

            },
            15000
        );

    }


    /* =================================================
       ESCAPE HTML
       ================================================= */

    function escapeHtml(text) {

        const div =
            document.createElement(
                "div"
            );


        div.textContent =
            text;


        return div.innerHTML;

    }


    /* =================================================
       REMINDER ICON
       ================================================= */

    function getReminderIcon(type) {

        switch (type) {

            case "Mind Check":
                return "🧠";

            case "Exercise":
                return "🏃";

            case "Meditation":
                return "🧘";

            case "Yoga":
                return "🧘‍♀️";

            case "Custom":
                return "🔔";

            default:
                return "🔔";

        }

    }


    /* =================================================
       FORMAT TIME
       ================================================= */

    function formatTime(time) {

        if (!time) {

            return "--:--";
        }


        const parts =
            time.split(":");


        let hour =
            parseInt(
                parts[0]
            );


        const minute =
            parts[1];


        const period =
            hour >= 12
                ? "PM"
                : "AM";


        hour =
            hour % 12;


        if (hour === 0) {

            hour = 12;
        }


        return (
            hour +
            ":" +
            minute +
            " " +
            period
        );

    }


    /* =================================================
       FORMAT REPEAT
       ================================================= */

    function formatRepeat(type) {

        if (
            type === "daily"
        ) {

            return "Every Day";
        }


        if (
            type === "once"
        ) {

            return "Once";
        }


        return (
            type ||
            "Every Day"
        );

    }


    /* =================================================
       SHOW MESSAGE
       ================================================= */

    function showMessage(
        text,
        type
    ) {

        let messageBox =
            document.getElementById(
                "messageBox"
            );


        if (!messageBox) {

            messageBox =
                document.createElement(
                    "div"
                );


            messageBox.id =
                "messageBox";


            messageBox.className =
                "message";


            reminderForm.parentNode.insertBefore(
                messageBox,
                reminderForm
            );

        }


        messageBox.textContent =
            text;


        messageBox.className =
            "message " +
            type;


        messageBox.style.display =
            "block";


        setTimeout(
            function () {

                messageBox.style.display =
                    "none";

            },
            3500
        );

    }

});