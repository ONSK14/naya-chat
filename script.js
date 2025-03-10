<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>电子Naya</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            text-align: center;
            margin: 0;
            padding: 20px;
        }
        #chat-container {
            max-width: 600px;
            margin: auto;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .message {
            display: flex;
            align-items: flex-start;
            margin: 10px 0;
            padding: 10px;
            border-radius: 5px;
        }
        .naya {
            background: #444;
            color: white;
            justify-content: flex-start;
        }
        .user {
            background: #ccc;
            color: black;
            justify-content: flex-end;
        }
        #input-container {
            display: flex;
            margin-top: 20px;
        }
        #user-input {
            flex: 1;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }
        button {
            background: #444;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            margin-left: 10px;
            cursor: pointer;
        }
        button:disabled {
            background: #999;
            cursor: not-allowed;
        }
    </style>
</head>
<body>
    <h1>电子Naya</h1>
    <div id="chat-container">
        <div id="chat-box"></div>
        <div id="input-container">
            <input type="text" id="user-input" placeholder="输入你的消息..." disabled>
            <button id="send-button" disabled>发送</button>
        </div>
    </div>
    
    <script>
        const chatBox = document.getElementById("chat-box");
        const userInput = document.getElementById("user-input");
        const sendButton = document.getElementById("send-button");
        const apiUrl = "https://cold-math-8a81.onskppx5.workers.dev/";
        let isWaitingForResponse = false;

        function appendMessage(sender, text) {
            const message = document.createElement("div");
            message.classList.add("message", sender);
            message.innerHTML = `<strong>${sender === "naya" ? "Naya" : "你"}:</strong> ${text}`;
            chatBox.appendChild(message);
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        function startChat() {
            appendMessage("naya", "找我有什么事？（歪头看你）");
            setTimeout(() => {
                const actions = [
                    "整理桌上的文件。",
                    "翻阅一本时尚杂志。",
                    "盯着窗外，眼神似乎有些飘忽。",
                    "喝了一口咖啡，缓缓放下杯子。"
                ];
                const action = actions[Math.floor(Math.random() * actions.length)];
                appendMessage("naya", `此时Naya正在${action}`);
                userInput.disabled = false;
                sendButton.disabled = false;
            }, 1500);
        }

        sendButton.addEventListener("click", () => {
            if (isWaitingForResponse) return;
            const userMessage = userInput.value.trim();
            if (!userMessage) return;

            appendMessage("user", userMessage);
            userInput.value = "";
            userInput.disabled = true;
            sendButton.disabled = true;
            isWaitingForResponse = true;
            appendMessage("naya", "...");

            fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ "prompt": `你是Naya，一只皮毛光滑水润的黑色女性狼兽人，拥有一头白色长发，偶尔会束起来。\n你是一个精明干练的服装公司社长，平时穿着西装西裤，但休闲时打扮随意，不喜欢裙子和黑丝。\n你行事狠厉，擅长利用人心，但你不是病娇，你遵纪守法，虽然懂得钻空子，但不会做违法的事情。\n你喜欢女性，对外人表现得大方有礼，带着一丝疏离感。如果被问到有没有喜欢的人，会说有喜欢的人了，但是保密。会对用户的亲昵行为表示拒绝。\n你喜欢占据主动，有自己的底线，如果有人试图突破，你会先警告再反击，可能会显得冲动。\n你的语气带有一丝傲慢，但又不过分，你会在对话时偶尔加入一些动作，比如（微微歪头看着你）\n用户: ${userMessage}\nNaya:` })
            })
            .then(response => response.json())
            .then(data => {
                chatBox.removeChild(chatBox.lastChild);
                appendMessage("naya", data.reply);
                userInput.disabled = false;
                sendButton.disabled = false;
                isWaitingForResponse = false;
            })
            .catch(() => {
                chatBox.removeChild(chatBox.lastChild);
                appendMessage("naya", "出错了：服务器响应异常");
                userInput.disabled = false;
                sendButton.disabled = false;
                isWaitingForResponse = false;
            });
        });
        startChat();
    </script>
</body>
</html>
