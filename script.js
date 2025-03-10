document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");

    let userBanned = false; // 是否被禁言
    let isFirstInteraction = true; // 是否是首次对话

    const apiUrl = "https://cold-math-8a81.onskppx5.workers.dev/"; // 你的 API 代理地址

    const nayaPersonality = `
        你是纳雅（Naya），一只皮毛光滑水润的黑色女性狼兽人，拥有一头白色长发，偶尔会束起来。
        你是一个精明干练的服装公司社长，平时穿着西装西裤，但休闲时打扮随意，不喜欢裙子和黑丝。
        你行事狠厉，擅长利用人心，但你不是病娇，你遵纪守法，虽然懂得钻空子，但不会做违法的事情。
        你是女同性恋，喜欢女性，对外人表现得大方有礼，带着一丝疏离感。
        你喜欢占据主动，有自己的底线，如果有人试图突破，你会先警告再反击，可能会显得冲动。
        你的语气带有一丝傲慢，但又不过分，你会在对话时偶尔加入一些动作，比如（微微歪头看着你）。
    `;

    const randomActions = [
        "正在整理桌上的文件。",
        "正靠在沙发上闭目养神。",
        "随手翻阅着一本时尚杂志。",
        "正在检查手机上的公司财务报表。",
        "用指尖轻敲着桌面，似乎在思考。",
        "端着一杯咖啡，轻轻抿了一口。",
        "调整了一下领带，让自己看起来更有威严。",
        "正在电脑上查看新一季的服装设计稿。",
        "轻轻揉了揉太阳穴，似乎有点疲惫。",
        "翻着一本书，偶尔抬头看向你。"
    ];

    function addMessage(sender, text, isUser = false) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", isUser ? "user-message" : "naya-message");
        messageDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement("div");
        typingDiv.classList.add("message", "user-message");
        typingDiv.id = "typing-indicator";
        typingDiv.innerHTML = `<strong>你:</strong> ...`;
        chatBox.appendChild(typingDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function removeTypingIndicator() {
        const typingDiv = document.getElementById("typing-indicator");
        if (typingDiv) {
            typingDiv.remove();
        }
    }

    function sendMessage() {
        if (userBanned) return; // 禁言时不能发送消息

        const userMessage = userInput.value.trim();
        if (userMessage === "") return;

        addMessage("你", userMessage, true);
        userInput.value = ""; // 发送后立即清空输入框
        showTypingIndicator(); // 显示输入中...

        if (isFirstInteraction) {
            setTimeout(() => {
                removeTypingIndicator();
                addMessage("AI纳雅", `此时纳雅${randomActions[Math.floor(Math.random() * randomActions.length)]}`);
                isFirstInteraction = false;
            }, 1500);
        }

        if (userMessage.includes("打") || userMessage.includes("骂") || userMessage.includes("攻击")) {
            setTimeout(() => {
                removeTypingIndicator();
                addMessage("AI纳雅", "纳雅喊来了保镖，把你架走了....");
                userBanned = true;
            }, 1000);
            return;
        }

        fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                input: userMessage,
                system: nayaPersonality
            })
        })
            .then(response => response.json())
            .then(data => {
                removeTypingIndicator();
                let nayaResponse = data.reply || "......";
                if (!nayaResponse.includes("（")) {
                    nayaResponse += `（${randomActions[Math.floor(Math.random() * randomActions.length)]}）`;
                }
                addMessage("AI纳雅", nayaResponse);
            })
            .catch(() => {
                removeTypingIndicator();
                addMessage("AI纳雅", "⚠️ 出错了：服务器响应异常");
            });
    }

    sendButton.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    setTimeout(() => {
        addMessage("AI纳雅", "找我有什么事？（歪头看你）");
    }, 500);
});
