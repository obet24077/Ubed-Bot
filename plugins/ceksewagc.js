import fs from 'fs';

// Path database sewa grup
const sewaPath = './database/sewaGrup.json';

// Membaca database sewa
let sewaData = fs.existsSync(sewaPath) ? JSON.parse(fs.readFileSync(sewaPath)) : {};

// Fungsi format tanggal
const formatDate = (timestamp) => {
    let date = new Date(timestamp);
    return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

let handler = async (m, { conn }) => {
    let sewaList = Object.entries(sewaData);

    if (sewaList.length === 0) return m.reply("⚠️ Tidak ada grup yang sedang dalam masa sewa.");

    let text = "📌 *Daftar Grup yang Disewa:*\n\n";
    for (let [id, data] of sewaList) {
        text += `📂 *Nama Grup:* ${data.nama || 'Unknown'}\n`;
        text += `📍 *ID Grup:* ${id}\n`;
        text += `🕒 *Berakhir:* ${formatDate(data.expired)}\n`;
        text += "━━━━━━━━━━━━━━\n";
    }

    m.reply(text);
};

handler.command = /^(ceksewagc)$/i;
handler.rowner = true; // Hanya pemilik bot yang bisa mengecek

export default handler;