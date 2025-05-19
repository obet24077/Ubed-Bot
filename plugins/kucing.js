import https from 'https';
import { sticker } from '../lib/sticker.js';

let handler = async (m, { conn }) => {
    try {
        // Ambil gambar kucing dari API
        let url = 'https://api.autoresbot.com/api/random/kucing?apikey=ubed2407';
        let buffer = await IBuffer(url);

        // Bikin stiker dari buffer
        let stiker = await sticker(buffer, false, global.packname, global.author);

        if (stiker) {
            await conn.sendFile(m.chat, stiker, 'cat.webp', '', m);
        } else {
            throw "❌ Gagal membuat stiker!";
        }

    } catch (e) {
        console.error('[ERROR]', e);
        throw "❌ Terjadi kesalahan saat membuat stiker!";
    }
};

handler.help = ["kucing"];
handler.tags = ["sticker"];
handler.command = /^(kucing)$/i;
handler.limit = true;
handler.premium = false;

export default handler;

// Fungsi ambil gambar dari URL
async function IBuffer(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = [];
            res.on('data', chunk => data.push(chunk));
            res.on('end', () => resolve(Buffer.concat(data)));
            res.on('error', reject);
        }).on("error", reject);
    });
}