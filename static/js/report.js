/* ============================================================
   MINDCARE AI - MY REPORTS JAVASCRIPT
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

    const printButton = document.getElementById("printReportButton");


    /* ========================================================
       PRINT REPORT
       ======================================================== */

    if (printButton) {

        printButton.addEventListener("click", function () {

            window.print();

        });

    }

});