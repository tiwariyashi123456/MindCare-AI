/* =========================================================
   MINDCARE AI - MIND GAMES JAVASCRIPT
   ========================================================= */


/* ================= GLOBAL VARIABLES ================= */

let currentGame = null;

let currentScore = 0;

let gameFinished = false;

let gameTimer = null;


/* ================= STORAGE ================= */

const TOTAL_KEY = "mindCareMindGamesTotal";

const BEST_KEY = "mindCareMindGamesBest";

const TODAY_KEY = "mindCareMindGamesToday";

const DATE_KEY = "mindCareMindGamesDate";


/* ================= DOM ================= */

const gameAreaSection =
    document.getElementById("gameAreaSection");

const resultSection =
    document.getElementById("resultSection");

const gameContainer =
    document.getElementById("gameContainer");

const gameTitle =
    document.getElementById("currentGameTitle");

const gameInstruction =
    document.getElementById("gameInstruction");

const gameMessage =
    document.getElementById("gameMessage");

const liveScore =
    document.getElementById("liveScore");

const totalActivities =
    document.getElementById("totalActivities");

const bestScore =
    document.getElementById("bestScore");

const todayScore =
    document.getElementById("todayScore");

const finalScore =
    document.getElementById("finalScore");

const resultBestScore =
    document.getElementById("resultBestScore");

const resultTodayScore =
    document.getElementById("resultTodayScore");

const finishGameBtn =
    document.getElementById("finishGameBtn");

const restartGameBtn =
    document.getElementById("restartGameBtn");

const closeGameBtn =
    document.getElementById("closeGameBtn");

const playAgainBtn =
    document.getElementById("playAgainBtn");


/* ================= INITIALIZATION ================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateDashboardStats();

        setupStartButtons();

        finishGameBtn.addEventListener(
            "click",
            finishCurrentGame
        );

        restartGameBtn.addEventListener(
            "click",
            function () {

                if (currentGame) {

                    startGame(currentGame);

                }

            }
        );

        closeGameBtn.addEventListener(
            "click",
            closeGame
        );

        playAgainBtn.addEventListener(
            "click",
            function () {

                resultSection.style.display = "none";

                if (currentGame) {

                    startGame(currentGame);

                }

            }
        );

    }
);


/* ================= START BUTTONS ================= */

function setupStartButtons() {

    const buttons =
        document.querySelectorAll(
            ".start-game-btn"
        );

    buttons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    const game =
                        button.dataset.game;

                    startGame(game);

                }
            );

        }
    );
}


/* ================= START GAME ================= */

function startGame(gameName) {

    clearTimeout(gameTimer);

    currentGame = gameName;

    currentScore = 0;

    gameFinished = false;

    liveScore.textContent = "0";

    gameMessage.textContent = "";

    resultSection.style.display = "none";

    gameAreaSection.style.display = "block";

    gameAreaSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });


    if (gameName === "memory") {

        gameTitle.textContent =
            "Memory Match";

        gameInstruction.textContent =
            "Remember the numbers and match the identical pairs.";

        createMemoryGame();

    }


    else if (gameName === "pattern") {

        gameTitle.textContent =
            "Pattern Memory";

        gameInstruction.textContent =
            "Watch the glowing tiles and tap them in the same order.";

        createPatternGame();

    }


    else if (gameName === "car") {

        gameTitle.textContent =
            "Car Match";

        gameInstruction.textContent =
            "Flip the cards and find all matching car pairs.";

        createCarGame();

    }

}


/* =========================================================
   SCORE FUNCTIONS
   ========================================================= */


/* SET LIVE SCORE */

function setScore(score) {

    currentScore = Math.max(
        0,
        Math.round(score)
    );

    liveScore.textContent =
        currentScore;
}


/* ADD SCORE */

function addScore(points) {

    currentScore += points;

    liveScore.textContent =
        currentScore;
}


/* ================= DATE ================= */

