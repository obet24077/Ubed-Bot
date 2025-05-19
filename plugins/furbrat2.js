import https from "https";
import { sticker } from "../lib/sticker.js";  // Pastikan fungsi sticker.js sudah benar

let handler = async (m, { conn, text, command }) => {
    if (!text) throw `📌 Masukkan teks untuk stiker!\n\nContoh: .furbrat1 UbedBot`;

    // Menentukan style berdasarkan command yang dipilih
    let style = command.replace('furbrat', '');  // Mengambil angka style dari command

    // Memastikan style yang dimasukkan valid (1-8)
    if (isNaN(style) || style < 1 || style > 8) {
        throw `📌 Pilih style antara 1 hingga 8.\n\nContoh: .furbrat1 UbedBot`;
    }

    try {
        await m.react("⏳"); // Emoji loading

        // Membuat URL untuk API dengan memilih style berdasarkan perintah yang dikirim
        let url = `https://fastrestapis.fasturl.cloud/maker/furbrat?text=${encodeURIComponent(text)}&style=${style}&position=center&mode=image`;

        // Mengambil gambar dari API dalam bentuk buffer
        let buffer = await IBuffer(url);

        // Mengonversi buffer gambar menjadi stiker dan mengirimkan
        let stiker = await sticker(buffer, false, global.packname, global.author);

        if (stiker) {
            // Mengirimkan stiker ke pengguna
            await conn.sendFile(m.chat, stiker, 'furbrat.webp', '', m);
            await m.react("✅"); // Emoji sukses
        } else {
            throw "❌ Gagal membuat stiker!";
        }

    } catch (e) {
        console.error('[ERROR]', e);
        await m.react("❌"); // Emoji error
        throw "❌ Terjadi kesalahan saat membuat stiker!";
    }
};

handler.help = ["furbrat1", "furbrat2", "furbrat3", "furbrat4", "furbrat5", "furbrat6", "furbrat7", "furbrat8"];
handler.tags = ["sticker"];
handler.command = /^(furbrat[1-8])$/i;
handler.limit = true;
handler.premium = false;

export default handler;

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