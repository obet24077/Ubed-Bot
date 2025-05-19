import fs from 'fs';
import axios from 'axios';
import crypto from 'crypto';

const SESSION_FILE_PATH = './src/blackboxsessions.json';
const SESSION_TIMEOUT = 60 * 60 * 1000;

// Jika file sesi tidak ada, buat file kosong
if (!fs.existsSync(SESSION_FILE_PATH)) {
  fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify({}, null, 2));
}

let userSessions = {};
try {
  userSessions = JSON.parse(fs.readFileSync(SESSION_FILE_PATH, 'utf8'));
} catch {
  userSessions = {};
}

let userTimeouts = {};

async function blackbox(query, userId) {
  const id = crypto.randomBytes(16).toString('hex');

  if (!Array.isArray(userSessions[userId])) {
    userSessions[userId] = [];
  }

  // Reset sesi jika sudah lewat batas waktu
  if (userSessions[userId].length > 0) {
    const lastMessageTime = new Date(userSessions[userId].slice(-1)[0].waktu);
    if (Date.now() - lastMessageTime.getTime() > SESSION_TIMEOUT) {
      userSessions[userId] = [];
    }
  }

  userSessions[userId].push({
    role: "user",
    content: query,
    id: id,
    waktu: new Date().toISOString()
  });

  const data = JSON.stringify({
    "messages": userSessions[userId],
    "agentMode": {},
    "id": id,
    "previewToken": null,
    "userId": null,
    "codeModelMode": true,
    "trendingAgentMode": {},
    "isMicMode": false,
    "userSystemPrompt": null,
    "maxTokens": 1024,
    "playgroundTopP": null,
    "playgroundTemperature": null,
    "isChromeExt": false,
    "githubToken": "",
    "clickedAnswer2": false,
    "clickedAnswer3": false,
    "clickedForceWebSearch": false,
    "visitFromDelta": false,
    "isMemoryEnabled": false,
    "mobileClient": false,
    "userSelectedModel": null,
    "validated": "00f37b34-a166-4efb-bce5-1312d87f2f94",
    "imageGenerationMode": false,
    "webSearchModePrompt": false,
    "deepSearchMode": false,
    "domains": null,
    "vscodeClient": false,
    "codeInterpreterMode": false,
    "customProfile": {
      "name": "",
      "occupation": "",
      "traits": [],
      "additionalInfo": "",
      "enableNewChats": false
    },
    "session": null,
    "isPremium": false
  });

  const config = {
    method: 'POST',
    url: 'https://www.blackbox.ai/api/chat',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
      'Content-Type': 'application/json',
      'accept-language': 'id-ID',
      'referer': 'https://www.blackbox.ai/',
      'origin': 'https://www.blackbox.ai',
      'alt-used': 'www.blackbox.ai',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'priority': 'u=0',
      'te': 'trailers'
    },
    data: data
  };

  try {
    const response = await axios.request(config);
    if (!response.data) throw 'Gagal mendapatkan respons dari Blackbox AI.';

    let aiResponse = response.data.trim();

    userSessions[userId].push({
      role: "assistant",
      content: aiResponse,
      waktu: new Date().toISOString()
    });

    // Simpan sesi ke file
    fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify(userSessions, null, 2));

    // Set timeout untuk menghapus sesi setelah batas waktu
    if (userTimeouts[userId]) clearTimeout(userTimeouts[userId]);
    userTimeouts[userId] = setTimeout(() => {
      delete userSessions[userId];
      delete userTimeouts[userId];
      fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify(userSessions, null, 2));
    }, SESSION_TIMEOUT);

    return aiResponse;
  } catch (error) {
    console.error(error);
    return 'Terjadi kesalahan saat memproses permintaan. Silakan coba lagi nanti.';
  }
}

let handlerPonta = async (m, { text, usedPrefix, command }) => {
  const userId = m.sender;

  if (!text) throw `Gunakan format:\n${usedPrefix + command} <pertanyaan>`;

  conn.sendMessage(m.chat, { react: { text: '🔥', key: m.key } });

  let response = await blackbox(text, userId);

  conn.sendMessage(m.chat, { text: response }, { quoted: m });

  await conn.sendMessage(m.chat, { react: { text: null, key: m.key } });
};

handlerPonta.help = ['blackbox'];
handlerPonta.tags = ['ai'];
handlerPonta.command = /^(blackbox)$/i;
handlerPonta.limit = 3;
handlerPonta.register = true;

export default handlerPonta;