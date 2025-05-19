import axios from 'axios';
import FormData from 'form-data';

const handler = async (m, { conn, args, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    if (!mime) throw `Kirim gambar dengan caption *${usedPrefix}${command}* atau reply gambar dengan *${usedPrefix}${command}*`;

    if (!/image\/(jpe?g|png)/.test(mime)) throw `File yang kamu kirim bukan gambar!`;

    const apiKey = 'ubed2407'; // Ganti dengan API key Maelyn jika berbeda

    await conn.sendMessage(m.chat, { react: { text: '🍏', key: m.key } });

    let imgUrl;
    try {
        const imgBuffer = await q.download();
        const formData = new FormData();
        formData.append('reqtype', 'fileupload');
        formData.append('fileToUpload', imgBuffer, 'image.jpg');

        const catboxResponse = await axios.post('https://catbox.moe/user/api.php', formData, {
            headers: formData.getHeaders(),
        });

        imgUrl = catboxResponse.data;
        if (!imgUrl?.includes('catbox.moe')) {
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return m.reply('Gagal mengunggah gambar ke Catbox.');
        }
    } catch (e) {
        console.error(e);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        return m.reply('Gagal memproses gambar.');
    }

    try {
        const apiUrl = `https://api.maelyn.tech/api/img2img/remini?url=${encodeURIComponent(imgUrl)}&apikey=${apiKey}`;
        const response = await axios.get(apiUrl);
        const { status, result } = response.data;

        if (status === 'Success' && result?.url) {
            await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
            await conn.sendMessage(m.chat, { image: { url: result.url }, caption: `✨ *Remini AI*\n\nUkuran: ${result.size}\nKadaluarsa: ${result.expired}\n\nPowered by Maelyn API` }, { quoted: m });
        } else {
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            m.reply(`❌ Gagal memproses gambar. Respon API: ${JSON.stringify(response.data)}`);
        }
    } catch (e) {
        console.error(e);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        m.reply(`Terjadi kesalahan saat memproses permintaan: ${e.message}`);
    }
};

handler.help = ['remini'];
handler.tags = ['image', 'ai'];
handler.command = /^hd2$/i;
handler.limit = true;
handler.register = true;
handler.premium = false;

export default handler;