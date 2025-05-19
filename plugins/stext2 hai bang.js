import fs from 'fs';
import { createCanvas } from 'canvas';
import { exec } from 'child_process';
import { GIFEncoder } from 'gifencoder';

let handler = async (m, { conn, text }) => {
    if (!text) return m.reply('⚠️ Masukkan teks untuk dijadikan stiker!');

    let gifPath = './temp_text.gif';

    // Buat encoder GIF
    const encoder = new GIFEncoder(512, 512);
    encoder.createReadStream().pipe(fs.createWriteStream(gifPath));
    encoder.start();
    encoder.setRepeat(0);  // Set GIF to loop
    encoder.setDelay(500); // Delay antara frame (ms)
    encoder.setQuality(10); // Kualitas GIF

    // Buat Canvas untuk setiap frame
    const canvas = createCanvas(512, 512);
    const ctx = canvas.getContext('2d');

    // Fungsi untuk memecah teks ke dalam beberapa baris
    function wrapText(ctx, text, maxWidth) {
        let words = text.split(' ');
        let lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            let testLine = currentLine + ' ' + words[i];
            let testWidth = ctx.measureText(testLine).width;
            if (testWidth > maxWidth) {
                lines.push(currentLine);
                currentLine = words[i];
            } else {
                currentLine = testLine;
            }
        }
        lines.push(currentLine);
        return lines;
    }

    // Atur posisi teks agar selalu di tengah
    let maxWidth = 480;
    let lineHeight = 60;
    let lines = wrapText(ctx, text, maxWidth);
    let startY = (canvas.height - lines.length * lineHeight) / 2;

    // Fungsi untuk mendapatkan warna acak
    function getRandomColor() {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Buat beberapa frame GIF dengan teks berkedip
    for (let i = 0; i < 10; i++) {
        // Set warna acak untuk teks
        ctx.fillStyle = getRandomColor();
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Background putih
        ctx.font = 'bold 50px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        // Gambar teks di canvas
        lines.forEach((line, i) => {
            ctx.fillText(line, canvas.width / 2, startY + i * lineHeight);
        });

        // Tambahkan frame ke GIF
        encoder.addFrame(ctx);
    }

    // Akhiri encoding GIF
    encoder.finish();

    // Kirim GIF sebagai stiker
    exec(`ffmpeg -i ${gifPath} -y -f webp ${gifPath.replace('.gif', '.webp')}`, async (err) => {
        if (err) return m.reply('⚠️ Gagal membuat stiker!');
        conn.sendMessage(m.chat, { sticker: fs.readFileSync(gifPath.replace('.gif', '.webp')) }, { quoted: m });

        // Hapus file sementara
        fs.unlinkSync(gifPath);
        fs.unlinkSync(gifPath.replace('.gif', '.webp'));
    });
};

handler.command = /^stext2$/i;
handler.tags = ["sticker"];
handler.help = ["stext", "stext2"];

export default handler;