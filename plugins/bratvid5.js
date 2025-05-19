import fs from 'fs';
import { createCanvas } from 'canvas';
import { exec } from 'child_process';

let bgColors = {
    bratvid5: "#FF0000", bratvid6: "#0000FF", bratvid7: "#FFFF00",
    bratvid8: "#800080", bratvid9: "#FFA500", bratvid10: "#00FFFF",
    bratvid11: "#808080", bratvid12: "#8B4513", bratvid13: "#FFC0CB",
    bratvid14: "#006400", bratvid15: "#FFD700", bratvid16: "#000080",
    bratvid17: "#E6E6FA", bratvid18: "#FF00FF", bratvid19: "#008080",
    bratvid20: "#000000"
};

let handler = async (m, { conn, text, command }) => {
    if (!text) return m.reply('⚠️ Masukkan teks untuk dijadikan stiker!');
    if (!bgColors[command]) return m.reply('⚠️ Perintah tidak valid!');

    let bgColor = bgColors[command];
    let textColor = isDarkColor(bgColor) ? "#FFFFFF" : "#000000";

    let outputPath = `./${command}.webp`;
    let frameDir = `./frames_${command}`;
    if (!fs.existsSync(frameDir)) fs.mkdirSync(frameDir);

    let frames = await generateFrames(text, 512, 512, bgColor, textColor);
    let frameFiles = [];

    for (let i = 0; i < frames.length; i++) {
        let framePath = `${frameDir}/frame_${i}.png`;
        fs.writeFileSync(framePath, frames[i]);
        frameFiles.push(framePath);
    }

    let ffmpegCommand = `ffmpeg -y -framerate 1 -i ${frameDir}/frame_%d.png -vf "scale=512:512:force_original_aspect_ratio=decrease" -c:v libwebp -loop 0 -q:v 80 -preset default ${outputPath}`;
    exec(ffmpegCommand, async (err) => {
        if (err) return m.reply('⚠️ Gagal membuat stiker animasi!');
        
        conn.sendMessage(m.chat, { sticker: fs.readFileSync(outputPath) }, { quoted: m });

        frameFiles.forEach(f => fs.unlinkSync(f));
        fs.unlinkSync(outputPath);
    });
};

// 🔹 Fungsi untuk membuat frame animasi
async function generateFrames(text, width, height, bgColor, textColor) {
    let frames = [];
    let words = text.split(' ');
    let currentText = '';

    for (let i = 0; i < words.length; i++) {
        currentText += words[i] + ' ';
        let canvas = createCanvas(width, height);
        let ctx = canvas.getContext('2d');

        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);

        let fontSize = 100; // Mulai dengan font yang lebih kecil
        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = textColor;
        ctx.shadowColor = textColor;
        ctx.shadowBlur = 8;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        let lines = wrapText(ctx, currentText.trim(), width - 40, fontSize);

        // Jika terlalu banyak baris, perkecil font size agar tetap masuk
        while (lines.length > 6 && fontSize > 40) {
            fontSize -= 10;
            ctx.font = `${fontSize}px Arial`;
            lines = wrapText(ctx, currentText.trim(), width - 40, fontSize);
        }

        let startX = 20; // Mulai dari kiri atas
        let startY = 20;

        for (let j = 0; j < lines.length; j++) {
            ctx.fillText(lines[j], startX, startY + j * (fontSize + 5));
        }

        frames.push(canvas.toBuffer());
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return frames;
}

// 🔹 Fungsi menentukan apakah warna gelap
function isDarkColor(hex) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    let brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
}

// 🔹 Fungsi membungkus teks
function wrapText(ctx, text, maxWidth, fontSize) {
    ctx.font = `${fontSize}px Arial`;
    let words = text.split(' ');
    let lines = [];
    let line = '';

    for (let word of words) {
        let testLine = line + word + ' ';
        let testWidth = ctx.measureText(testLine).width;
        if (testWidth > maxWidth && line !== '') {
            lines.push(line);
            line = word + ' ';
        } else {
            line = testLine;
        }
    }
    lines.push(line);
    return lines;
}

// 🔹 Perintah yang tersedia
handler.command = /^bratvid(5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20)$/i;

// 🔹 Bantuan untuk handler
handler.help = [
    'bratvid5', 'bratvid6', 'bratvid7', 'bratvid8', 'bratvid9',
    'bratvid10', 'bratvid11', 'bratvid12', 'bratvid13', 'bratvid14',
    'bratvid15', 'bratvid16', 'bratvid17', 'bratvid18', 'bratvid19', 'bratvid20'
].map(cmd => `${cmd} <teks>`);

// 🔹 Kategori untuk handler
handler.tags = ['sticker'];

export default handler;