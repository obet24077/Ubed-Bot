let handler = async (m, { conn, args }) => {
    let sender = m.sender;
    let undangan = m.mentionedJid || [];

    if (undangan.length < 3) return m.reply('⚠️ Kamu harus mengundang minimal 3 orang!');

    if (!global.db.data.users[sender]) return m.reply('⚠️ Kamu tidak terdaftar dalam database');

    let user = global.db.data.users[sender];
    user.undanganDiterima = (user.undanganDiterima || 0) + undangan.length;

    // Menyimpan status undangan yang diterima untuk setiap yang diundang
    for (let invitee of undangan) {
        let inviteeData = global.db.data.users[invitee];
        if (inviteeData) {
            inviteeData.undangan = true; // Tandai jika orang yang diundang menerima undangan
        }
    }

    let caption = `
📜 *Undangan Pernikahan* 📜

💌 *${conn.getName(sender)}* mengundang kalian ke pernikahannya!

🎉 Gunakan .hadiracara untuk memberi hadiah!

💑 Pernikahan akan segera berlangsung!
`;

    await conn.sendMessage(m.chat, { text: caption, mentions: undangan });
}

handler.help = ['undangan @user1 @user2 @user3'];
handler.tags = ['rpg'];
handler.command = /^(undangan)$/i;

export default handler;