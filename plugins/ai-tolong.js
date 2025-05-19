import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs/promises";
import path from "path";
import os from "os";

const handler = async (m, { conn }) => {
  try {
    const quoted = m.quoted || m;
    const mime = (quoted.msg || quoted).mimetype || '';
    if (!/image\/(jpe?g|png)/.test(mime)) return m.reply('⚠️ Kirim atau balas gambar apapun (soal, kode error, pengetahuan umum) dengan caption *.jawabimg*');

    m.reply('⏳ *Mendeteksi isi gambar dan memproses solusi...*');

    // API Key Gemini
    const apiKeys = [
      "AIzaSyD0lkGz6ZhKi_MHSSmJcCX3wXoDZhELPaQ",
      "AIzaSyDnBPd_EhBfr73NssnThVQZYiKZVhGZewU",
      "AIzaSyA94OZD-0V4quRbzPb2j75AuzSblPHE75M",
      "AIzaSyB5aTYbUg2VQ0oXr5hdJPN8AyLJcmM84-A",
      "AIzaSyB1xYZ2YImnBdi2Bh-If_8lj6rvSkabqlA",
      "AIzaSyDb2aMSboqFdqiGfQF8PzFzCYoGmoI0"
    ];
    const apiKey = process.env.GEMINI_API_KEY || apiKeys[Math.floor(Math.random() * apiKeys.length)];

    const buffer = await quoted.download();
    const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: "gemini-1.5-pro" });

    const imageParts = [{
      inlineData: {
        data: buffer.toString("base64"),
        mimeType: "image/jpeg"
      }
    }];

    const prompt = `
Kamu adalah AI pemecah masalah. Gambar ini mungkin berisi:
- Soal pendidikan (matematika, fisika, sejarah, dll)
- Kode error programming (JavaScript, Node.js, Baileys, dsb)
- Catatan pelajaran, artikel, pertanyaan umum

Tugasmu:
1. Jelaskan isi dari gambar tersebut.
2. Jika itu soal, berikan jawabannya + alasan logis.
3. Jika itu error coding, jelaskan masalah dan beri solusi perbaikan kode.
4. Jika itu pertanyaan umum, jawab dengan akurat.
5. Jika ada kesalahan dalam isi gambar, bantu koreksi.

Format Jawaban:
➤ Isi Gambar:
...
➤ Analisis:
...
➤ Jawaban/Solusi:
...
➤ (Opsional) Koreksi:
...
`;

    const tempPath = path.join(os.tmpdir(), `img-${Date.now()}.jpg`);
    await fs.writeFile(tempPath, buffer);

    const res = await model.generateContent([prompt, ...imageParts]);
    await fs.unlink(tempPath);

    const result = res.response.text().trim();
    await conn.reply(m.chat, `${result}\n\n> © Ubed Bot 2025`, m);

  } catch (e) {
    console.error(e);
    m.reply('❌ *Terjadi error saat memproses gambar!*\nPastikan gambar jelas dan tidak rusak.\n\n' + e.message);
  }
};

handler.help = ['tolong'];
handler.tags = ['ai', 'tools', 'pendidikan', 'coding', 'analisis'];
handler.command = ['tolong'];

export default handler;