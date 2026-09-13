/* =========================================================
   MINDCARE AI - MY PROGRESS
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const motivationButton =
            document.getElementById(
                "motivationButton"
            );


        if (motivationButton) {

            motivationButton.addEventListener(
                "click",
                function () {

                    alert(
                        "🌱 Every small step matters! Keep taking care of your mind and yourself. 💜"
                    );

                }
            );

        }

    }
);