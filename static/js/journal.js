/* =====================================================
   MINDCARE AI - JOURNAL JAVASCRIPT
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const journalForm = document.getElementById("journalForm");
    const saveButton = document.getElementById("saveJournalBtn");
    const messageBox = document.getElementById("journalMessage");



    /* =================================================
       SAVE JOURNAL
    ================================================= */

    if (journalForm) {

        journalForm.addEventListener("submit", async function (event) {

            event.preventDefault();


            const titleInput = document.getElementById("journalTitle");
            const moodInput = document.getElementById("journalMood");
            const contentInput = document.getElementById("journalContent");


            const title = titleInput.value.trim();
            const mood = moodInput.value;
            const content = contentInput.value.trim();


            /* VALIDATION */

            if (!title) {

                showMessage(
                    "Please enter a journal title.",
                    "error"
                );

                titleInput.focus();

                return;
            }


            if (!content) {

                showMessage(
                    "Please write something in your journal.",
                    "error"
                );

                contentInput.focus();

                return;
            }


            /* DISABLE BUTTON */

            saveButton.disabled = true;

            saveButton.innerHTML =
                '<i class="bi bi-hourglass-split"></i> Saving...';


            try {

                const response = await fetch("/save-journal", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        title: title,
                        mood: mood,
                        content: content

                    })

                });


                const data = await response.json();


                if (response.ok && data.success) {

                    showMessage(
                        data.message || "Journal saved successfully! ❤️",
                        "success"
                    );


                    /* CLEAR FORM */

                    journalForm.reset();


                    /* DEFAULT MOOD */

                    if (moodInput) {
                        moodInput.value = "Okay";
                    }


                    /* RELOAD PAGE */

                    setTimeout(function () {

                        window.location.reload();

                    }, 700);


                } else {

                    showMessage(
                        data.message || "Unable to save journal.",
                        "error"
                    );

                }


            } catch (error) {

                console.error(
                    "Journal Save Error:",
                    error
                );


                showMessage(
                    "Something went wrong. Please try again.",
                    "error"
                );

            }


            /* ENABLE BUTTON */

            saveButton.disabled = false;

            saveButton.innerHTML =
                '<i class="bi bi-save"></i> Save Journal';

        });

    }



    /* =================================================
       DELETE BUTTONS
    ================================================= */

    const deleteButtons =
        document.querySelectorAll(".delete-button");


    deleteButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const entryId =
                this.getAttribute("data-entry-id");


            if (!entryId) {

                showMessage(
                    "Journal entry ID not found.",
                    "error"
                );

                return;
            }


            deleteJournal(entryId);

        });

    });

});



/* =====================================================
   DELETE JOURNAL
   ===================================================== */

async function deleteJournal(entryId) {

    const confirmation = confirm(
        "Are you sure you want to delete this journal entry?"
    );


    if (!confirmation) {
        return;
    }


    try {

        const response = await fetch(
            `/delete-journal/${entryId}`,
            {
                method: "POST"
            }
        );


        const data = await response.json();


        if (response.ok && data.success) {

            const entryCard =
                document.getElementById(`entry-${entryId}`);


            if (entryCard) {

                entryCard.style.opacity = "0";

                entryCard.style.transform = "translateY(-5px)";


                setTimeout(function () {

                    entryCard.remove();

                    updateEntryCount();

                }, 200);

            }


        } else {

            alert(
                data.message ||
                "Unable to delete journal entry."
            );

        }


    } catch (error) {

        console.error(
            "Journal Delete Error:",
            error
        );


        alert(
            "Something went wrong while deleting the journal."
        );

    }

}



/* =====================================================
   SHOW MESSAGE
   ===================================================== */

function showMessage(message, type) {

    const messageBox =
        document.getElementById("journalMessage");


    if (!messageBox) {
        return;
    }


    messageBox.textContent = message;


    messageBox.className =
        type === "success"
            ? "message-success"
            : "message-error";


    setTimeout(function () {

        messageBox.textContent = "";
        messageBox.className = "";

    }, 4000);

}



/* =====================================================
   UPDATE ENTRY COUNT
   ===================================================== */

function updateEntryCount() {

    const entriesContainer =
        document.getElementById("journalEntries");


    const countElement =
        document.querySelector(".entry-count");


    if (!entriesContainer || !countElement) {
        return;
    }


    const cards =
        entriesContainer.querySelectorAll(".entry-card");


    countElement.textContent = cards.length;


    /* EMPTY STATE */

    if (cards.length === 0) {

        entriesContainer.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">

                    <i class="bi bi-journal"></i>

                </div>

                <h3>
                    No journal entries yet
                </h3>

                <p>
                    Your thoughts will appear here after
                    you save your first journal entry.
                </p>

            </div>

        `;

    }

}