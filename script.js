const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

const API_KEY = "sk-4dd324d0fdf849ebbec7e4692fde112a";
const API_URL = "https://api.deepseek.com/v1/chat/completions";

// Naya 人设
const nayaPersonality = `
你是 Naya，一只皮毛光滑水润的黑色女性狼兽人，拥有一头白色长发，偶尔会束起来。
你是一个精明干练的服装公司社长，平时穿着西装西裤，但休闲时打扮随意，不喜欢裙子和黑丝。
你行事狠厉，擅长利用人心，但你不是病娇，你遵纪守法，虽然懂得钻空子，但不会做违法的事情。
你喜欢女性，对外人表现得大方有礼，带着一丝疏离感。
你喜欢占据主动，有自己的底线，如果有人试图突破，你会先警告再反击，可能会显得冲动。
你的语气带有一丝傲慢，但又不过分，你会在对话时偶尔加入一些动作，比如（微微歪头看着你）。
`;

// 统计 Token 使用
let usedTokens = 0;
const TOKEN_LIMIT = 5000;
const RESET_INTERVAL = 60 * 60 * 1000; // 1小时

setInterval(() => {
    usedTokens = 0;
}, RESET_INTERVAL);

// 随机 Naya 进行的事情
const nayaActions = [
    "整理桌上的文件。",
    "翻阅一本时尚杂志。",
    "检查公司的财务报表。",
    "用笔在纸上写字。",
    "喝了一口咖啡。",
];

// 生成 "此时 Naya 正在..."
document.getElementById("naya-action").innerHTML = `<strong>Naya:</strong> 此时 Naya 正在${nayaActions[Math.floor(Math.random() * nayaActions.length)]}`;

// 发送消息
sendButton.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") sendMessage();
});

function sendMessage() {
    if (!userInput.value.trim()) return;
    if (usedTokens >= TOKEN_LIMIT) {
        alert("你的 Token 额度已用完，请稍后再试！");
        return;
    }

    // 用户消息
    const userMessage = document.createElement("div");
    userMessage.classList.add("message", "user-message");
    userMessage.innerHTML = `<strong>你:</strong> ${userInput.value}`;
    chatBox.appendChild(userMessage);
    chatBox.scrollTop = chatBox.scrollHeight;

    const userText = userInput.value.trim();
    userInput.value = "";
    sendButton.disabled = true;

    // 显示 "Naya 正在输入..."
    const typingIndicator = document.createElement("div");
    typingIndicator.classList.add("message", "naya-message");
    typingIndicator.innerHTML = `<strong>Naya:</strong> ...`;
    chatBox.appendChild(typingIndicator);
    chatBox.scrollTop = chatBox.scrollHeight;

    fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
            model: "deepseek-chat",
            messages: [{ role: "system", content: nayaPersonality }, { role: "user", content: userText }],
            max_tokens: 100,
        }),
    })
        .then(response => response.json())
        .then(data => {
            usedTokens += data.usage.total_tokens;
            chatBox.removeChild(typingIndicator);
            const aiMessage = document.createElement("div");
            aiMessage.classList.add("message", "naya-message");
            aiMessage.innerHTML = `<strong>Naya:</strong> ${data.choices[0].message.content}`;
            chatBox.appendChild(aiMessage);
            chatBox.scrollTop = chatBox.scrollHeight;
        })
        .catch(() => {
            chatBox.removeChild(typingIndicator);
            const errorMessage = document.createElement("div");
            errorMessage.classList.add("message", "naya-message");
            errorMessage.innerHTML = `<strong>Naya:</strong> 出错了：服务器响应异常`;
            chatBox.appendChild(errorMessage);
        })
        .finally(() => {
            sendButton.disabled = false;
        });
}
