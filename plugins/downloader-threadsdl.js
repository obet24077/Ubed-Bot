import fetch from 'node-fetch';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    throw `Masukkan URL!\n\ncontoh:\n${usedPrefix + command} https://www.threads.net/@cicididnteat/post/CytDET4R8S2/?igshid=NTc4MTIwNjQ2YQ==`;
  }
  if (!args[0].match(/threads/gi)) {
    throw `URL Tidak Ditemukan!`;
  }
  await m.reply(wait);
  try {
    const api = await fetch(`https://api.botcahx.eu.org/api/download/threads?url=${args[0]}&apikey=${btc}`).then(results => results.json());
    const foto = api.result.image_urls[0] || null;
    const video = api.result.video_urls[0] || null;
    if (video) {
      try { 
        await conn.sendFile(m.chat, video.download_url, 'threads.mp4', '*THREADS DOWNLOADER*', m);
      } catch (e) {
        throw `Media video tidak ditemukan!`;
      }
    } else if (foto) {
      try {
        await conn.sendFile(m.chat, foto, 'threads.jpeg', '*THREADS DOWNLOADER*', m);
      } catch (e) {
        throw `Media foto tidak ditemukan!`;
      }
    } else {
      throw `Konten tidak ditemukan!`;
    }
  } catch (e) {
    console.log(e);
    throw `✖️ *Server down*`;
  }
};

handler.command = handler.help = ['threadsdl'];
handler.tags = ['downloader', 'premium'];
handler.limit = false;
handler.group = false;
handler.premium = true;

export default handler;