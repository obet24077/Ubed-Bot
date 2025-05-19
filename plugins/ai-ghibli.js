import axios from 'axios';

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    if (!mime) throw `Kirim gambar dengan caption *${usedPrefix}${command}* atau reply gambar dengan *${usedPrefix}${command}*`;

    if (!/image\/(jpe?g|png)/.test(mime)) throw `File yang kamu kirim bukan gambar!`;

    try {
        await conn.sendMessage(m.chat, { react: { text: '🎨', key: m.key } });

        // Download gambar sebagai buffer
        const imgBuffer = await q.download();

        // Upload ke Catbox
        const FormData = (await import('form-data')).default;
        const form = new FormData();
        form.append('reqtype', 'fileupload');
        form.append('fileToUpload', imgBuffer, 'image.jpg');

        const catboxRes = await axios.post('https://catbox.moe/user/api.php', form, {
            headers: form.getHeaders(),
        });

        const catboxUrl = catboxRes.data;
        if (!catboxUrl.includes('catbox.moe')) throw 'Gagal upload ke Catbox.';

        // Kirim ke API Obet (langsung terima buffer)
        const apiUrl = `https://api.ubed.my.id/img2img/ghibli?apikey=ubed2407&url=${encodeURIComponent(catboxUrl)}`;
        const { data } = await axios.get(apiUrl, { responseType: 'arraybuffer' });

        // Kirim gambar ke user
        await conn.sendMessage(m.chat, {
            image: data,
            caption: `🖌️ Gambar kamu sudah diubah ke style Ghibli oleh Obet API.`,
        }, { quoted: m });

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error(err);
        await conn.reply(m.chat, '❌ Terjadi kesalahan saat memproses gambar.', m);
    }
};

handler.help = ['ghibli'];
handler.tags = ['ai', 'image'];
handler.command = /^(ghibli)$/i;
handler.limit = 3;
handler.register = true;
handler.premium = false;

export default handler;