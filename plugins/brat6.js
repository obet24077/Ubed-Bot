import { createCanvas } from 'canvas';
import sharp from 'sharp';

async function BratGenerator(teks, bgColor, textColor) {
  let width = 512;
  let height = 512;
  let margin = 20;

  let canvas = createCanvas(width, height);
  let ctx = canvas.getContext('2d');

  // **Latar belakang sesuai parameter**
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  let fontSize = 180; // Ukuran font awal
  ctx.font = `${fontSize}px 'Arial Narrow', sans-serif`;
  ctx.fillStyle = textColor;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'; // Efek bayangan
  ctx.shadowBlur = 4;

  // **Fungsi untuk membungkus teks panjang menjadi beberapa baris**
  function wrapText(ctx, text, maxWidth) {
    let words = text.split(' ');
    let lines = [];
    let currentLine = '';

    words.forEach(word => {
      let testLine = currentLine ? `${currentLine} ${word}` : word;
      let testWidth = ctx.measureText(testLine).width;

      if (testWidth > maxWidth) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });

    if (currentLine) lines.push(currentLine);
    return lines;
  }

  let lines = wrapText(ctx, teks, width - 2 * margin);

  // **Auto-scaling font size jika teks terlalu panjang**
  while ((lines.length * fontSize * 1.2) > height - 2 * margin) {
    fontSize -= 5;
    ctx.font = `${fontSize}px 'Arial Narrow', sans-serif`;
    lines = wrapText(ctx, teks, width - 2 * margin);
  }

  ctx.textAlign = 'left'; // **Teks mulai dari kiri**
  ctx.textBaseline = 'top'; // **Teks mulai dari atas**

  let x = margin; // **Teks dimulai dari samping kiri**
  let y = margin; // **Teks dimulai dari atas**

  for (let line of lines) {
    ctx.fillText(line, x, y);
    y += fontSize * 1.2; // Jarak antar baris
  }

  let buffer = canvas.toBuffer('image/png');

  // **Konversi ke WebP agar bisa dijadikan stiker**
  let webpBuffer = await sharp(buffer).webp({ quality: 90 }).toBuffer();

  return webpBuffer;
}

let handler = async (m, { text, conn, command }) => {
  if (!text) return m.reply('⚠️ Masukkan teks untuk dibuat sticker.');

  // **Atur warna latar belakang dan teks sesuai command**
  let colors = {
    brat6: { bg: '#FF0000', text: '#FFFFFF' }, // Merah, teks putih
    brat7: { bg: '#0000FF', text: '#FFFFFF' }, // Biru, teks putih
    brat8: { bg: '#008000', text: '#000000' }, // Hijau, teks hitam
    brat9: { bg: '#800080', text: '#FFFFFF' }, // Ungu, teks putih
    brat10: { bg: '#FFFF00', text: '#000000' }, // Kuning, teks hitam
    brat11: { bg: '#FFA500', text: '#000000' }, // Oranye, teks hitam
    brat12: { bg: '#FFC0CB', text: '#000000' }, // Pink, teks hitam
    brat13: { bg: '#8B4513', text: '#FFFFFF' }, // Coklat, teks putih
    brat14: { bg: '#808080', text: '#FFFFFF' }, // Abu-abu, teks putih
    brat15: { bg: '#00FFFF', text: '#000000' }, // Cyan, teks hitam
    brat16: { bg: '#4B0082', text: '#FFFFFF' }, // Indigo, teks putih
    brat17: { bg: '#FFD700', text: '#000000' }, // Emas, teks hitam
    brat18: { bg: '#ADFF2F', text: '#000000' }, // Hijau Lemon, teks hitam
    brat19: { bg: '#E6E6FA', text: '#000000' }, // Lavender, teks hitam
    brat20: { bg: '#8B0000', text: '#FFFFFF' }, // Merah Gelap, teks putih
    brat21: { bg: '#4682B4', text: '#FFFFFF' }, // Biru Baja, teks putih
    brat22: { bg: '#654321', text: '#FFFFFF' }, // Coklat Tua, teks putih
    brat23: { bg: '#FF6347', text: '#000000' }, // Tomat, teks hitam
    brat24: { bg: '#2E8B57', text: '#FFFFFF' }, // Sea Green, teks putih
    brat25: { bg: '#B22222', text: '#FFFFFF' }, // Merah Bata, teks putih
    brat26: { bg: '#FF0000', text: '#000000' }, // Merah, teks hitam
    brat27: { bg: '#0000FF', text: '#000000' }, // Biru, teks hitam
    brat28: { bg: '#008000', text: '#FFFFFF' }, // Hijau, teks putih
    brat29: { bg: '#800080', text: '#FFFFFF' }, // Ungu, teks putih
    brat30: { bg: '#FFFF00', text: '#000000' }, // Kuning, teks hitam
    brat31: { bg: '#000000', text: '#FFFFFF' }, // Hitam, teks putih
    brat32: { bg: 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)', text: '#000000' }, // Pelangi, teks hitam
    brat33: { bg: '#FFFFFF', text: 'rainbow' }, // Putih, teks warna-warni
    brat34: { bg: '#000000', text: 'rainbow' }, // Hitam, teks warna-warni
    brat35: { bg: 'transparent', text: '#FFFFFF' }, // Transparan, teks putih
    brat36: { bg: 'transparent', text: '#000000' }, // Transparan, teks hitam
    brat37: { bg: 'transparent', text: '#FF0000' }, // Transparan, teks merah
    brat38: { bg: 'transparent', text: '#FFFF00' }, // Transparan, teks kuning
    brat39: { bg: 'transparent', text: '#0000FF' }, // Transparan, teks biru
    brat40: { bg: 'transparent', text: 'rainbow' }, // Transparan, teks warna-warni
  };

  let colorConfig = colors[command];
  if (!colorConfig) return m.reply('⚠️ Perintah tidak valid.');

  let webpBuffer = await BratGenerator(text, colorConfig.bg, colorConfig.text);
  await conn.sendMessage(m.chat, { sticker: webpBuffer }, { quoted: m });
};

handler.command = /^brat(6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31|32|33|34|35|36|37|38|39|40)$/i;
handler.tags = ['sticker'];
handler.help = [
    'brat6', 'brat7', 'brat8', 'brat9', 'brat10',
    'brat11', 'brat12', 'brat13', 'brat14', 'brat15',
    'brat16', 'brat17', 'brat18', 'brat19', 'brat20',
    'brat21', 'brat22', 'brat23', 'brat24', 'brat25',
    'brat26', 'brat27', 'brat28', 'brat29', 'brat30',
    'brat31', 'brat32', 'brat33', 'brat34', 'brat35',
    'brat36', 'brat37', 'brat38', 'brat39', 'brat40'
];

export default handler;