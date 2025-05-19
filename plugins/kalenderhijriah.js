import { createCanvas } from '@napi-rs/canvas';
import { HijriDate } from 'hijri-js';

const handler = async (m, { conn }) => {
    // React saat memproses
    await conn.sendMessage(m.chat, { react: { text: "🗓️", key: m.key } });

    // Ambil tanggal saat ini (Masehi)
    let now = new Date();
    let hijri = new HijriDate(now); // Konversi ke Hijriah
    let yearH = hijri.getFullYear();
    let monthH = hijri.getMonth(); // 0-11
    let todayH = hijri.getDate();

    // Nama bulan Hijriah & hari
    const monthsH = ["Muharram", "Safar", "Rabiul Awal", "Rabiul Akhir", "Jumadil Awal", "Jumadil Akhir", "Rajab", "Sya'ban", "Ramadhan", "Syawal", "Dzulqa'dah", "Dzulhijjah"];
    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

    // Ukuran canvas
    const width = 800, height = 700;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background putih
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Header Bulan & Tahun
    ctx.fillStyle = "#000000";
    ctx.font = "bold 50px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${monthsH[monthH]} ${yearH} H`, width / 2, 100);

    // Garis pemisah
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(50, 130);
    ctx.lineTo(width - 50, 130);
    ctx.stroke();

    // Nama hari
    ctx.font = "bold 30px sans-serif";
    let startX = 80;
    let startY = 180;
    for (let i = 0; i < 7; i++) {
        ctx.fillText(days[i], startX + i * 100, startY);
    }

    // Ambil jumlah hari dalam bulan Hijriah & hari pertama
    let firstDayH = new HijriDate(yearH, monthH, 1).getDay(); // Hari pertama bulan ini
    let daysInMonthH = HijriDate.daysInMonth(yearH, monthH);

    // Gambar kalender
    let x = 80, y = 230;
    ctx.font = "bold 35px sans-serif";
    for (let i = 0; i < firstDayH; i++) x += 100; // Geser posisi awal

    for (let date = 1; date <= daysInMonthH; date++) {
        // Tandai hari ini dengan warna merah
        ctx.fillStyle = (date === todayH) ? "#ff0000" : "#000000";
        ctx.fillText(date.toString(), x + 35, y); // Posisi lebih ke tengah

        // Pindah ke kolom berikutnya
        x += 100;
        if (x >= width - 50) {
            x = 80;
            y += 60; // Baris baru
        }
    }

    // Kirim sebagai buffer tanpa menyimpan ke file
    const buffer = canvas.toBuffer('image/png');

    // React sukses sebelum mengirim gambar
    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

    // Kirim gambar ke pengguna
    await conn.sendMessage(m.chat, { image: buffer, caption: `🗓️ Kalender Hijriah ${monthsH[monthH]} ${yearH} H` }, { quoted: m });
};

handler.command = ['kalenderhijriah', 'kalenderh'];
handler.help = ['kalenderhijriah'];
handler.tags = ['tools'];

export default handler;