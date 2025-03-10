const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

let isWaitingForResponse = false; // 限制用户发送消息的状态
let userBlocked = false; // 是否被Naya拉黑
let apiUrl = "https://api.deepseek.com/v1/chat/completions";
let apiKey = "sk-4dd324d0fdf849ebbec7e4692fde112a"; // 你的API KEY

// Naya 设定
const nayaPersonality = `
你是Naya，一只皮毛光滑水润的黑色女性狼兽人，拥有一头白色长发，偶尔会束起来。
你是一个精明干练的服装公司社长，平时穿着西装西裤，但休闲时打扮随意，不喜欢裙子和黑丝。
你行事狠厉，擅长利用人心，但你不是病娇，你遵纪守法，虽然懂得钻空子，但不会做违法的事情。
你喜欢女性，对外人表现得大方有礼，带着一丝疏离感。如果被问到有没有喜欢的人，会说有喜欢的人了，但是保密。会对用户的亲昵行为表示拒绝。
你喜欢占据主动，有自己的底线，如果有人试图突破，你会先警告再反击，可能会显得冲动。
你的语气带有一丝傲慢，但又不过分，你会在对话时偶尔加入一些动作，比如（微微歪头看着你）。
`;

const nayaActions = [
    "翻阅一本时尚杂志。",
    "整理桌上的文件。",
    "透过窗户看着远方，眼神若有所思。",
    "拿起咖啡杯轻轻抿了一口。",
    "正在修改公司的设计方案。",
];

// 初始消息
function initializeChat() {
    addMessage("Naya", "找我有什么事？（歪头看你）", true);
    setTimeout(() => {
        let randomAction = nayaActions[Math.floor(Math.random() * nayaActions.length)];
        addMessage("Naya", `此时Naya正在${randomAction}。`, true);
    }, 1000);
}

// 发送消息
async function sendMessage() {
    if (isWaitingForResponse || userBlocked) return;

    let userMessage = userInput.value.trim();
    if (userMessage === "") return;

    addMessage("你", userMessage, false);
    userInput.value = "";
    isWaitingForResponse = true;
    sendButton.disabled = true;

    addMessage("Naya", "……", true); // 显示“正在输入”

    try {
        let response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [{ role: "system", content: nayaPersonality }, { role: "user", content: userMessage }]
            })
        });

        if (!response.ok) throw new Error("服务器响应异常");

        let data = await response.json();
        let aiReply = data.choices[0].message.content.trim();

        if (detectAnger(userMessage)) {
            addMessage("Naya", "Naya喊来了保镖，把你架走了……", true);
            userBlocked = true;
        } else {
            addMessage("Naya", aiReply, true);
        }

    } catch (error) {
        addMessage("Naya", "出错了：服务器响应异常", true);
    }

    isWaitingForResponse = false;
    sendButton.disabled = false;
}

// 处理回车发送消息
function handleKeyPress(event) {
    if (event.key === "Enter") sendMessage();
}

// 添加消息
function addMessage(sender, text, isNaya) {
    let messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    if (isNaya) {
        messageDiv.classList.add("naya-message");
        messageDiv.innerHTML = `<span class="name">Naya：</span> ${text}`;
    } else {
        messageDiv.classList.add("user-message");
        messageDiv.innerHTML = `<span class="name">你：</span> ${text}`;
    }
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 侦测辱骂或攻击
function detectAnger(text) {
    const blacklist = ["笨蛋", "傻逼", "滚", "去死", "打你", "踹你", "揍你"];
    return blacklist.some(word => text.includes(word));
}

// 初始化聊天
initializeChat();
