let prompt = document.querySelector("#prompt");
let submitbtn = document.querySelector("#submit");
let chatContainer = document.querySelector(".chat-container");

let user = {
    message: null,
    file: null // Single recent file to simulate automatic selection
};

// Simulating the most recent image selection (replace with real logic or API access)
function getRecentImage() {
    // Simulated file data (base64-encoded string)
    return {
        mime_type: "image/png",
        data: "iVBORw0KGgoAAAANSUhEUgAAAAUA"
    };
}

async function generateResponse(aiChatBox) {
    let text = aiChatBox.querySelector(".ai-chat-area");

    let parts = [{ text: user.message }];
    if (user.file) {
        parts.push({ inline_data: user.file });
    }

    try {
        let response = await fetch("API_URL", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "contents": [{ "parts": parts }]
            })
        });

        let data = await response.json();
        let apiResponse = data.candidates[0].content.parts[0].text || "Sorry, I couldn't process that.";
        text.innerHTML = apiResponse;
    } catch (error) {
        console.error("Error:", error);
    } finally {
        chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
        user.file = null; // Clear the file after submission
    }
}

function createChatBox(html, classes) {
    let div = document.createElement("div");
    div.innerHTML = html;
    div.classList.add(classes);
    return div;
}

function handleChatResponse(userMessage) {
    user.message = userMessage;
    user.file = getRecentImage(); // Automatically select the recent image

    let html = `<img src="user.png" alt="" width="8%">
<div class="user-chat-area">
    ${user.message}
    ${user.file ? `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" />` : ""}
</div>`;
    prompt.value = "";

    let userChatBox = createChatBox(html, "user-chat-box");
    chatContainer.appendChild(userChatBox);

    setTimeout(() => {
        let html = `<img src="ai.png" alt="" width="10%">
    <div class="ai-chat-area">
        <img src="loading.webp" alt="" width="50px">
    </div>`;
        let aiChatBox = createChatBox(html, "ai-chat-box");
        chatContainer.appendChild(aiChatBox);
        generateResponse(aiChatBox);
    }, 600);
}

submitbtn.addEventListener("click", () => {
    if (prompt.value.trim() !== "") {
        handleChatResponse(prompt.value);
    }
});
