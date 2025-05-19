import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';

const SESSION_FILE_PATH = './src/deepseeksessions.json';
const SESSION_TIMEOUT = 60 * 60 * 1000;

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

const ponta = async (m, { text, usedPrefix, command }) => {

  if (!text) throw `Gunakan format: <pertanyaan>`;
  
  const userId = m.sender;

  if (!Array.isArray(userSessions[userId])) {
    userSessions[userId] = [
      { 
        role: "system", 
        content: "Nama kamu DeepSeek, dikembangkan oleh Ponta Sensei. Kamu adalah asisten cerdas yang memberikan jawaban akurat dan menarik." 
      }
    ];
  }

  userSessions[userId].push({ role: "user", content: text });

  try {
    await conn.sendMessage(m.chat, { react: { text: '🌏', key: m.key } });

    let formData = new FormData();
    formData.append("content", `User: ${text}`);
    formData.append("model", "@hf/thebloke/deepseek-coder-6.7b-instruct-awq");

    const config = {
      headers: {
        ...formData.getHeaders()
      }
    };

    const { data } = await axios.post("https://mind.hydrooo.web.id/v1/chat", formData, config);

    if (!data || !data.result) throw 'Gagal mendapatkan respons dari API.';

    const aiResponse = data.result.trim();

    userSessions[userId].push({ role: "assistant", content: aiResponse });

    fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify(userSessions, null, 2));

    if (userTimeouts[userId]) clearTimeout(userTimeouts[userId]);
    userTimeouts[userId] = setTimeout(() => {
      delete userSessions[userId];
      delete userTimeouts[userId];
      fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify(userSessions, null, 2));
    }, SESSION_TIMEOUT);

    await conn.sendMessage(m.chat, {
    document: fs.readFileSync("./thumbnail.jpg"),
    fileName: `- DeepSeek ChatAI -`,
    fileLength: '1',
    mimetype: 'application/msword',
    caption: aiResponse,
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
  
    await conn.sendMessage(m.chat, { react: { text: null, key: m.key } });

  } catch (error) {
    console.error(error);
    conn.sendMessage(m.chat, { text: 'Terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi nanti.' }, { quoted: m });
        await conn.sendMessage(m.chat, { react: { text: null, key: m.key } });
  }
};

ponta.help = ['deepseek'];
ponta.tags = ['ai'];
ponta.command = /^(deepseek)$/i;
ponta.limit = 3;
ponta.register = true;

export default ponta;