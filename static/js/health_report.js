/* =========================================================
   MINDCARE AI
   HEALTH REPORT AI ANALYZER
   File: static/js/health_report.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* ---------------------------------------------------------
       GET ELEMENTS
    --------------------------------------------------------- */

    const fileInput = document.getElementById("healthReportFile");

    const chooseButton = document.getElementById(
        "healthReportChooseBtn"
    );

    const fileNameBox = document.getElementById(
        "healthReportFileName"
    );

    const analyzeButton = document.getElementById(
        "healthReportAnalyzeBtn"
    );

    const uploadArea = document.getElementById(
        "healthReportUploadArea"
    );

    const loadingBox = document.getElementById(
        "healthReportLoading"
    );

    const resultBox = document.getElementById(
        "healthReportResult"
    );

    const resultContent = document.getElementById(
        "healthReportResultContent"
    );

    const errorBox = document.getElementById(
        "healthReportError"
    );


    /* ---------------------------------------------------------
       ALLOWED FILE TYPES
    --------------------------------------------------------- */

    const allowedExtensions = [
        "pdf",
        "jpg",
        "jpeg",
        "png",
        "webp"
    ];

    const maxFileSize = 10 * 1024 * 1024;


    /* ---------------------------------------------------------
       INITIAL STATE
    --------------------------------------------------------- */

    if (analyzeButton) {
        analyzeButton.disabled = true;
    }


    /* ---------------------------------------------------------
       CHOOSE REPORT BUTTON
    --------------------------------------------------------- */

    if (chooseButton && fileInput) {

        chooseButton.addEventListener("click", function () {

            fileInput.click();

        });

    }


    /* ---------------------------------------------------------
       FILE SELECTED
    --------------------------------------------------------- */

    if (fileInput) {

        fileInput.addEventListener("change", function () {

            clearError();

            hideResult();

            const file = fileInput.files[0];

            if (!file) {

                resetFileSelection();

                return;

            }


            /* Check extension */

            const fileExtension = getFileExtension(
                file.name
            );


            if (
                !allowedExtensions.includes(
                    fileExtension
                )
            ) {

                showError(
                    "Please upload a PDF, JPG, JPEG, PNG or WEBP file."
                );

                resetFileSelection();

                return;

            }


            /* Check size */

            if (file.size > maxFileSize) {

                showError(
                    "File size must be 10 MB or less."
                );

                resetFileSelection();

                return;

            }


            /* File accepted */

            displaySelectedFile(file);

            if (analyzeButton) {
                analyzeButton.disabled = false;
            }

        });

    }


    /* ---------------------------------------------------------
       ANALYZE BUTTON
    --------------------------------------------------------- */

    if (analyzeButton) {

        analyzeButton.addEventListener(
            "click",
            analyzeHealthReport
        );

    }


    /* ---------------------------------------------------------
       ANALYZE HEALTH REPORT
    --------------------------------------------------------- */

    async function analyzeHealthReport() {

        clearError();

        const file = fileInput
            ? fileInput.files[0]
            : null;


        /* No file */

        if (!file) {

            showError(
                "Please select a health report first."
            );

            return;

        }


        /* Validate extension again */

        const extension = getFileExtension(
            file.name
        );


        if (!allowedExtensions.includes(extension)) {

            showError(
                "Please upload a PDF, JPG, JPEG, PNG or WEBP file."
            );

            return;

        }


        /* Validate size again */

        if (file.size > maxFileSize) {

            showError(
                "File size must be 10 MB or less."
            );

            return;

        }


        /* -----------------------------------------------------
           UI: LOADING
        ----------------------------------------------------- */

        showLoading();

        hideResult();

        analyzeButton.disabled = true;


        try {

            /* -------------------------------------------------
               CREATE FORM DATA
            ------------------------------------------------- */

            const formData = new FormData();

            formData.append(
                "report",
                file
            );


            /* -------------------------------------------------
               SEND TO FLASK
            ------------------------------------------------- */

            const response = await fetch(
                "/analyze-health-report",
                {
                    method: "POST",
                    body: formData
                }
            );


            /* -------------------------------------------------
               READ RESPONSE
            ------------------------------------------------- */

            let data;

            try {

                data = await response.json();

            } catch (jsonError) {

                throw new Error(
                    "The server returned an invalid response."
                );

            }


            /* -------------------------------------------------
               SERVER ERROR
            ------------------------------------------------- */

            if (!response.ok || !data.success) {

                throw new Error(
                    data.message ||
                    "Unable to analyze the report."
                );

            }


            /* -------------------------------------------------
               SHOW RESULT
            ------------------------------------------------- */

            displayResult(
                data.response
            );


        } catch (error) {

            console.error(
                "Health Report Analyzer Error:",
                error
            );


            showError(
                error.message ||
                "Unable to analyze the report right now. Please try again."
            );

        } finally {

            hideLoading();

            analyzeButton.disabled = false;

        }

    }


    /* ---------------------------------------------------------
       DISPLAY SELECTED FILE
    --------------------------------------------------------- */

    function displaySelectedFile(file) {

        if (!fileNameBox) {
            return;
        }


        fileNameBox.innerHTML = `
            <i class="bi bi-file-earmark-check-fill me-1"></i>
            ${escapeHtml(file.name)}
        `;

    }


    /* ---------------------------------------------------------
       DISPLAY RESULT
    --------------------------------------------------------- */

    function displayResult(text) {

        if (!resultBox || !resultContent) {
            return;
        }


        resultContent.textContent =
            text || "No analysis was returned.";


        resultBox.classList.remove("d-none");


        /* Scroll result into view */

        setTimeout(function () {

            resultBox.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });

        }, 100);

    }


    /* ---------------------------------------------------------
       SHOW LOADING
    --------------------------------------------------------- */

    function showLoading() {

        if (!loadingBox) {
            return;
        }

        loadingBox.classList.remove("d-none");

    }


    /* ---------------------------------------------------------
       HIDE LOADING
    --------------------------------------------------------- */

    function hideLoading() {

        if (!loadingBox) {
            return;
        }

        loadingBox.classList.add("d-none");

    }


    /* ---------------------------------------------------------
       HIDE RESULT
    --------------------------------------------------------- */

    function hideResult() {

        if (!resultBox) {
            return;
        }

        resultBox.classList.add("d-none");

    }


    /* ---------------------------------------------------------
       SHOW ERROR
    --------------------------------------------------------- */

    function showError(message) {

        if (!errorBox) {
            return;
        }


        errorBox.textContent = message;

        errorBox.classList.remove("d-none");


        setTimeout(function () {

            errorBox.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });

        }, 100);

    }


    /* ---------------------------------------------------------
       CLEAR ERROR
    --------------------------------------------------------- */

    function clearError() {

        if (!errorBox) {
            return;
        }

        errorBox.textContent = "";

        errorBox.classList.add("d-none");

    }


    /* ---------------------------------------------------------
       RESET FILE SELECTION
    --------------------------------------------------------- */

    function resetFileSelection() {

        if (fileInput) {

            fileInput.value = "";

        }


        if (fileNameBox) {

            fileNameBox.innerHTML = "";

        }


        if (analyzeButton) {

            analyzeButton.disabled = true;

        }

    }


    /* ---------------------------------------------------------
       GET FILE EXTENSION
    --------------------------------------------------------- */

    function getFileExtension(filename) {

        if (!filename) {
            return "";
        }


        const parts = filename
            .toLowerCase()
            .split(".");


        if (parts.length < 2) {
            return "";
        }


        return parts.pop();

    }


    /* ---------------------------------------------------------
       ESCAPE HTML
       Prevents file name HTML injection
    --------------------------------------------------------- */

    function escapeHtml(value) {

        const div = document.createElement("div");

        div.textContent = value;

        return div.innerHTML;

    }


    /* ---------------------------------------------------------
       RESET MODAL WHEN CLOSED
    --------------------------------------------------------- */

    const healthReportModal =
        document.getElementById(
            "healthReportModal"
        );


    if (healthReportModal) {

        healthReportModal.addEventListener(
            "hidden.bs.modal",
            function () {

                hideLoading();

                hideResult();

                clearError();

                resetFileSelection();

            }
        );

    }


    /* ---------------------------------------------------------
       DRAG & DROP SUPPORT
    --------------------------------------------------------- */

    if (uploadArea) {

        uploadArea.addEventListener(
            "dragover",
            function (event) {

                event.preventDefault();

                uploadArea.classList.add(
                    "health-report-dragging"
                );

            }
        );


        uploadArea.addEventListener(
            "dragleave",
            function () {

                uploadArea.classList.remove(
                    "health-report-dragging"
                );

            }
        );


        uploadArea.addEventListener(
            "drop",
            function (event) {

                event.preventDefault();

                uploadArea.classList.remove(
                    "health-report-dragging"
                );


                const files =
                    event.dataTransfer.files;


                if (!files || !files.length) {
                    return;
                }


                const file = files[0];


                /* Put dropped file into input */

                try {

                    const dataTransfer =
                        new DataTransfer();

                    dataTransfer.items.add(file);

                    fileInput.files =
                        dataTransfer.files;

                } catch (error) {

                    console.warn(
                        "Could not assign dropped file:",
                        error
                    );

                }


                /* Trigger normal validation */

                const changeEvent =
                    new Event("change", {
                        bubbles: true
                    });

                fileInput.dispatchEvent(
                    changeEvent
                );

            }
        );

    }

});