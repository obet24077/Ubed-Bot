import axios from 'axios';

let handler = async (m, { conn, usedPrefix, command, text, args }) => {
  if (!text && !args[0]) throw `Tolong kirimkan teks setelah perintah *${usedPrefix}${command}*`;

  try {
    let res;
    let buffer;
    let caption = '';

    // Menentukan API yang digunakan berdasarkan perintah
    if (command === 'meme5') {
      res = await axios.get(`https://api.lolhuman.xyz/api/meme5?apikey=ubed2407&text=${encodeURIComponent(text)}`, {
        responseType: 'arraybuffer',
      });
      buffer = res.data;
      caption = 'Meme5 kamu sudah jadi!';
    } else if (command === 'meme6') {
      if (!args[0] || !args[1] || !args[2]) throw 'Tolong kirimkan 3 teks untuk meme6!';
      res = await axios.get(`https://api.lolhuman.xyz/api/meme6?apikey=ubed2407&text1=${encodeURIComponent(args[0])}&text2=${encodeURIComponent(args[1])}&text3=${encodeURIComponent(args[2])}`, {
        responseType: 'arraybuffer',
      });
      buffer = res.data;
      caption = 'Meme6 kamu sudah jadi!';
    } else if (command === 'meme7') {
      if (!args[0] || !args[1]) throw 'Tolong kirimkan 2 teks untuk meme7!';
      res = await axios.get(`https://api.lolhuman.xyz/api/meme7?apikey=ubed2407&text1=${encodeURIComponent(args[0])}&text2=${encodeURIComponent(args[1])}`, {
        responseType: 'arraybuffer',
      });
      buffer = res.data;
      caption = 'Meme7 kamu sudah jadi!';
    }

    // Mengirim react emoji saat memproses
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    // Mengirim gambar meme
    await conn.sendMessage(m.chat, {
      image: buffer,
      caption: caption,
    }, { quoted: m });

    // Mengirim react emoji setelah selesai memproses
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (e) {
    console.error(e);
    conn.reply(m.chat, '❌ Gagal membuat meme.', m);
  }
};

handler.command = /^(meme5|meme6|meme7)$/i;
handler.help = ['meme5', 'meme6', 'meme7'];
handler.tags = ['fun', 'image'];
handler.limit = 3;
handler.register = true;

export default handler;