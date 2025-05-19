let handler = async (m, { conn, args }) => {
    let target;
    if (m.quoted && m.quoted.sender) {
        target = m.quoted.sender;
    } else if (m.mentionedJid && m.mentionedJid[0]) {
        target = m.mentionedJid[0];
    } else if (args[0]) {
        let input = args[0].replace(/[@.+-]/g, '').trim();
        if (/^\d+/.test(input)) {
            target = input + '@s.whatsapp.net';
        } else {
            target = conn.parseMention(args[0]) || (input + '@s.whatsapp.net');
        }
    } else {
        throw '❔ Senpai, siapa yang mau di-warn? Tag, reply, atau kasih nomor dong!';
    }
    if (!target || !/@s\.whatsapp\.net$/.test(target)) {
        throw '⚠️ Wah, tag atau nomornya salah nih, coba cek lagi ya Senpai!';
    }
    if (!(target in global.db.data.users)) {
        throw '❌ User ini belum kece abis, ga ada di database!';
    }
    let user = global.db.data.users[target];
    user.warn2 = user.warn2 || 0;
    user.warn2 += 1;
    if (user.warn2 >= 3) {
        m.reply(`⛔ Wah, ${args[0] || 'dia'} udah kena 3 warn! Bye-bye dari grup, Senpai!`);
        await conn.groupParticipantsUpdate(m.chat, [target], 'remove');
        user.warn2 = 0;
    } else {
        m.reply(`⚠️ ${args[0] || 'User'} kena warn! Sekarang dia punya *${user.warn2}/3* warn. Hati-hati ya, Senpai!`);
    }
}

handler.help = ['warn @user | nomor | reply pesan']
handler.tags = ['group']
handler.command = /^warn(user)?$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler;