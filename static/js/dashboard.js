document.addEventListener("DOMContentLoaded", function () {

    console.log("🌿 MindCare AI Dashboard Loaded");


    // =====================================================
    // MOBILE SIDEBAR
    // =====================================================

    const menuButton =
        document.getElementById("menuButton");

    const sidebar =
        document.getElementById("sidebar");

    const overlay =
        document.getElementById("sidebarOverlay");


    if (menuButton && sidebar) {

        menuButton.addEventListener("click", function () {

            sidebar.classList.toggle("open");

            if (overlay) {

                overlay.classList.toggle("active");

            }

        });

    }


    if (overlay) {

        overlay.addEventListener("click", function () {

            if (sidebar) {

                sidebar.classList.remove("open");

            }

            overlay.classList.remove("active");

        });

    }



    // =====================================================
    // MOOD TRACKING
    // =====================================================

    const moodButtons =
        document.querySelectorAll(".mood-option");

    const moodMessage =
        document.getElementById("moodMessage");


    const messages = {

        Happy:
            "That's wonderful! Keep doing things that bring you joy. 😊",

        Calm:
            "Great! Try to maintain this peaceful feeling. 🌿",

        Okay:
            "That's okay. A small wellness activity may help you feel better. 🙂",

        Sad:
            "Be gentle with yourself today. Consider a short walk or breathing exercise. 💚",

        Stressed:
            "Take a pause. A short breathing or relaxation activity may help. 🧘"

    };


    moodButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            moodButtons.forEach(function (item) {

                item.classList.remove("selected");

            });


            this.classList.add("selected");


            const mood =
                this.getAttribute("data-mood");


            if (moodMessage && messages[mood]) {

                moodMessage.textContent =
                    messages[mood];

            }


            console.log(
                "Selected mood:",
                mood
            );


            // =================================================
            // SAVE MOOD
            // =================================================

            fetch("/save-mood", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    mood: mood
                })

            })

            .then(async function (response) {

                const data =
                    await response.json();

                if (!response.ok || !data.success) {

                    throw new Error(
                        data.message ||
                        "Mood could not be saved."
                    );

                }

                return data;

            })

            .then(function (data) {

                console.log(
                    "✅ Mood saved successfully:",
                    data
                );


                if (moodMessage) {

                    moodMessage.textContent =
                        messages[mood] +
                        "  ✅ " +
                        data.message;

                }

            })

            .catch(function (error) {

                console.error(
                    "❌ Mood save error:",
                    error
                );


                if (moodMessage) {

                    moodMessage.textContent =
                        "❌ Mood could not be saved. Please try again.";

                }

            });

        });

    });



    // =====================================================
    // QUICK ACTION BUTTONS
    // =====================================================

    const quickActions =
        document.querySelectorAll(".quick-action");


    quickActions.forEach(function (button) {

        button.addEventListener("click", function () {

            const actionText =
                this.querySelector("span");


            if (!actionText) {

                return;

            }


            const action =
                actionText.textContent.trim();


            console.log(
                "Quick Action:",
                action
            );


            // -------------------------------------------------
            // MEDITATION
            // -------------------------------------------------

            if (action === "Meditate") {

                window.location.href =
                    "/meditation";

                return;

            }


            // -------------------------------------------------
            // EXERCISE
            // -------------------------------------------------

            if (action === "Exercise") {

                window.location.href =
                    "/exercise";

                return;

            }


            // -------------------------------------------------
            // YOGA
            // -------------------------------------------------

            if (action === "Yoga") {

                window.location.href =
                    "/yoga";

                return;

            }


            // -------------------------------------------------
            // TIMER
            // -------------------------------------------------

            if (action === "Timer") {

                window.location.href =
                    "/wellness-timer";

                return;

            }

        });

    });



    // =====================================================
    // START MIND CHECK
    // =====================================================

    const primaryAction =
        document.querySelector(".primary-action");


    if (primaryAction) {

        primaryAction.addEventListener("click", function () {

            console.log(
                "🧠 Start Mind Check clicked"
            );


            window.location.href =
                "/mind-check";

        });

    }



    // =====================================================
    // RECOMMENDED ACTIVITY
    // =====================================================

    const secondaryAction =
        document.querySelector(".secondary-action");


    if (secondaryAction) {

        secondaryAction.addEventListener("click", function () {

            console.log(
                "🧘 Recommended activity clicked"
            );


            window.location.href =
                "/meditation";

        });

    }



    // =====================================================
    // TAKE ASSESSMENT
    // =====================================================

    const assessmentButton =
        document.querySelector(
            ".mind-check-card button"
        );


    if (assessmentButton) {

        assessmentButton.addEventListener(
            "click",
            function () {

                console.log(
                    "🧠 Take Assessment clicked"
                );


                window.location.href =
                    "/mind-check";

            }
        );

    }
    // =====================================================
    // VIEW REPORT
    // =====================================================

    const reportButton =
        document.querySelector(".view-report");


    if (reportButton) {

        reportButton.addEventListener(
            "click",
            function () {

                console.log(
                    "📊 View Report clicked"
                );


                window.location.href =
                    "/report";

            }
        );

    }



    // =====================================================
    // NOTIFICATION BUTTON
    // =====================================================

    const notificationButton =
        document.querySelector(".icon-btn");


    if (notificationButton) {

        notificationButton.addEventListener(
            "click",
            function () {

                console.log(
                    "🔔 Notification button clicked"
                );


                alert(
                    "🔔 You have no new notifications."
                );

            }
        );

    }



    // =====================================================
    // SEARCH
    // =====================================================

    const searchInput =
        document.querySelector(
            ".topbar-search input"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                const searchValue =
                    this.value
                        .toLowerCase()
                        .trim();


                if (searchValue.length > 0) {

                    console.log(
                        "🔍 Searching for:",
                        searchValue
                    );

                }

            }
        );

    }



    // =====================================================
    // SIDEBAR MENU LINKS
    // =====================================================

    const menuLinks =
        document.querySelectorAll(".menu-link");


    menuLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                console.log(
                    "📌 Sidebar link clicked"
                );


                const menuText =
                    this.querySelector("span");


                if (menuText) {

                    console.log(
                        "Menu:",
                        menuText.textContent.trim()
                    );

                }


                // -------------------------------------------------
                // MOBILE SIDEBAR CLOSE
                // -------------------------------------------------

                if (window.innerWidth <= 850) {

                    if (sidebar) {

                        sidebar.classList.remove(
                            "open"
                        );

                    }

                    if (overlay) {

                        overlay.classList.remove(
                            "active"
                        );

                    }

                }


                // -------------------------------------------------
                // IMPORTANT
                // -------------------------------------------------
                // यहां event.preventDefault()
                // जानबूझकर नहीं है।
                //
                // इसलिए <a href="..."> link अब
                // अपने Flask page पर जाएगा।
                // -------------------------------------------------

            }
        );

    });



    // =====================================================
    // ESCAPE KEY
    // =====================================================

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                if (sidebar) {

                    sidebar.classList.remove(
                        "open"
                    );

                }

                if (overlay) {

                    overlay.classList.remove(
                        "active"
                    );

                }

            }

        }
    );



    // =====================================================
    // WINDOW RESIZE
    // =====================================================

    window.addEventListener(
        "resize",
        function () {

            if (window.innerWidth > 850) {

                if (sidebar) {

                    sidebar.classList.remove(
                        "open"
                    );

                }

                if (overlay) {

                    overlay.classList.remove(
                        "active"
                    );

                }

            }

        }
    );



    // =====================================================
    // PAGE LOADED
    // =====================================================

    console.log(
        "✅ Dashboard JavaScript initialized successfully"
    );

});