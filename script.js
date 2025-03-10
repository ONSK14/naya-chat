document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");

    let canChat = true;  // 控制用户是否可以继续聊天
    let isFirstInteraction = true; // 控制是否是第一次对话

    // **向聊天窗口添加消息**
    function appendMessage(sender, text, isUser = false) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message");
        messageDiv.classList.add(isUser ? "user-message" : "naya-message");
        messageDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight; // 自动滚动到底部
    }

    // **禁用聊天输入**
    function disableChat() {
        canChat = false;
        userInput.disabled = true;
        sendButton.disabled = true;
    }

    // **用户发送消息**
    function sendMessage() {
        if (!canChat) return;  // 如果用户被禁言，不能发送消息

        const message = userInput.value.trim();
        if (!message) return;

        // **清空输入框**
        userInput.value = "";

        // **添加用户消息**
        appendMessage("你", message, true);

        // **显示“输入中...”**
        const typingMessage = document.createElement("div");
        typingMessage.classList.add("message", "naya-message");
        typingMessage.innerHTML = `<strong>AI纳雅:</strong> ...`;
        chatBox.appendChild(typingMessage);
        chatBox.scrollTop = chatBox.scrollHeight;

        // **检测是否触发“保镖”事件**
        if (message.includes("打") || message.includes("骂") || message.includes("滚")) {
            appendMessage("AI纳雅", "纳雅喊来了保镖，把你架走了...", false);
            disableChat(); // 禁用聊天
            return;
        }

        // **发送请求到 API**
        fetch("https://cold-math-8a81.onskppx5.workers.dev/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                input: message,
                character: "Naya"
            }),
        })
        .then(response => response.json())
        .then(data => {
            chatBox.removeChild(typingMessage); // 移除“输入中...”动画
            appendMessage("AI纳雅", data.reply); // 显示 AI 回复
        })
        .catch(error => {
            chatBox.removeChild(typingMessage);
            appendMessage("AI纳雅", "出错了：服务器响应异常", false);
        });
    }

    // **绑定回车键**
    userInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    sendButton.addEventListener("click", sendMessage);

    // **初始化对话**
    if (isFirstInteraction) {
        appendMessage("AI纳雅", "找我有什么事？（歪头看你）");
        setTimeout(() => {
            const randomActions = [
                "整理桌上的文件。",
                "端起咖啡轻抿了一口。",
                "打开笔记本查看今天的行程。",
                "微微皱眉，思考着公司的财务状况。",
                "懒洋洋地靠在椅背上，轻叹了一口气。"
            ];
            const action = randomActions[Math.floor(Math.random() * randomActions.length)];
            appendMessage("AI纳雅", `此时纳雅正在${action}`);
            isFirstInteraction = false;
        }, 1000);
    }
});
