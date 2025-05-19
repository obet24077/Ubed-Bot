import fetch from 'node-fetch';
import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import { exec } from 'child_process';
import { Sticker } from 'wa-sticker-formatter';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let stiker = false;
  try {
    let [packname, ...author] = args.join` `.split`|`;
    author = (author || []).join`|`;
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || '';
    let [topText = '', bottomText = ''] = args.join(' ').split('|').map(v => v.trim());

    if (/webp/g.test(mime)) {
      throw 'Kamu tidak bisa mengubah stiker yang sudah ada menjadi stiker lagi! Silakan balas ke foto atau video.';
    } else if (/image/g.test(mime)) {
      let img = await q.download?.();
      stiker = await createSticker(img, false, packname, author);
    } else if (/video/g.test(mime)) {
      let videoBuffer = await q.download?.();
      stiker = await mp4ToWebpWithText(videoBuffer, { pack: packname, author: author, topText, bottomText });
    } else if (args[0] && isUrl(args[0])) {
      stiker = await createSticker(false, args[0], '', author, 20);
    } else {
      throw `🛟 Silakan balas ke gambar atau video dengan perintah ${usedPrefix + command}`;
    }
  } catch (e) {
    console.log(e);
    stiker = e;
  } finally {
    m.reply(stiker);
  }
};

handler.help = ['smemevid <teks atas>|<teks bawah>'];
handler.limit = true;
handler.tags = ['sticker'];
handler.command = /^smemevid$/i;

export default handler;

// Fungsi untuk membuat stiker dari gambar
async function createSticker(img, url, packName, authorName) {
  let stickerMetadata = {
    type: 'full',
    pack: packName,
    author: authorName,
    quality: 20
  };
  return (new Sticker(img ? img : url, stickerMetadata)).toBuffer();
}

// Fungsi untuk menambahkan teks ke video dan mengonversinya ke WebP menggunakan canvas
async function mp4ToWebpWithText(file, stickerMetadata) {
  if (stickerMetadata) {
    if (!stickerMetadata.pack) stickerMetadata.pack = 'PackName';
    if (!stickerMetadata.author) stickerMetadata.author = 'Author';
    if (!stickerMetadata.crop) stickerMetadata.crop = false;
  } else if (!stickerMetadata) {
    stickerMetadata = { pack: 'PackName', author: 'Author', crop: false };
  }

  // Menyimpan video sementara
  const videoInputPath = `./tmp_video_${Date.now()}.mp4`;
  fs.writeFileSync(videoInputPath, file);

  // Membuat overlay gambar untuk teks menggunakan canvas
  const overlayCanvas = createCanvas(600, 100);
  const ctx = overlayCanvas.getContext('2d');
  ctx.font = '30px Arial';
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.textAlign = 'center';

  if (stickerMetadata.topText) {
    ctx.fillText(stickerMetadata.topText, overlayCanvas.width / 2, 30);
    ctx.strokeText(stickerMetadata.topText, overlayCanvas.width / 2, 30);
  }

  if (stickerMetadata.bottomText) {
    ctx.fillText(stickerMetadata.bottomText, overlayCanvas.width / 2, overlayCanvas.height - 30);
    ctx.strokeText(stickerMetadata.bottomText, overlayCanvas.width / 2, overlayCanvas.height - 30);
  }

  const overlayBuffer = overlayCanvas.toBuffer();
  const overlayPath = `./overlay_${Date.now()}.png`;
  fs.writeFileSync(overlayPath, overlayBuffer);

  // Menyusun perintah ffmpeg untuk menambahkan overlay gambar ke video
  const videoOutputPath = `./out_video_${Date.now()}.mp4`;
  await new Promise((resolve, reject) => {
    exec(`ffmpeg -i ${videoInputPath} -i ${overlayPath} -filter_complex "[0:v][1:v]overlay=0:0" -c:v libx264 -preset fast -crf 22 -c:a copy ${videoOutputPath}`, (err, stdout, stderr) => {
      if (err) {
        console.error('Error executing ffmpeg:', err);
        console.error('ffmpeg stderr:', stderr);
        reject(err);
      } else {
        console.log('ffmpeg stdout:', stdout);
        resolve();
      }
    });
  });

  // Konversi video yang sudah diberi teks menjadi WebP
  const getBase64 = fs.readFileSync(videoOutputPath).toString('base64');
  const Format = {
    file: `data:video/mp4;base64,${getBase64}`,
    processOptions: {
      crop: stickerMetadata?.crop,
      startTime: '00:00:00.0',
      endTime: '00:00:7.0',  // Ambil 7 detik pertama dari video
      loop: 0
    },
    stickerMetadata: {
      ...stickerMetadata
    }
  };

  // Kirim permintaan ke API untuk mengonversi video ke WebP
  let res = await fetch('https://sticker-api.openwa.dev/convertMp4BufferToWebpDataUrl', {
    method: 'post',
    headers: {
      Accept: 'application/json, text/plain, /',
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(Format)
  });

  // Cleanup file sementara
  fs.unlinkSync(videoInputPath);
  fs.unlinkSync(overlayPath);
  fs.unlinkSync(videoOutputPath);

  // Mengembalikan buffer WebP
  return Buffer.from((await res.text()).split(';base64,')[1], 'base64');
}

const isUrl = (text) => text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png)/, 'gi'));