document.addEventListener("DOMContentLoaded", function () {

    console.log("🧠 Mind Check Loaded");


    // ==========================================
    // ELEMENTS
    // ==========================================

    const questions =
        document.querySelectorAll(".question-card");

    const nextButton =
        document.getElementById("nextButton");

    const previousButton =
        document.getElementById("previousButton");

    const submitButton =
        document.getElementById("submitButton");

    const progressFill =
        document.getElementById("progressFill");

    const questionNumber =
        document.getElementById("questionNumber");

    const progressPercent =
        document.getElementById("progressPercent");

    const form =
        document.getElementById("mindCheckForm");


    let currentQuestion = 0;

    const totalQuestions = questions.length;


    // ==========================================
    // SHOW QUESTION
    // ==========================================

    function showQuestion(index) {

        questions.forEach(function (question, i) {

            question.classList.toggle(
                "active",
                i === index
            );

        });


        // Question number

        questionNumber.textContent =
            "Question " +
            (index + 1) +
            " of " +
            totalQuestions;


        // Progress

        const percentage =
            Math.round(
                ((index + 1) / totalQuestions) * 100
            );

        progressFill.style.width =
            percentage + "%";

        progressPercent.textContent =
            percentage + "%";


        // Previous button

        if (index === 0) {

            previousButton.style.visibility =
                "hidden";

        } else {

            previousButton.style.visibility =
                "visible";
        }


        // Next / Submit

        if (index === totalQuestions - 1) {

            nextButton.style.display =
                "none";

            submitButton.style.display =
                "inline-flex";

        } else {

            nextButton.style.display =
                "inline-flex";

            submitButton.style.display =
                "none";
        }


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    // ==========================================
    // CHECK CURRENT ANSWER
    // ==========================================

    function checkCurrentAnswer() {

        const current =
            questions[currentQuestion];

        const selected =
            current.querySelector(
                'input[type="radio"]:checked'
            );


        if (!selected) {

            alert(
                "Please select an answer before continuing."
            );

            return false;
        }

        return true;
    }


    // ==========================================
    // CALCULATE STRESS SCORE
    // ==========================================

    function calculateScore() {

        let totalScore = 0;


        questions.forEach(function (question) {

            const selected =
                question.querySelector(
                    'input[type="radio"]:checked'
                );


            if (selected) {

                const answerValue =
                    Number(selected.value);


                /*
                 * Answer values:
                 *
                 * 4 = Best / Healthy
                 * 3 = Good
                 * 2 = Moderate
                 * 1 = Difficult / Unhealthy
                 *
                 * Convert them into stress points:
                 *
                 * 4 -> 0 stress points
                 * 3 -> 1 stress point
                 * 2 -> 2 stress points
                 * 1 -> 3 stress points
                 */

                const stressPoints =
                    4 - answerValue;


                totalScore += stressPoints;
            }

        });


        return totalScore;
    }


    // ==========================================
    // NEXT BUTTON
    // ==========================================

    nextButton.addEventListener(
        "click",
        function () {

            if (!checkCurrentAnswer()) {
                return;
            }


            if (
                currentQuestion <
                totalQuestions - 1
            ) {

                currentQuestion++;

                showQuestion(
                    currentQuestion
                );
            }

        }
    );


    // ==========================================
    // PREVIOUS BUTTON
    // ==========================================

    previousButton.addEventListener(
        "click",
        function () {

            if (currentQuestion > 0) {

                currentQuestion--;

                showQuestion(
                    currentQuestion
                );
            }

        }
    );


    // ==========================================
    // SHOW RESULT PAGE
    // ==========================================

    function showResult(resultData) {

        const score =
            Number(resultData.score || 0);

        const result =
            resultData.result || "Mind Check Completed";

        const stressLevel =
            Number(resultData.stress_level || 1);


        let resultIcon = "🌿";
        let resultMessage = "";
        let recommendation = "";


        // ======================================
        // RESULT BASED ON SCORE
        // ======================================

        if (score <= 5) {

            resultIcon = "😊";

            resultMessage =
                "Your current wellness indicators look positive. " +
                "You appear to be experiencing a relatively low level of stress.";

            recommendation =
                "Continue maintaining healthy habits such as good sleep, " +
                "regular movement, relaxation and positive social connections.";

        }

        else if (score <= 10) {

            resultIcon = "🙂";

            resultMessage =
                "You may be experiencing some stress or emotional pressure. " +
                "Taking some time for yourself may be helpful.";

            recommendation =
                "Try a short breathing exercise, light walking, meditation " +
                "or a relaxing activity. Keep an eye on how you feel.";

        }

        else if (score <= 15) {

            resultIcon = "😟";

            resultMessage =
                "Your answers suggest that you may be experiencing a higher " +
                "level of stress or reduced wellbeing.";

            recommendation =
                "Consider taking regular breaks, practicing relaxation or " +
                "breathing exercises, improving your sleep routine and talking " +
                "to someone you trust if you feel comfortable.";

        }

        else {

            resultIcon = "🫂";

            resultMessage =
                "Your answers indicate a very high level of stress-related " +
                "wellness concerns at this moment.";

            recommendation =
                "Please give yourself time to rest and consider reaching out " +
                "to a trusted person or an appropriate mental-health professional " +
                "if these feelings are persistent or difficult to manage.";

        }


        // ======================================
        // RESULT HTML
        // ======================================

        document.body.innerHTML = `

            <div class="page-wrapper">

                <header class="check-header">

                    <div class="brand">

                        <div class="brand-icon">
                            <i class="bi bi-flower1"></i>
                        </div>

                        <div>
                            <h2>MindCare</h2>
                            <span>AI Wellness</span>
                        </div>

                    </div>

                    <a
                        href="/dashboard"
                        class="back-button"
                    >
                        <i class="bi bi-arrow-left"></i>
                        Dashboard
                    </a>

                </header>


                <main class="check-container">

                    <section class="intro-card">

                        <div class="intro-icon">
                            <i class="bi bi-clipboard2-heart"></i>
                        </div>

                        <div>

                            <span class="section-label">
                                MIND CHECK RESULT
                            </span>

                            <h1>
                                Your Wellness Result
                            </h1>

                            <p>
                                Thank you for completing your daily wellness check.
                            </p>

                        </div>

                    </section>


                    <section
                        style="
                            background: white;
                            border-radius: 24px;
                            padding: 45px 30px;
                            margin-top: 25px;
                            text-align: center;
                            box-shadow: 0 15px 40px rgba(0,0,0,0.08);
                        "
                    >

                        <div
                            style="
                                font-size: 65px;
                                margin-bottom: 15px;
                            "
                        >
                            ${resultIcon}
                        </div>


                        <div
                            style="
                                font-size: 14px;
                                font-weight: 700;
                                letter-spacing: 1.5px;
                                color: #777;
                                margin-bottom: 10px;
                            "
                        >
                            YOUR RESULT
                        </div>


                        <h1
                            style="
                                margin: 0 0 20px;
                                font-size: 36px;
                                color: #5b3c88;
                            "
                        >
                            ${result}
                        </h1>


                        <div
                            style="
                                display: inline-block;
                                padding: 14px 30px;
                                border-radius: 50px;
                                background: #f1eaff;
                                color: #5b3c88;
                                font-size: 22px;
                                font-weight: 700;
                                margin-bottom: 25px;
                            "
                        >
                            Score: ${score} / 24
                        </div>


                        <p
                            style="
                                max-width: 700px;
                                margin: 0 auto 20px;
                                font-size: 17px;
                                line-height: 1.7;
                                color: #555;
                            "
                        >
                            ${resultMessage}
                        </p>


                        <div
                            style="
                                max-width: 700px;
                                margin: 25px auto;
                                padding: 22px;
                                border-radius: 16px;
                                background: #f8f6ff;
                                text-align: left;
                            "
                        >

                            <h3
                                style="
                                    color: #5b3c88;
                                    margin-bottom: 10px;
                                "
                            >
                                💜 Suggested Wellness Steps
                            </h3>

                            <p
                                style="
                                    margin: 0;
                                    line-height: 1.7;
                                    color: #555;
                                "
                            >
                                ${recommendation}
                            </p>

                        </div>


                        <div
                            style="
                                display: flex;
                                justify-content: center;
                                gap: 15px;
                                flex-wrap: wrap;
                                margin-top: 30px;
                            "
                        >

                            <a
                                href="/dashboard"
                                style="
                                    text-decoration: none;
                                    padding: 13px 25px;
                                    border-radius: 12px;
                                    background: #6c4ab6;
                                    color: white;
                                    font-weight: 600;
                                "
                            >
                                <i class="bi bi-house"></i>
                                Back to Dashboard
                            </a>


                            <a
                                href="/mind-check"
                                style="
                                    text-decoration: none;
                                    padding: 13px 25px;
                                    border-radius: 12px;
                                    background: #eee8fa;
                                    color: #5b3c88;
                                    font-weight: 600;
                                "
                            >
                                <i class="bi bi-arrow-repeat"></i>
                                Take Again
                            </a>

                        </div>


                        <div
                            style="
                                margin-top: 30px;
                                padding-top: 20px;
                                border-top: 1px solid #eee;
                                font-size: 13px;
                                color: #777;
                            "
                        >
                            <i class="bi bi-info-circle"></i>
                            This wellness check is for general self-awareness
                            and does not provide a medical diagnosis.
                        </div>

                    </section>

                </main>

            </div>
        `;
    }


    // ==========================================
    // FORM SUBMIT
    // ==========================================

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // Check current question

            if (!checkCurrentAnswer()) {

                return;
            }


            // Check ALL questions

            let allAnswered = true;

            questions.forEach(function (question) {

                const selected =
                    question.querySelector(
                        'input[type="radio"]:checked'
                    );

                if (!selected) {

                    allAnswered = false;
                }

            });


            if (!allAnswered) {

                alert(
                    "Please answer all questions before completing the Mind Check."
                );

                return;
            }


            // ==================================
            // CALCULATE SCORE
            // ==================================

            const totalScore =
                calculateScore();


            console.log(
                "🧠 Mind Check Score:",
                totalScore
            );


            // ==================================
            // DISABLE BUTTON
            // ==================================

            submitButton.disabled = true;

            submitButton.innerHTML =
                '<i class="bi bi-hourglass-split"></i> Processing...';


            try {

                // ==================================
                // SEND SCORE TO FLASK
                // ==================================

                const formData =
                    new FormData(form);


                formData.set(
                    "score",
                    totalScore
                );


                const response =
                    await fetch(
                        form.action,
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                // ==================================
                // READ RESPONSE
                // ==================================

                const data =
                    await response.json();


                console.log(
                    "✅ Mind Check Result:",
                    data
                );


                if (!data.success) {

                    throw new Error(
                        "Mind Check submission failed."
                    );
                }


                // ==================================
                // SHOW ATTRACTIVE RESULT
                // ==================================

                showResult(data);


            }

            catch (error) {

                console.error(
                    "❌ Mind Check Error:",
                    error
                );


                alert(
                    "Something went wrong while processing your Mind Check. Please try again."
                );


                submitButton.disabled = false;

                submitButton.innerHTML =
                    'Complete Check <i class="bi bi-check2-circle"></i>';
            }

        }
    );


    // ==========================================
    // INITIALIZE
    // ==========================================

    showQuestion(0);

});