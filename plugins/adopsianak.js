let handler = async (m, { conn, args }) => {
    let sender = m.sender;
    let target = m.mentionedJid && m.mentionedJid[0];

    if (!target) return m.reply('⚠️ Tag seseorang yang ingin kamu adopsi sebagai anak!');

    let user = global.db.data.users[sender];
    let anak = global.db.data.users[target];

    if (!user.isMarried) return m.reply('⚠️ Kamu harus menikah dulu sebelum bisa adopsi anak!');
    if (user.money < 5000000) return m.reply('⚠️ Uang kamu kurang! Butuh Rp 5 juta untuk adopsi.');
    if (anak.level < 5) return m.reply('⚠️ Anak harus level 5 ke atas untuk diadopsi.');
    if (user.anak && user.anak.length >= 2) return m.reply('⚠️ Kamu hanya bisa memiliki maksimal 2 anak.');

    user.money -= 5000000;
    user.anak = user.anak || [];
    user.anak.push(target);

    let caption = `
👶 *Adopsi Anak* 👶

🎉 *${conn.getName(sender)}* telah mengadopsi *${conn.getName(target)}* sebagai anak!

💰 Biaya Adopsi: Rp 5 juta

📜 Gunakan: *.keluarga* untuk melihat status keluarga.
`;

    await conn.sendMessage(m.chat, { text: caption, mentions: [sender, target] });
}

handler.help = ['adopsi @user'];
handler.tags = ['rpg'];
handler.command = /^(adopsi)$/i;

export default handler;