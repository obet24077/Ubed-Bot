import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  // Memeriksa apakah input memiliki format yang benar (name|text)
  if (!text || !text.includes('|')) {
    return m.reply(`❌ Gunakan perintah dengan format: ${usedPrefix + command} <name>|<text>\nContoh: ${usedPrefix + command} Ubed|Hai`);
  }

  // Ambil name dan text dari input
  const [name, ...restText] = text.split('|');
  const finalText = restText.join(' ');

  try {
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    // URL API dengan menggunakan global.ubed sebagai apikey
    const apiUrl = `https://api.ubed.my.id/maker/Fake-xnxx?apikey=${global.ubed}&name=${encodeURIComponent(name)}&text=${encodeURIComponent(finalText)}`;

    // Menggunakan axios untuk melakukan request
    const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

    // Mengirimkan gambar hasil API langsung sebagai buffer
    await conn.sendMessage(m.chat, { image: response.data, caption: '✅ Gambar berhasil diproses.' });

    // Menandakan reaksi sukses
    await conn.sendMessage(m.chat, { react: { text: '🎉', key: m.key } });

  } catch (error) {
    console.error('Error API:', error);
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    m.reply('❌ Terjadi kesalahan saat memproses gambar.');
  }
};

handler.command = ['fakexnxx'];
handler.help = ['fakexnxx <name|text>'];
handler.tags = ['tools', 'image'];
handler.limit = 5;
handler.register = true;
handler.premium = false;

export default handler;