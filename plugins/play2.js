import fetch from 'node-fetch';
import yts from 'yt-search';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`*Contoh:* ${usedPrefix + command} judul video`);

  try {
    await conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key }});

    // Cari video berdasarkan judul
    let search = await yts(text);
    let vid = search.videos[0];
    if (!vid) return m.reply('❌ Video tidak ditemukan.');

    let url = vid.url;

    // React saat mulai unduh
    await conn.sendMessage(m.chat, { react: { text: '⬇️', key: m.key }});

    let api = `https://beforelife.me/api/download/ytmp4?url=${encodeURIComponent(url)}&apikey=ubed2407`;
    let res = await fetch(api);

    if (!res.ok) throw '❌ Gagal mengunduh video.';

    let buffer = await res.buffer();
    await conn.sendFile(m.chat, buffer, 'video.mp4', `📀 Berhasil mengunduh:\n\n*Judul:* ${vid.title}\n*Durasi:* ${vid.timestamp}\n\nBy ubed.`, m);
  } catch (err) {
    console.error(err);
    m.reply(typeof err === 'string' ? err : '❌ Terjadi kesalahan saat mengambil video.');
  }
};

handler.command = ['play2'];
handler.help = ['play2 <judul>'];
handler.tags = ['downloader'];
handler.limit = true;

export default handler;