import { sticker } from '../lib/sticker.js';
import axios from 'axios';
import uploadImage from '../lib/uploadImage.js';
import { webp2png } from '../lib/webp2mp4.js';

let handler = async (m, { conn, text }) => {
  try {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    // Jika tidak ada teks input, ambil teks dari pesan yang di-reply
    if (!text) {
      if (q.mtype === 'extendedTextMessage') text = q.text;
      else return m.reply('❌ *Teksnya mana?*\nGunakan `.qc` dengan teks atau reply pesan.');
    }

    // Ambil data pengguna (jika reply pakai yang direply, kalau tidak pakai pengirim asli)
    let target = m.quoted ? m.quoted.sender : m.sender;
    let senderName = await conn.getName(target) || "Pengguna WhatsApp";

    // Ambil foto profil pengguna (fallback jika gagal)
    let senderPP = await conn.profilePictureUrl(target, 'image').catch(() => 'https://telegra.ph/file/621f5c84c56d14c9dd4d3.jpg');

    // Kirim reaksi loading
    await conn.sendMessage(m.chat, { react: { text: "🕛", key: m.key } });

    let quoteData = {
      "type": "quote",
      "format": "png",
      "backgroundColor": "#ffffffff",
      "width": 512,
      "height": 768,
      "scale": 2,
      "messages": [{
        "entities": [],
        "avatar": true,
        "from": {
          "id": 1,
          "name": senderName,
          "photo": { "url": senderPP }
        },
        "text": text,
        "replyMessage": {}
      }]
    };

    // Jika ada media (gambar/stiker) di pesan yang di-reply, tambahkan ke bubble
    if (q.mtype === 'stickerMessage' || q.mtype === 'imageMessage') {
      let img = await q.download();
      if (img) {
        let url = /webp/g.test(mime) ? await webp2png(img) : await uploadImage(img);
        if (url) quoteData.messages[0].media = { "url": url };
      }
    }

    let buffer = await generateQuotly(quoteData);
    if (!buffer) return m.reply('❌ *Gagal membuat quotly!*\nCoba lagi nanti.');

    let stiker = await sticker(buffer, false, global.packname, global.author);
    if (stiker) {
      await conn.sendFile(m.chat, stiker, 'Quotly.webp', '', m);
      await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } else {
      m.reply('❌ *Gagal membuat sticker!*');
    }

  } catch (e) {
    console.error(e);
    m.reply('⚠️ *Terjadi kesalahan!*\nSilakan coba lagi nanti.');
  }
};

handler.help = ['qc'];
handler.tags = ['sticker'];
handler.command = /^(qc|quoted|quotly)$/i;
handler.limit = true;

export default handler;

// Fungsi Generate Quotly
async function generateQuotly(data) {
  try {
    let res = await axios.post("https://bot.lyo.su/quote/generate", data, {
      headers: { "Content-Type": "application/json" }
    });
    if (res.data?.result?.image) {
      return Buffer.from(res.data.result.image, "base64");
    }
    return null;
  } catch (e) {
    console.error("Error di API Quotly:", e.response?.data || e.message);
    return null;
  }
}