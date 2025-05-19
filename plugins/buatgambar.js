import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

let handler = async (m, { conn, text, usedPrefix, command }) => {
  // Periksa apakah prompt ada
  if (!text) return m.reply(`Prompt tidak boleh kosong!\nContoh:\n${usedPrefix + command} Ubah menjadi gaya anime fantasy dengan pedang dan jubah.`);

  m.reply("⏳ Sedang diproses, mohon tunggu...");

  try {
    // Inisialisasi GoogleGenerativeAI dengan API Key
    let genAI = new GoogleGenerativeAI("AIzaSyDGKKLqFglsXuW8fv64qbkMjlG1i6t_AIU");

    const contents = [
      { text: text }
    ];

    // Memanggil model generatif untuk menghasilkan gambar
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: {
        responseModalities: ["Text", "Image"]
      },
    });

    // Hasilkan konten berdasarkan prompt
    const response = await model.generateContent(contents);

    let resultImage;
    // Menyaring hasil dan mendapatkan gambar hasil generasi
    for (const part of response.response.candidates[0].content.parts) {
      if (part.inlineData) {
        resultImage = Buffer.from(part.inlineData.data, "base64");
      }
    }

    // Jika gambar berhasil dihasilkan, kirim gambar ke chat
    if (resultImage) {
      const tempPath = path.join(process.cwd(), "tmp", `gemini_${Date.now()}.png`);
      fs.writeFileSync(tempPath, resultImage);

      // Mengirim gambar hasil generasi AI
      await conn.sendMessage(m.chat, {
        image: { url: tempPath },
        caption: `*Berhasil diproses dengan prompt:*\n${text}`
      }, { quoted: m });

      // Menghapus gambar sementara setelah 30 detik
      setTimeout(() => {
        try { fs.unlinkSync(tempPath); } catch {}
      }, 30000);
    } else {
      m.reply("Gagal menghasilkan gambar. Coba ubah prompt atau coba lagi nanti.");
    }
  } catch (error) {
    console.error(error);
    m.reply(`Terjadi error:\n${error.message}`);
  }
};

handler.help = ["buatgambar <prompt>"];
handler.tags = ["ai"];
handler.command = ["buatgambar"];

export default handler;