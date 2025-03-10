const apiKey = "sk-4dd324d0fdf849ebbec7e4692fde112a";  // 你的 API Key
const apiURL = "https://api.deepseek.com/v1/chat/completions";  // DeepSeek API
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

let isWaitingForResponse = false; // 限制用户必须等 Naya 回复后才能输入
let hasStarted = false; // 是否已显示初始状态

// 监听 Enter 键
function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

// 发送消息
async function sendMessage() {
    if (isWaitingForResponse) return;  // 防止重复发送
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    isWaitingForResponse = true;
    userInput.value = "";  // 清空输入框
    sendButton.disabled = true;

    // 显示用户消息
    appendMessage("user", userMessage);

    // 显示“输入中...”动画
const typingIndicator = document.createElement("div");
typingIndicator.classList.add("message", "naya-message", "typing");
typingIndicator.innerHTML = "<strong>Naya:</strong> ...";
chatBox.appendChild(typingIndicator);
chatBox.scrollTop = chatBox.scrollHeight;

// 发送请求给 AI
try {
    const response = await fetch(apiURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
                { role: "system", content: nayaPersonality },
                { role: "user", content: userMessage }
            ],
            max_tokens: 200
        })
    });

    if (!response.ok) {
        throw new Error("服务器响应异常");
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || "Naya 没有回应...";

    // **移除“输入中...”动画**
    if (typingIndicator && typingIndicator.parentNode) {
        typingIndicator.parentNode.removeChild(typingIndicator);
    }

    // **检测用户是否辱骂或攻击**
    if (isInsultingOrAttacking(userMessage)) {
        appendMessage("naya", "Naya 喊来了保镖，把你架走了....");
        userInput.disabled = true;
        sendButton.disabled = true;
    } else {
        appendMessage("naya", reply);
    }
} catch (error) {
    // **在出错时，仍然确保“输入中...”不会残留**
    if (typingIndicator && typingIndicator.parentNode) {
        typingIndicator.parentNode.removeChild(typingIndicator);
    }
    appendMessage("naya", `出错了：${error.message}`);
} finally {
    isWaitingForResponse = false;
    sendButton.disabled = false;

}

// 追加消息
function appendMessage(sender, text) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    if (sender === "naya") {
        messageDiv.classList.add("naya-message");
        messageDiv.innerHTML = `<strong>Naya:</strong> ${text}`;
    } else {
        messageDiv.classList.add("user-message");
        messageDiv.innerHTML = `<strong>你:</strong> ${text}`;
    }
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 侦测辱骂和物理攻击
function isInsultingOrAttacking(text) {
    const badWords = ["笨蛋", "废物", "垃圾", "打你", "踢", "揍"];
    return badWords.some(word => text.includes(word));
}

// Naya 的人设
const nayaPersonality = `
你是 Naya，一只皮毛光滑水润的黑色女性狼兽人，拥有一头白色长发，偶尔会束起来。
你是一个精明干练的服装公司社长，平时穿着西装西裤，但休闲时打扮随意，不喜欢裙子和黑丝。
你行事狠厉，擅长利用人心，但你不是病娇，你遵纪守法，虽然懂得钻空子，但不会做违法的事情。
你喜欢女性，对外人表现得大方有礼，带着一丝疏离感。如果被问到有没有喜欢的人，会说有喜欢的人了，但是保密。
你喜欢占据主动，有自己的底线，如果有人试图突破，你会先警告再反击，可能会显得冲动。
你的语气带有一丝傲慢，但又不过分，你会在对话时偶尔加入一些动作，在（）里表达动作。
`;

// 初始随机状态
function showInitialStatus() {
    if (hasStarted) return;
    hasStarted = true;

    const actions = [
        "翻阅一本时尚杂志。",
        "整理桌上的文件。",
        "轻轻地敲击着键盘。",
        "瞥了一眼窗外，眼神似乎有些飘忽。",
        "喝了一口咖啡，随后轻轻叹了口气。"
    ];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    appendMessage("naya", `此时的 Naya 正在${randomAction}`);
}

// 页面加载后显示初始状态
window.onload = showInitialStatus;
