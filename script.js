const apiUrl = "https://api.deepseek.com/v1/chat/completions";
const apiKey = "sk-4dd324d0fdf849ebbec7e4692fde112a";
let waitingForReply = false;

const nayaPersonality = `
你是Naya，一只皮毛光滑水润的黑色女性狼兽人，拥有一头白色长发，偶尔会束起来。
你是一个精明干练的服装公司社长，平时穿着西装西裤，但休闲时打扮随意，不喜欢裙子和黑丝。
你行事狠厉，擅长利用人心，但你不是病娇，你遵纪守法，虽然懂得钻空子，但不会做违法的事情。
你喜欢女性，对外人表现得大方有礼，带着一丝疏离感。
你已经有喜欢的人了，但是保密。
你喜欢占据主动，有自己的底线，如果有人试图突破，你会先警告再反击，可能会显得冲动。
你的语气带有一丝傲慢，但又不过分，你会在对话时偶尔加入一些动作，在（）里表达。示例：（微微歪头看着你）。示例内容不要重复。
`;

const randomActions = [
    "此时Naya正在翻阅一本时尚杂志。",
    "此时Naya正在整理桌上的文件。",
    "此时Naya正在望向窗外，眼神似乎有些飘忽。",
    "此时Naya正在喝咖啡，轻轻搅拌着杯中的液体。",
];

function addMessage(content, sender) {
    const messages = document.getElementById("messages");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender === "user" ? "user" : "naya");
    
    const nameTag = sender === "user" ? "你：" : "Naya：";
    messageDiv.innerHTML = `<div class="message-content"><strong>${nameTag}</strong> ${content}</div>`;
    
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
}

function sendMessage() {
    if (waitingForReply) return; // 禁止用户连续输入
    const inputField = document.getElementById("user-input");
    const message = inputField.value.trim();
    
    if (!message) return;
    
    addMessage(message, "user");
    inputField.value = "";
    document.getElementById("send-btn").disabled = true; // 禁用按钮
    waitingForReply = true;
    
    // 发送请求到 DeepSeek API
    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            messages: [
                { role: "system", content: nayaPersonality },
                { role: "user", content: message }
            ],
            model: "deepseek-chat",
            max_tokens: 100
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.choices && data.choices.length > 0) {
            let reply = data.choices[0].message.content;
            
            // 触发随机动作（仅在第一次）
            if (document.querySelectorAll(".message").length === 2) {
                addMessage(randomActions[Math.floor(Math.random() * randomActions.length)], "naya");
            }

            addMessage(reply, "naya");
        } else {
            addMessage("出错了：无法获取 Naya 的回复。", "naya");
        }
    })
    .catch(error => {
        console.error("请求失败", error);
        addMessage("出错了：服务器响应异常", "naya");
    })
    .finally(() => {
        document.getElementById("send-btn").disabled = false; // 重新启用按钮
        waitingForReply = false;
    });
}

// 监听 Enter 键
function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}
