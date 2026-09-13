/* ============================================================
   MINDCARE AI - AI CHAT JAVASCRIPT
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

    const chatForm = document.getElementById("chatForm");
    const messageInput = document.getElementById("messageInput");
    const chatMessages = document.getElementById("chatMessages");
    const sendButton = document.getElementById("sendButton");
    const typingIndicator = document.getElementById("typingIndicator");


    /* ========================================================
       ADD MESSAGE
       ======================================================== */

    function addMessage(message, type) {

        const messageWrapper = document.createElement("div");

        messageWrapper.classList.add(
            "message",
            type === "user"
                ? "user-message"
                : "ai-message"
        );


        const avatar = document.createElement("div");

        avatar.classList.add("message-avatar");


        if (type === "user") {

            avatar.classList.add("user-avatar");

            avatar.textContent = "U";

        } else {

            avatar.textContent = "🤖";

        }


        const content = document.createElement("div");

        content.classList.add("message-content");


        const bubble = document.createElement("div");

        bubble.classList.add("message-bubble");

        bubble.textContent = message;


        content.appendChild(bubble);


        if (type === "user") {

            messageWrapper.appendChild(content);
            messageWrapper.appendChild(avatar);

        } else {

            messageWrapper.appendChild(avatar);
            messageWrapper.appendChild(content);

        }


        chatMessages.appendChild(messageWrapper);


        chatMessages.scrollTop =
            chatMessages.scrollHeight;

    }


    /* ========================================================
       FORM SUBMIT
       ======================================================== */

    chatForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        const message =
            messageInput.value.trim();


        if (!message) {
            return;
        }


        /* USER MESSAGE */

        addMessage(message, "user");


        messageInput.value = "";


        /* DISABLE INPUT */

        messageInput.disabled = true;
        sendButton.disabled = true;


        /* SHOW TYPING */

        typingIndicator.classList.add("active");


        try {

            /*
             * IMPORTANT:
             * Flask backend AI route is /send-ai-chat
             */

            const response = await fetch(
                "/send-ai-chat",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        message: message
                    })
                }
            );


            const data = await response.json();


            typingIndicator.classList.remove("active");


            if (data.success) {

                addMessage(
                    data.response,
                    "ai"
                );

            } else {

                addMessage(
                    data.error ||
                    data.message ||
                    "Sorry, something went wrong. Please try again.",
                    "ai"
                );

            }


        } catch (error) {

            console.error(
                "AI Chat Error:",
                error
            );


            typingIndicator.classList.remove("active");


            addMessage(
                "⚠️ Unable to connect to MindCare AI right now. Please check your server and API configuration.",
                "ai"
            );

        }


        /* ENABLE INPUT */

        messageInput.disabled = false;
        sendButton.disabled = false;

        messageInput.focus();

    });


    /* ========================================================
       ENTER KEY
       ======================================================== */

    messageInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                chatForm.requestSubmit();

            }

        }
    );


    /* ========================================================
       AUTO RESIZE TEXTAREA
       ======================================================== */

    messageInput.addEventListener(
        "input",
        function () {

            this.style.height = "auto";

            this.style.height =
                Math.min(
                    this.scrollHeight,
                    120
                ) + "px";

        }
    );


    /* ========================================================
       INITIAL SCROLL
       ======================================================== */

    chatMessages.scrollTop =
        chatMessages.scrollHeight;

});