import axios from 'axios';

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    await conn.sendMessage(m.chat, { react: { text: '🦶', key: m.key } });

    const response = await axios.get('https://api.lolhuman.xyz/api/random/nsfw/feets?apikey=ubed2407', {
      responseType: 'arraybuffer'
    });

    const buffer = response.data;

    await conn.sendMessage(m.chat, {
      image: buffer,
      caption: '🔞 Nih kaki cantiknya~',
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (error) {
    console.error(error);
    await conn.reply(m.chat, '❌ Gagal mengambil gambar Feets.', m);
  }
};

handler.command = /^(feets)$/i;
handler.tags = ['nsfw'];
handler.help = ['feets'];
handler.limit = 3;
handler.premium = true;
handler.register = true;
handler.nsfw = true;

export default handler;