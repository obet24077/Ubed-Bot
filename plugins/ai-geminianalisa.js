import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs/promises";
import path from "path";
import os from "os";

async function handler(m, { conn }) {
  try {
    const quoted = m.quoted || m;
    const mime = (quoted.msg || quoted).mimetype || '';
    if (!/image\/(jpe?g|png)/.test(mime)) return m.reply('Kirim atau balas gambar dengan caption .geminianalyze');

    m.reply('*Analyze Image....*');

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
    const imageParts = [{ inlineData: { data: buffer.toString("base64"), mimeType: "image/jpeg" } }];
    const prompt = "Tolong Analisis Gambar Tersebut Secara Menyeluruh Seperti Suasana,Tempat, Pewarnaan,Komposisi,Style Gambar,Detail-Detail Kecil Dan Lain Lain Berikan Kesimpulan Dari Gambar Tersebut";

    const tempPath = path.join(os.tmpdir(), `image-${Date.now()}.jpg`);
    await fs.mkdir(path.dirname(tempPath), { recursive: true });
    await fs.writeFile(tempPath, buffer);

    const res = await model.generateContent([prompt, ...imageParts]);
    await fs.unlink(tempPath);

    const result = res.response.text() + '\n\n> © Ubed Bot 2025';
    m.reply(result);
  } catch (e) {
    console.error('Error in geminiAnalyzer:', e);
    m.reply(e.message);
  }
}

handler.help = ['geminianalisa'];
handler.tags = ['ai', 'tools'];
handler.command = ['geminianalisa', 'analisisgambar', 'analyzegambar'];

export default handler;