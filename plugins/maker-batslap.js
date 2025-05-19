import axios from "axios";

let handler = async (m, { conn, usedPrefix, command }) => {
    let mentionedJid = m.mentionedJid[0];

    // Cek apakah ada user yang disebut
    if (!mentionedJid) {
        throw `📌 *Gunakan format:*\n${usedPrefix}${command} @user\n\n📌 *Contoh:*\n${usedPrefix}${command} @user`;
    }

    // Mendapatkan foto profil pengguna yang mengirim pesan dan yang disebut
    let avatar1 = await conn.profilePictureUrl(m.sender, "image").catch(() => "https://i.ibb.co/YT4kSTz/default-avatar.png");
    let avatar2 = await conn.profilePictureUrl(mentionedJid, "image").catch(() => "https://i.ibb.co/YT4kSTz/default-avatar.png");

    // Membuat URL API untuk batslap dengan avatar yang didapat
    let apiUrl = `https://beforelife.me/api/maker/batslap?avatar=${encodeURIComponent(avatar1)}&avatar2=${encodeURIComponent(avatar2)}&apikey=ubed2407`;

    // Mengirim reaksi emoji saat proses dimulai
    await conn.sendMessage(m.chat, { react: { text: "🖐", key: m.key } });

    try {
        // Mengambil data dari API
        let response = await axios({ url: apiUrl, method: "GET", responseType: "arraybuffer", timeout: 10000 });

        // Mengirim gambar yang diterima dari API
        await conn.sendMessage(m.chat, {
            image: response.data,
            caption: `👋 *Tamparan Keras!*\n\n👤 *${await conn.getName(m.sender)}* menampar *${await conn.getName(mentionedJid)}* 😆`,
        }, { quoted: m });

    } catch (e) {
        console.error("[ERROR]", e);

        // Menangani error dengan memberikan pesan kesalahan yang sesuai
        if (e.response && e.response.status === 524) {
            await conn.sendMessage(m.chat, {
                text: "❌ *Server sibuk atau timeout! Coba lagi nanti.*",
            }, { quoted: m });
        } else {
            await conn.sendMessage(m.chat, { text: "❌ Terjadi kesalahan saat membuat gambar tamparan!" }, { quoted: m });
        }
    }
};

handler.help = ["batslap"];
handler.tags = ["fun"];
handler.command = /^(batslap)$/i;

export default handler;