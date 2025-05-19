import axios from "axios";

async function laheluSearch(query) {
    try {
        let { data } = await axios.get(`https://lahelu.com/api/post/get-search?query=${encodeURIComponent(query)}&cursor=cursor`);
        return data.postInfos || [];
    } catch (error) {
        console.error("Error fetching data from Lahelu API:", error);
        return [];
    }
}

let handler = async (m, { conn, text }) => {
    try {
        if (!text) return m.reply("Silakan masukkan kata kunci untuk mencari meme!");

        const memes = await laheluSearch(text);

        if (memes.length === 0) {
            return m.reply("Tidak ada meme ditemukan untuk kata kunci tersebut.");
        }

        const meme = memes.find(m => m.mediaUrl) || memes[0];

        if (!meme.mediaUrl) {
            return m.reply("Meme ditemukan, tetapi tidak memiliki media yang tersedia.");
        }

        const message = `
*Title*: ${meme.title || "Tidak ada judul"}
*Author*: ${meme.userUsername || "Tidak diketahui"}
*Hashtags*: ${Array.isArray(meme.hashtags) ? meme.hashtags.join(", ") : "Tidak ada hashtag"}
        `;

        let fileUrl = meme.mediaUrl;
        let fileType = fileUrl.split(".").pop().toLowerCase();

        if (["jpg", "jpeg", "png", "gif"].includes(fileType)) {
            await conn.sendFile(m.chat, fileUrl, `meme.${fileType}`, message);
        } else if (["mp4", "webm"].includes(fileType)) {
            await conn.sendFile(m.chat, fileUrl, `meme.${fileType}`, message, null, "video");
        } else {
            m.reply("Format media tidak dikenali!");
        }
    } catch (error) {
        console.error("Terjadi kesalahan:", error);
        m.reply("Terjadi kesalahan saat mencari meme di Lahelu.");
    }
};

handler.help = ["lahelu <kata kunci>"];
handler.tags = ["internet"];
handler.command = /^lahelu$/i;
handler.limit = true;

export default handler;