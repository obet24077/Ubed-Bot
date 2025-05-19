import axios from "axios";

let handler = async (m, { conn, usedPrefix, command, text }) => {
    if (!text) {
        throw `📌 *Gunakan format:*\n${usedPrefix}${command} <teks>\n\n📌 *Contoh:*\n${usedPrefix}${command} Heavy Craft`;
    }

    let query = encodeURIComponent(text.trim());
    let apiUrl = `https://beforelife.me/api/ephoto/pig?text=${query}&apikey=ubed2407`;

    // Mengirim reaksi emoji ⏳ saat proses dimulai
    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

    try {
        // Mengambil gambar dari API
        let response = await axios({ url: apiUrl, method: "GET", responseType: "arraybuffer" });

        // Mengirim gambar hasil dari API
        await conn.sendMessage(m.chat, {
            image: response.data,
            caption: `✅ *Gambar dengan tema pig berhasil dibuat!*\n📌 *Teks:* ${text.trim()}`,
        }, { quoted: m });

        // Mengirim reaksi emoji 🍏 setelah selesai
        await conn.sendMessage(m.chat, { react: { text: "🍏", key: m.key } });

    } catch (e) {
        console.error("[ERROR]", e);
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        throw `❌ Terjadi kesalahan saat membuat gambar tema pig.\n\n🔍 *Error:* ${e.message || e}`;
    }
};

handler.help = ["pig"];
handler.tags = ["fun"];
handler.command = /^(pig)$/i;

export default handler;