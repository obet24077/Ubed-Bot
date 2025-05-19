import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || "";

  if (!mime || !text) {
    return m.reply(
      `Yah, Senpai! Contohnya gini: *${usedPrefix + command} ubah tongkat menjadi AK47*`
    );
  }

  if (!/image\/(jpe?g|png)/.test(mime)) {
    return m.reply(`Waduh, format ${mime} ga support! Cuma bisa jpeg, jpg, atau png, Senpai!`);
  }

  let promptText = text;
  await conn.sendMessage(m.chat, { react: { text: "🍋‍🟩", key: m.key } });

  try {
    let imgData = await q.download();
    let genAI = new GoogleGenerativeAI(`AIzaSyCMKHjCSrM0B7vTH0vqGUxhPchEevZUbrY`);

    const base64Image = imgData.toString("base64");

    const contents = [
      { text: `Edit gambar ini: ${promptText}` },
      {
        inlineData: {
          mimeType: mime,
          data: base64Image,
        },
      },
    ];

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: {
        responseModalities: ["Text", "Image"],
      },
    });

    const response = await model.generateContent(contents);

    if (
      !response?.response?.candidates?.[0]?.content?.parts
    ) {
      await conn.sendMessage(m.chat, { react: { text: "", key: m.key } });
      return m.reply("Aduh, ga bisa dapet hasilnya. Sabar ya, Senpai, coba lagi nanti!");
    }

    let resultImage = null;
    let resultText = "";

    for (const part of response.response.candidates[0].content.parts) {
      if (part.text) {
        resultText += part.text;
      } else if (part.inlineData) {
        resultImage = Buffer.from(part.inlineData.data, "base64");
      }
    }

    if (resultImage) {
      const tempPath = path.join(process.cwd(), "tmp", `editgambar_${Date.now()}.png`);
      fs.mkdirSync(path.dirname(tempPath), { recursive: true });
      fs.writeFileSync(tempPath, resultImage);

      await conn.sendMessage(
        m.chat,
        {
          image: { url: tempPath },
          caption: `*Jadi deh, Senpai!*\n\n${resultText || "Gambar udah diedit kece!"}`,
        },
        { quoted: m }
      );

      await conn.sendMessage(m.chat, { react: { text: "", key: m.key } });

      setTimeout(() => {
        try {
          fs.unlinkSync(tempPath);
          console.log("File sementara dihapus!");
        } catch (e) {
          console.log("Gagal hapus file sementara:", e);
        }
      }, 30000);
    } else {
      await conn.sendMessage(m.chat, { react: { text: "", key: m.key } });
      m.reply("Hmm, ga ada gambar yang jadi. Sabar ya, Senpai, mungkin promptnya kurang jelas!");
    }
  } catch (error) {
    console.error(error);
    await conn.sendMessage(m.chat, { react: { text: "", key: m.key } });
    m.reply(
      `Aduh, error nih, Senpai! Pesannya: *${error.message}*\n` +
      `Tenang, jangan panik! Coba cek prompt atau internetnya, kalo masih error, panggil aku lagi ya!`
    );
  }
};

handler.help = ["editimage"];
handler.tags = ["ai"];
handler.command = ["editgambar", "editimg", "editimage", "editfoto"];
handler.limit = 5;
handler.register = true;

export default handler;