import fs from 'fs';
import axios from 'axios';

const SESSION_FILE_PATH = './src/geminisessions.json';
const SESSION_TIMEOUT = 60 * 60 * 1000;
const GEMINI_API_KEY = "AIzaSyCURDo-PO29UjszVzZ89-1Ly2XlTGtqZZQ";

if (!fs.existsSync(SESSION_FILE_PATH)) {
  fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify({}, null, 2));
}

let userSessions = {};
try {
  userSessions = JSON.parse(fs.readFileSync(SESSION_FILE_PATH, 'utf8'));
} catch (err) {
  console.error("Error membaca file sesi:", err);
  userSessions = {};
}

let userTimeouts = {};

let gemini = async (m, { text, usedPrefix, command }) => {
  const userId = m.sender;
  const now = new Date();

  if (!Array.isArray(userSessions[userId])) {
    userSessions[userId] = [];
  }

  if (userSessions[userId].length > 0) {
    const lastMessageTime = new Date(userSessions[userId].slice(-1)[0].waktu);
    if (now - lastMessageTime > SESSION_TIMEOUT) {
      userSessions[userId] = [];
    }
  }

  if (!text) throw `Gunakan format:\n${usedPrefix + command} <pertanyaan>`;

  userSessions[userId].push({
    role: "user",
    content: text,
    waktu: now.toISOString()
  });

  conn.sendMessage(m.chat, { react: { text: '☕', key: m.key } });

  try {
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
    const data = {
      contents: [{ parts: [{ text }] }]
    };

    console.log("Mengirim permintaan ke Gemini API:", data);

    const response = await axios.post(url, data);

    if (!response.data) {
      throw new Error('Respons API kosong atau tidak valid.');
    }

    console.log("Respons API:", response.data);

    let aiResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, saya tidak bisa menjawab.";
    let formattedMessage = aiResponse.replace(/\*\*/g, '*');
    
    userSessions[userId].push({
      role: "assistant",
      content: aiResponse,
      waktu: now.toISOString()
    });

    fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify(userSessions, null, 2));

    conn.sendMessage(m.chat, {
      text: formattedMessage,
      contextInfo: {
        forwardingScore: 99999999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363199602506586@newsletter',
          serverMessageId: null,
          newsletterName: `© ${global.namebot} || ${global.author}`
        }
      }
    }, { quoted: m });
    
    await conn.sendMessage(m.chat, { react: { text: '', key: m.key } });

  } catch (error) {
    console.error("Terjadi kesalahan saat memproses permintaan:", error.message);
    m.reply('Terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi nanti.');
  }
};

gemini.help = ['gemini'];
gemini.tags = ['ai'];
gemini.command = /^(gemini)$/i;
gemini.limit = 3;
gemini.register = true;

export default gemini;