import fetch from 'node-fetch'
import yts from 'yt-search'

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`*Contoh:* ${usedPrefix + command} Alan Walker - Faded`);

  await conn.sendMessage(m.chat, { react: { text: '⬇️', key: m.key }});

  try {
    let url = text;

    // Cek apakah input bukan URL, lakukan pencarian
    if (!/^https?:\/\//.test(text)) {
      let search = await yts(text);
      if (!search?.videos?.length) throw '❌ Video tidak ditemukan.';
      url = search.videos[0].url;
    }

    const api = `https://api.ubed.my.id/download/ytvid?apikey=ubed2407&url=${encodeURIComponent(url)}`;
    const res = await fetch(api);
    if (!res.ok) throw '❌ Gagal mengunduh video.';

    const buffer = await res.buffer();

    await conn.sendFile(m.chat, buffer, 'video.mp4', '📀 Berhasil mengunduh video dari YouTube by ubed.', m, false, {
      buttons: [
        { buttonId: `.ytmp3 ${url}`, buttonText: { displayText: '🎵 Unduh Music' }, type: 1 }
      ],
      headerType: 4
    });

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key }});
  } catch (err) {
    console.error(err);
    m.reply(typeof err === 'string' ? err : '❌ Terjadi kesalahan saat mengambil video.');
  }
}

handler.command = ['ytmp4'];
handler.help = ['ytmp4 <url|judul>'];
handler.tags = ['downloader'];
handler.limit = true;

export default handler;