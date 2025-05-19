import fetch from 'node-fetch';

const handler = async (m, { conn, args }) => {
  if (!args.length) return conn.reply(m.chat, 'Silakan masukkan URL video YouTube.', m);

  const url = args[0];
  await conn.reply(m.chat, '🔍 Mencari audio...', m);

  if (!/^https?:\/\/(www\.)?(youtube\.com|youtu\.?be)\//.test(url)) {
    return conn.reply(m.chat, '❌ URL tidak valid.', m);
  }

  try {
    const apiUrl = `https://fastrestapis.fasturl.cloud/downup/ytmp3?url=${encodeURIComponent(url)}`;
    const response = await fetch(apiUrl);
    const result = await response.json();

    if (result.status !== 200) return conn.reply(m.chat, '⚠️ Gagal mendapatkan informasi audio.', m);

    const { title, author, quality, media, metadata } = result.result;

    // Mengirim info & thumbnail dalam 1 pesan
    await conn.sendMessage(m.chat, {
      text: `🎵 *Judul:* ${title}\n✍️ *Pengunggah:* ${author.name}\n⏰ *Durasi:* ${metadata.duration}\n🎧 *Kualitas:* ${quality}`,
      contextInfo: {
        externalAdReply: {
          title: title,
          body: `🎶 Download MP3 dari YouTube`,
          thumbnailUrl: metadata.thumbnail,
          sourceUrl: url,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

    // Unduh dan kirim audio
    const audioBuffer = await (await fetch(media)).arrayBuffer();
    await conn.sendMessage(m.chat, {
      audio: Buffer.from(audioBuffer),
      mimetype: 'audio/mpeg',
      fileName: `${title}.mp3`
    }, { quoted: m });

  } catch (err) {
    console.error(err);
    await conn.reply(m.chat, '🚩 Terjadi kesalahan.', m);
  }
};

handler.command = ['mp3'];
handler.tags = ['downloader'];
handler.limit = true;
handler.premium = false;

export default handler;