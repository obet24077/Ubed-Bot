import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path'; // Tambahin ini biar bisa bikin path folder tmp

// Pastiin folder tmp ada, kalo ga ada, bikin dulu
const ensureTmpFolder = () => {
    const tmpDir = './tmp';
    if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir);
    }
};

async function removeBg(imagePath, apiKey) {
    try {
        const formData = new FormData();
        formData.append('image_file', fs.createReadStream(imagePath));
        formData.append('size', 'auto');

        const response = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: {
                'X-Api-Key': apiKey,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Remove.bg API error: ${response.status} ${response.statusText}`);
        }

        const buffer = await response.buffer();
        // Simpen di folder tmp, kasih nama unik pake timestamp
        const outputImagePath = path.join('tmp', `hasil_removebg_${Date.now()}.png`);
        fs.writeFileSync(outputImagePath, buffer);

        return outputImagePath;
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let apiKey = '6nzMoo6CJ9bMWQuejJ9nnSJk';

    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    if (!mime.startsWith('image/')) throw `Kirim gambar atau balas gambar dengan perintah ${usedPrefix}${command}`;

    try {
        let media = await q.download();
        // Simpen file sementara di tmp juga
        let tmpFile = path.join('tmp', `tmp_${Date.now()}.${mime.split('/')[1]}`);
        ensureTmpFolder(); // Panggil fungsi buat pastiin folder tmp ada
        fs.writeFileSync(tmpFile, media);

        await conn.sendMessage(m.chat, { react: { text: '🖌️', key: m.key } });

        let outputPath = await removeBg(tmpFile, apiKey);

        let caption = args.join(' ') || 'Done, Senpai!';
        
        await conn.sendFile(m.chat, outputPath, 'removebg.png', caption, m);

        await conn.sendMessage(m.chat, { react: { text: null, key: m.key } });

        // Hapus file sementara, hasilnya tetep di tmp ga dihapus
        fs.unlinkSync(tmpFile);
    } catch (error) {
        console.error(error);
        m.reply(`Waduh, ada error nih, Senpai: ${error.message}`);
    }
};

handler.help = ['removebg'];
handler.tags = ['tools', 'premium'];
handler.command = /^(removebg|rembg)$/i;
handler.premium = true;
handler.register = true;

export default handler;