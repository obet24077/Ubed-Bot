import { createCanvas, loadImage, registerFont } from 'canvas';
import fs from 'fs';
import { exec } from 'child_process';
import { fileTypeFromBuffer } from 'file-type';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const q = m.quoted ? m.quoted : m;

  const mime = (q.msg || q).mimetype || '';
  if (!mime || !/image|webp/.test(mime)) {
    return conn.reply(m.chat, `⚠️ Balas gambar atau stiker dengan caption:\n\n*${usedPrefix + command} Teks Atas | Teks Bawah*\nContoh:\n${usedPrefix + command} Selamat | Berbuka`, m);
  }

  if (conn.react) await conn.react(m.chat, m.key, '⏳');

  let [topText = '', bottomText = ''] = args.join(' ').split('|').map(v => v.trim());

  try {
    const buffer = await q.download();
    const type = await fileTypeFromBuffer(buffer);
    const isWebp = type?.mime === 'image/webp';

    // Jika input adalah stiker (webp), ubah ke PNG dulu
    const inputPath = `./tmp_in_${Date.now()}.${isWebp ? 'webp' : 'jpg'}`;
    const fixedInput = inputPath.replace(/\.\w+$/, '.png');

    fs.writeFileSync(inputPath, buffer);

    if (isWebp) {
      await new Promise((resolve, reject) => {
        exec(`ffmpeg -i ${inputPath} ${fixedInput}`, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    const finalInput = isWebp ? fixedInput : inputPath;
    const img = await loadImage(finalInput);

    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    let maxWidth = canvas.width - 40;
    let fontSize = Math.floor(canvas.width / 8);
    ctx.font = `bold ${fontSize}px Sans`;
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = Math.floor(fontSize / 10);
    ctx.textAlign = 'center';

    function wrapText(text, x, y, lineHeight) {
      const words = text.split(' ');
      let lines = [], line = '';

      for (const word of words) {
        const test = line + word + ' ';
        if (ctx.measureText(test).width > maxWidth && line) {
          lines.push(line);
          line = word + ' ';
        } else line = test;
      }
      lines.push(line.trim());

      const startY = y - (lines.length - 1) * (lineHeight / 2);
      for (let i = 0; i < lines.length; i++) {
        ctx.strokeText(lines[i], x, startY + i * lineHeight);
        ctx.fillText(lines[i], x, startY + i * lineHeight);
      }
    }

    if (topText) wrapText(topText.toUpperCase(), canvas.width / 2, fontSize + 10, fontSize + 5);
    if (bottomText) wrapText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - fontSize - 10, fontSize + 5);

    const outPng = `./out_${Date.now()}.png`;
    const outWebp = outPng.replace('.png', '.webp');
    fs.writeFileSync(outPng, canvas.toBuffer());

    await new Promise((resolve, reject) => {
      exec(`ffmpeg -i ${outPng} -vf "scale=512:512:force_original_aspect_ratio=decrease" -c:v libwebp -q:v 80 ${outWebp}`, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    await conn.sendMessage(m.chat, { sticker: fs.readFileSync(outWebp) }, { quoted: m });
    if (conn.react) await conn.react(m.chat, m.key, '✅');

    // Cleanup
    fs.unlinkSync(outPng);
    fs.unlinkSync(outWebp);
    fs.unlinkSync(inputPath);
    if (fs.existsSync(fixedInput)) fs.unlinkSync(fixedInput);

  } catch (err) {
    console.error(err);
    m.reply('❌ Gagal membuat stiker meme.');
  }
};

handler.help = ['smeme <teks atas>|<teks bawah>'];
handler.tags = ['sticker'];
handler.command = /^smeme2$/i;

export default handler;