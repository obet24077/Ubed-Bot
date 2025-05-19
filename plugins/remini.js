import fetch from 'node-fetch';
import FormData from 'form-data';
import { promises as fs } from 'fs';
import { fileTypeFromBuffer } from 'file-type';

const catboxUrl = 'https://catbox.moe/user/api.php';
const catboxUserHash = null; // Isi dengan userhash Catbox Anda jika ada

let handler = async (m, { conn }) => {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || '';
    if (!mime) throw 'Kirim atau balas gambar yang ingin di-remini!';
    if (!mime.startsWith('image/')) throw 'Yang Anda kirim atau balas bukan gambar!';

    m.reply(wait); // Kirim pesan tunggu

    try {
        const media = await q.download();
        const { ext } = await fileTypeFromBuffer(media) || { ext: 'jpg' };
        const tmpFile = `/tmp/remini_${Date.now()}.${ext}`;
        await fs.writeFile(tmpFile, media);

        const formData = new FormData();
        formData.append('reqtype', 'upload');
        formData.append('fileToUpload', fs.createReadStream(tmpFile), `remini.${ext}`);
        if (catboxUserHash) formData.append('userhash', catboxUserHash);

        const uploadResponse = await fetch(catboxUrl, {
            method: 'POST',
            body: formData,
        });

        if (!uploadResponse.ok) {
            await fs.unlink(tmpFile);
            throw `Gagal mengunggah gambar ke Catbox: ${uploadResponse.status} ${uploadResponse.statusText}`;
        }

        const uploadResult = await uploadResponse.text();
        await fs.unlink(tmpFile);

        const imageUrl = uploadResult.trim();
        const apiKey = 'ubed2407';
        const apiUrl = `https://api.ubed.my.id/imagecreator/remini?apikey=${apiKey}&url=${encodeURIComponent(imageUrl)}`;

        const reminiResponse = await fetch(apiUrl);
        if (!reminiResponse.ok) throw `Gagal mengambil gambar dari API Remini: ${reminiResponse.status} ${reminiResponse.statusText}`;

        const buffer = await reminiResponse.buffer();

        await conn.sendFile(m.chat, buffer, 'remini_result.jpg', 'Gambar berhasil di-remini!', m);

    } catch (error) {
        console.error(error);
        m.reply(`Terjadi kesalahan: ${error}`);
    }
};

handler.help = ['remini'];
handler.tags = ['image'];
handler.command = /^remini$/i;

export default handler;