import ytSearch from 'yt-search';
import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`*Contoh:* ${usedPrefix + command} Hati-Hati di Jalan`);

  try {
    // React saat mulai mencari video
    await conn.sendMessage(m.chat, { react: { text: '🎧', key: m.key }});

    // Cari video berdasarkan judul dengan yt-search
    const searchResults = await ytSearch(text);
    if (!searchResults?.videos || searchResults.videos.length === 0) throw '❌ Gagal menemukan video berdasarkan judul!';

    // Ambil video pertama dari hasil pencarian
    let video = searchResults.videos[0];
    let videoUrl = video.url;
    let videoTitle = video.title;
    let videoImage = video.thumbnail;

    // Proses unduhan video dari API
    let downloadApi = `https://beforelife.me/api/download/ytmp4?url=${encodeURIComponent(videoUrl)}&apikey=ubed2407`;
    let downloadRes = await fetch(downloadApi);

    if (!downloadRes.ok) throw '❌ Gagal mengunduh video.';

    let buffer = await downloadRes.buffer();
    await conn.sendFile(m.chat, buffer, 'video.mp4', `🎧 Berhasil mengunduh video spotify: ${videoTitle}`, m);
  } catch (err) {
    console.error(err);
    m.reply(typeof err === 'string' ? err : '❌ Terjadi kesalahan saat mencari atau mengunduh video.');
  }
};

handler.command = ['mp4'];
handler.help = ['mp4 <judul>'];
handler.tags = ['downloader'];
handler.limit = true;

export default handler;