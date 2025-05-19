const handler = async (m, { conn }) => {
    try {
        let user = global.db.data.users[m.sender];
        if (!user) return conn.reply(m.chat, "⚠️ Data user tidak ditemukan.", m);
        if (!user.tiktok) return conn.reply(m.chat, "⚠️ Kamu belum memiliki akun TikTok! Gunakan `.tiktokbuat` untuk membuat.", m);

        let { username, followers, likes, lives, level, money, exp } = user.tiktok;

        let profile = `🎭 *Profil TikTok*\n`;
        profile += `👤 Username: ${username}\n`;
        profile += `⭐ Level: ${level}\n`;
        profile += `📊 Followers: ${followers}\n`;
        profile += `💖 Likes: ${likes}\n`;
        profile += `🎬 Total Live: ${lives}\n`;
        profile += `💰 Money: ${money.toLocaleString()}\n`;
        profile += `🎮 Exp: ${exp}\n`;

        conn.reply(m.chat, profile, m);
    } catch (e) {
        conn.reply(m.chat, `❗ Error:\n${e}`, m);
    }
};

handler.command = ['akuntiktok','akuntt'];
handler.help = ['akuntiktok'];
handler.tags = ['game'];
export default handler;