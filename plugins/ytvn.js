import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`*Contoh:* ${usedPrefix + command} https://youtube.com/watch?v=jVmpzWwWU00`);

  try {
    // Kirim reaksi saat memulai
    await conn.sendMessage(m.chat, { react: { text: '🎙️', key: m.key } });

    const api = `https://beforelife.me/api/download/ytmp3?url=${encodeURIComponent(text)}&apikey=ubed2407`;
    const res = await fetch(api);

    if (!res.ok) throw '❌ Gagal mengambil audio dari YouTube.';

    const data = await res.json();

    if (!data.result || !data.result.url) throw '❌ Tidak dapat mengambil file audio.';

    const audioRes = await fetch(data.result.url);
    const audioBuffer = await audioRes.arrayBuffer();

    await conn.sendMessage(m.chat, {
      audio: Buffer.from(audioBuffer),
      mimetype: 'audio/mpeg',
      ptt: true, // Ini yang menjadikannya voice note
      fileName: 'vn.mp3',
      caption: `✅ Berhasil dikonversi jadi VN dari:\n${data.result.title}`,
    }, { quoted: m });

  } catch (err) {
    console.error(err);
    m.reply(typeof err === 'string' ? err : '❌ Terjadi kesalahan saat memproses audio.');
  }
};

handler.command = ['ytvn', 'ytvoice'];
handler.help = ['ytvn <url>', 'ytvoice <url>'];
handler.tags = ['downloader'];
handler.limit = true;

export default handler;