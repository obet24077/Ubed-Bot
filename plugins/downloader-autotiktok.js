import axios from 'axios';

let handler = async (m, { conn, text, args }) => {
  conn.autotiktok = conn.autotiktok || {};

  if (!text) throw `*• Contoh:* .autotiktok *[on/off]*`;

  if (text === "on") {
    conn.autotiktok[m.chat] = { user: m.sender, active: true };
    m.reply("[ ✓ ] Auto-download TikTok diaktifkan.");
  } else if (text === "off") {
    if (conn.autotiktok[m.chat]) {
      delete conn.autotiktok[m.chat];
      m.reply("[ ✓ ] Auto-download TikTok dinonaktifkan.");
    } else {
      m.reply("[ ✓ ] Tidak ada sesi Auto-download TikTok yang aktif.");
    }
  }
};

handler.before = async (m, { conn }) => {
  conn.autotiktok = conn.autotiktok || {};
  
  // Updated regex to match both full and short TikTok URLs
  const tiktokRegex = /https?:\/\/(www\.)?(tiktok\.com|vt\.tiktok\.com)\/[^\s]+/i;

  // Check if Auto-download TikTok is activated for this chat
  if (!conn.autotiktok[m.chat] || !conn.autotiktok[m.chat].active) return;

  // Check if the message contains a valid TikTok link
  if (!tiktokRegex.test(m.text)) return;

  await conn.sendMessage(m.chat, { react: { text: '⏱️', key: m.key } });

  try {
    const response = await axios.get(`https://widipe.com/download/ttdl?url=${encodeURIComponent(m.text)}`);
    const data = response.data;

    if (!data.status || data.code !== 200) {
      throw 'Gagal mendownload video!';
    }

    const { title, title_audio, thumbnail, video, audio } = data.result;
    const infonya_gan = `\`Judul Video:\` ${title}\n\`Judul Audio:\` ${title_audio}\n\`Creator:\` ${creator}`;

    if (video && video.length > 0) {
      await conn.sendFile(m.chat, video[0], 'tiktok.mp4', `\`Downloader TikTok\`\n\n${infonya_gan}`, m);
      if (audio && audio.length > 0) {
        setTimeout(async () => {
          await conn.sendFile(m.chat, audio[0], 'tiktok_audio.mp3', 'Ini lagunya', m);
        }, 5000);
      }
    } else {
      throw 'Tidak ada tautan video yang tersedia.';
    }
  } catch (error) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    m.reply(`Terjadi kesalahan: ${error}`);
  }
};

handler.command = ['autotiktok'];
handler.tags = ['downloader'];
handler.help = ['autotiktok *[on/off]*'];

export default handler;

const creator = '@PontaSens';