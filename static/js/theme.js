/* =====================================================
   MINDCARE AI - THEME MANAGER
   ===================================================== */

(function () {

    const savedTheme =
        localStorage.getItem("mindcare-theme");

    const systemDark =
        window.matchMedia &&
        window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

    const theme =
        savedTheme ||
        (systemDark ? "dark" : "light");

    document.documentElement.setAttribute(
        "data-theme",
        theme
    );


    document.addEventListener(
        "DOMContentLoaded",
        function () {

            const toggle =
                document.getElementById(
                    "themeToggle"
                );

            if (!toggle) return;


            updateIcon(toggle, theme);


            toggle.addEventListener(
                "click",
                function () {

                    const current =
                        document.documentElement
                            .getAttribute("data-theme");

                    const newTheme =
                        current === "dark"
                            ? "light"
                            : "dark";


                    document.documentElement
                        .setAttribute(
                            "data-theme",
                            newTheme
                        );


                    localStorage.setItem(
                        "mindcare-theme",
                        newTheme
                    );


                    updateIcon(
                        toggle,
                        newTheme
                    );

                }
            );

        }
    );


    function updateIcon(button, theme) {

        if (theme === "dark") {

            button.innerHTML =
                '<i class="bi bi-sun-fill"></i>';

            button.title =
                "Switch to Light Mode";

        } else {

            button.innerHTML =
                '<i class="bi bi-moon-stars-fill"></i>';

            button.title =
                "Switch to Dark Mode";
        }

    }

})();