function getTodayString() {

    const now = new Date();

    return (
        now.getFullYear() +
        "-" +
        String(now.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(now.getDate()).padStart(2, "0")
    );

}


/* ================= STATS ================= */

function updateDashboardStats() {

    const today =
        getTodayString();

    const savedDate =
        localStorage.getItem(
            DATE_KEY
        );


    if (savedDate !== today) {

        localStorage.setItem(
            DATE_KEY,
            today
        );

        localStorage.setItem(
            TODAY_KEY,
            "0"
        );

    }


    const total =
        Number(
            localStorage.getItem(
                TOTAL_KEY
            ) || 0
        );


    const best =
        Number(
            localStorage.getItem(
                BEST_KEY
            ) || 0
        );


    const todayScoreValue =
        Number(
            localStorage.getItem(
                TODAY_KEY
            ) || 0
        );


    totalActivities.textContent =
        total;

    bestScore.textContent =
        best;

    todayScore.textContent =
        todayScoreValue;

}


/* ================= SAVE SCORE ================= */

function saveCompletedScore(score) {

    const oldBest =
        Number(
            localStorage.getItem(
                BEST_KEY
            ) || 0
        );


    const oldToday =
        Number(
            localStorage.getItem(
                TODAY_KEY
            ) || 0
        );


    const total =
        Number(
            localStorage.getItem(
                TOTAL_KEY
            ) || 0
        );


    localStorage.setItem(
        TOTAL_KEY,
        total + 1
    );


    localStorage.setItem(
        BEST_KEY,
        Math.max(
            oldBest,
            score
        )
    );


    localStorage.setItem(
        TODAY_KEY,
        oldToday + score
    );


    updateDashboardStats();

}


/* =========================================================
   FINISH GAME
   ========================================================= */

function finishCurrentGame() {

    if (gameFinished) {

        return;

    }


    gameFinished = true;


    clearTimeout(gameTimer);


    saveCompletedScore(
        currentScore
    );


    finalScore.textContent =
        currentScore;


    resultBestScore.textContent =
        localStorage.getItem(
            BEST_KEY
        ) || 0;


    resultTodayScore.textContent =
        localStorage.getItem(
            TODAY_KEY
        ) || 0;


    gameAreaSection.style.display =
        "none";


    resultSection.style.display =
        "block";


    resultSection.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


/* ================= CLOSE GAME ================= */

function closeGame() {

    clearTimeout(gameTimer);

    gameAreaSection.style.display =
        "none";

    gameContainer.innerHTML =
        "";

    gameMessage.textContent =
        "";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   GAME 1 - MEMORY MATCH
   ========================================================= */

function createMemoryGame() {

    gameContainer.innerHTML = "";


    const wrapper =
        document.createElement("div");

    wrapper.className =
        "memory-game";


    const instruction =
        document.createElement("p");

    instruction.className =
        "memory-instruction";

    instruction.textContent =
        "Find all matching number pairs. Fewer mistakes = higher score.";


    const grid =
        document.createElement("div");

    grid.className =
        "memory-grid";


    wrapper.appendChild(
        instruction
    );

    wrapper.appendChild(
        grid
    );

    gameContainer.appendChild(
        wrapper
    );


    const numbers = [
        1, 1,
        2, 2,
        3, 3,
        4, 4,
        5, 5,
        6, 6,
        7, 7,
        8, 8
    ];


    shuffleArray(numbers);


    let firstCard = null;

    let secondCard = null;

    let lockBoard = false;

    let matchedPairs = 0;

    let mistakes = 0;


    numbers.forEach(
        function (number) {

            const card =
                document.createElement("button");

            card.type = "button";

            card.className =
                "memory-card";

            card.dataset.number =
                number;

            card.textContent =
                number;

            card.setAttribute(
                "aria-label",
                "Hidden memory card"
            );


            card.addEventListener(
                "click",
                function () {

                    if (
                        lockBoard ||
                        card.classList.contains("matched") ||
                        card === firstCard
                    ) {

                        return;

                    }


                    card.classList.add(
                        "flipped"
                    );


                    if (!firstCard) {

                        firstCard = card;

                        return;

                    }


                    secondCard = card;

                    lockBoard = true;


                    if (
                        firstCard.dataset.number ===
                        secondCard.dataset.number
                    ) {

                        firstCard.classList.add(
                            "matched"
                        );

                        secondCard.classList.add(
                            "matched"
                        );


                        matchedPairs++;

                        addScore(10);


                        gameMessage.textContent =
                            "✓ Great! You found a matching pair.";


                        resetMemoryTurn();


                        if (
                            matchedPairs === 8
                        ) {

                            setTimeout(
                                function () {

                                    gameMessage.textContent =
                                        "🎉 All pairs matched! Click Finish Game.";

                                },
                                300
                            );

                        }

                    }

                    else {

                        mistakes++;

                        gameMessage.textContent =
                            "Try again — remember the numbers!";


                        setTimeout(
                            function () {

                                firstCard.classList.remove(
                                    "flipped"
                                );

                                secondCard.classList.remove(
                                    "flipped"
                                );

                                resetMemoryTurn();

                            },
                            700
                        );

                    }

                }
            );


            grid.appendChild(
                card
            );

        }
    );


    function resetMemoryTurn() {

        firstCard = null;

        secondCard = null;

        lockBoard = false;

    }

}


/* =========================================================
   GAME 2 - PATTERN MEMORY
   ========================================================= */

function createPatternGame() {

    gameContainer.innerHTML = "";


    const wrapper =
        document.createElement("div");

    wrapper.className =
        "pattern-game";


    const status =
        document.createElement("p");

    status.className =
        "pattern-status";

    status.textContent =
        "Get ready...";


    const grid =
        document.createElement("div");

    grid.className =
        "pattern-grid";


    wrapper.appendChild(
        status
    );

    wrapper.appendChild(
        grid
    );

    gameContainer.appendChild(
        wrapper
    );


    const tiles = [];


    for (
        let i = 0;
        i < 9;
        i++
    ) {

        const tile =
            document.createElement("button");

        tile.type = "button";

        tile.className =
            "pattern-tile";

        tile.dataset.index =
            i;


        tile.addEventListener(
            "click",
            function () {

                handlePatternClick(
                    i
                );

            }
        );


        grid.appendChild(
            tile
        );

        tiles.push(
            tile
        );

    }


    let sequence = [];

    let userSequence = [];

    let acceptingInput = false;

    let level = 1;


    startPatternRound();


    function startPatternRound() {

        acceptingInput = false;

        userSequence = [];

        status.textContent =
            "Watch carefully...";


        sequence =
            generateSequence(
                level + 2
            );


        playSequence();

    }


    function playSequence() {

        let index = 0;


        function showNext() {

            if (
                index >=
                sequence.length
            ) {

                acceptingInput = true;

                status.textContent =
                    "Now repeat the pattern!";

                return;

            }


            const tileIndex =
                sequence[index];


            tiles[tileIndex].classList.add(
                "active"
            );


            setTimeout(
                function () {

                    tiles[tileIndex].classList.remove(
                        "active"
                    );

                    index++;

                    setTimeout(
                        showNext,
                        180
                    );

                },
                500
            );

        }


        setTimeout(
            showNext,
            500
        );

    }


    function handlePatternClick(
        index
    ) {

        if (!acceptingInput) {

            return;

        }


        const expected =
            sequence[
                userSequence.length
            ];


        if (index === expected) {

            userSequence.push(
                index
            );


            tiles[index].classList.add(
                "correct"
            );


            setTimeout(
                function () {

                    tiles[index].classList.remove(
                        "correct"
                    );

                },
                180
            );


            if (
                userSequence.length ===
                sequence.length
            ) {

                acceptingInput = false;

                addScore(
                    level * 15
                );


                status.textContent =
                    "✓ Correct! Next level...";


                level++;


                if (level > 4) {

                    status.textContent =
                        "🎉 Excellent! You completed all levels.";

                    gameMessage.textContent =
                        "Pattern completed successfully! Click Finish Game.";

                    return;

                }


                setTimeout(
                    startPatternRound,
                    900
                );

            }

        }

        else {

            acceptingInput = false;

            tiles[index].classList.add(
                "wrong"
            );


            status.textContent =
                "❌ Wrong order. Try the pattern again.";


            setTimeout(
                function () {

                    tiles[index].classList.remove(
                        "wrong"
                    );

                },
                400
            );


            gameMessage.textContent =
                "Pattern mistake. You can restart or finish the game.";

        }

    }


    function generateSequence(
        length
    ) {

        const result = [];

        while (
            result.length <
            length
        ) {

            const random =
                Math.floor(
                    Math.random() * 9
                );


            if (
                !result.includes(random)
            ) {

                result.push(
                    random
                );

            }

        }

        return result;

    }

}


/* =========================================================
   GAME 3 - CAR MATCH
   ========================================================= */

function createCarGame() {

    gameContainer.innerHTML = "";


    const wrapper =
        document.createElement("div");

    wrapper.className =
        "car-game";


    const instruction =
        document.createElement("p");

    instruction.className =
        "car-instruction";

    instruction.textContent =
        "Flip two cards at a time and match the same cars.";


    const grid =
        document.createElement("div");

    grid.className =
        "car-grid";


    wrapper.appendChild(
        instruction
    );

    wrapper.appendChild(
        grid
    );

    gameContainer.appendChild(
        wrapper
    );


    const cars = [

        {
            emoji: "🚗",
            name: "Car"
        },

        {
            emoji: "🚕",
            name: "Taxi"
        },

        {
            emoji: "🚙",
            name: "SUV"
        },

        {
            emoji: "🏎️",
            name: "Race"
        },

        {
            emoji: "🚓",
            name: "Police"
        },

        {
            emoji: "🚑",
            name: "Ambulance"
        }

    ];


    const cards =
        cars.concat(cars);


    shuffleArray(cards);


    let firstCard = null;

    let secondCard = null;

    let lockBoard = false;

    let matched = 0;


    cards.forEach(
        function (car) {

            const card =
                document.createElement("button");

            card.type = "button";

            card.className =
                "car-card";


            card.innerHTML =
                `
                <span class="car-hidden">?</span>
                `;


            card.dataset.name =
                car.name;


            card.addEventListener(
                "click",
                function () {

                    if (
                        lockBoard ||
                        card.classList.contains(
                            "matched"
                        ) ||
                        card === firstCard
                    ) {

                        return;

                    }


                    revealCar(
                        card,
                        car
                    );


                    if (!firstCard) {

                        firstCard = card;

                        return;

                    }


                    secondCard = card;

                    lockBoard = true;


                    if (
                        firstCard.dataset.name ===
                        secondCard.dataset.name
                    ) {

                        firstCard.classList.add(
                            "matched"
                        );

                        secondCard.classList.add(
                            "matched"
                        );


                        matched++;

                        addScore(15);


                        gameMessage.textContent =
                            "✓ Nice match!";


                        firstCard = null;

                        secondCard = null;

                        lockBoard = false;


                        if (
                            matched === cars.length
                        ) {

                            gameMessage.textContent =
                                "🎉 All cars matched! Click Finish Game.";

                        }

                    }

                    else {

                        gameMessage.textContent =
                            "Not a match. Remember the cards.";


                        setTimeout(
                            function () {

                                hideCar(
                                    firstCard
                                );

                                hideCar(
                                    secondCard
                                );


                                firstCard = null;

                                secondCard = null;

                                lockBoard = false;

                            },
                            800
                        );

                    }

                }
            );


            grid.appendChild(
                card
            );

        }
    );


    function revealCar(
        card,
        car
    ) {

        card.classList.add(
            "flipped"
        );


        card.innerHTML =
            `
            <span class="car-emoji">
                ${car.emoji}
            </span>

            <span class="car-name">
                ${car.name}
            </span>
            `;

    }


    function hideCar(
        card
    ) {

        if (!card) {

            return;

        }


        card.classList.remove(
            "flipped"
        );


        card.innerHTML =
            `
            <span class="car-hidden">
                ?
            </span>
            `;

    }

}


/* =========================================================
   SHUFFLE
   ========================================================= */

function shuffleArray(
    array
) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );


        [
            array[i],
            array[j]
        ] = [
            array[j],
            array[i]
        ];

    }

}