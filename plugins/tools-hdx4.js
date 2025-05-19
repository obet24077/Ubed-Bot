import axios from 'axios';
import FormData from 'form-data';

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    if (!mime) throw `Kirim gambar dengan caption *${usedPrefix}${command}* atau reply gambar dengan *${usedPrefix}${command}*`;
    if (!/image\/(jpe?g|png)/.test(mime)) throw `File yang kamu kirim bukan gambar!`;

    try {
        await conn.sendMessage(m.chat, { react: { text: '🍊', key: m.key } });

        // Download gambar
        const imgBuffer = await q.download();

        // Upload ke Catbox
        const form = new FormData();
        form.append('reqtype', 'fileupload');
        form.append('fileToUpload', imgBuffer, 'image.jpg');

        const catboxRes = await axios.post('https://catbox.moe/user/api.php', form, {
            headers: form.getHeaders(),
        });

        const catboxUrl = catboxRes.data;
        if (!catboxUrl.includes('catbox.moe')) throw 'Gagal upload ke Catbox.';

        // Kirim ke API Maelyn untuk upscale
        const apiUrl = `https://api.maelyn.tech/api/img2img/upscale?url=${encodeURIComponent(catboxUrl)}&apikey=ubed2407`;
        const { data } = await axios.get(apiUrl);

        if (data.status !== 'Success' || data.code !== 200) throw 'Gagal upscale gambar.';

        const upscaleUrl = data.result.url;
        const size = data.result.size;
        const expired = data.result.expired;

        const upscaleBuffer = (await axios.get(upscaleUrl, { responseType: 'arraybuffer' })).data;

        await conn.sendMessage(m.chat, {
            image: upscaleBuffer,
            caption: `🖼️ *Gambar Berhasil Di HD ×4`,
        }, { quoted: m });

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error(error);
        await conn.reply(m.chat, '❌ Terjadi kesalahan. Coba lagi nanti.', m);
    }
};

handler.help = ['hdx4'];
handler.tags = ['ai', 'image', 'tools'];
handler.command = /^(hdx4)$/i;
handler.limit = 3;
handler.register = true;
handler.premium = false;

export default handler;