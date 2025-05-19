import https from "https";
import { sticker } from "../lib/sticker.js";  // Pastikan fungsi sticker.js sudah benar

let handler = async (m, { conn, text }) => {
    if (!text) throw `📌 Masukkan teks untuk stiker!\n\nContoh: .furbrat UbedBot`;

    try {
        // Mengirimkan pesan loading
        await conn.sendMessage(m.chat, { text: '⏳ Loading...', mentions: [m.sender] });

        // Membuat URL untuk API menggunakan teks yang dikirim pengguna
        let url = `https://fastrestapis.fasturl.cloud/maker/furbrat?text=${encodeURIComponent(text)}&style=8&position=center&mode=image`;

        // Mengambil gambar dari API dalam bentuk buffer
        let buffer = await IBuffer(url);

        // Mengonversi buffer gambar menjadi stiker dan mengirimkan
        let stiker = await sticker(buffer, false, global.packname, global.author);

        if (stiker) {
            // Mengirimkan stiker ke pengguna
            await conn.sendFile(m.chat, stiker, 'furbrat.webp', '', m);
            
            // Mengirimkan pesan sukses
            await conn.sendMessage(m.chat, { text: '✅ Stiker berhasil dibuat!', mentions: [m.sender] });
        } else {
            throw "❌ Gagal membuat stiker!";
        }

    } catch (e) {
        console.error('[ERROR]', e);
        
        // Mengirimkan pesan error
        await conn.sendMessage(m.chat, { text: '❌ Terjadi kesalahan saat membuat stiker!', mentions: [m.sender] });
        throw "❌ Terjadi kesalahan saat membuat stiker!";
    }
};

handler.help = ["furbrat"];
handler.tags = ["sticker"];
handler.command = /^(furbrat)$/i;
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