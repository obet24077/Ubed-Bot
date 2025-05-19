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
        throw '❔ Senpai, siapa yang mau dihapus warn-nya? Tag, reply, atau kasih nomor dong!';
    }
    if (!target || !/@s\.whatsapp\.net$/.test(target)) {
        throw '⚠️ Wah, tag atau nomornya salah nih, coba cek lagi ya Senpai!';
    }
    if (!(target in global.db.data.users)) {
        throw '❌ User ini belum kece abis, ga ada di database!';
    }
    let user = global.db.data.users[target];
    if (!user.warn2 || user.warn2 <= 0) {
        throw '⛔ User ini bersih banget, ga punya warn buat dihapus!';
    }
    let count = isNaN(parseInt(args[1])) ? 1 : parseInt(args[1]);
    if (user.warn2 < count) {
        throw `User cuma punya *${user.warn2}* warn, ga cukup buat hapus *${count}*!`;
    }
    user.warn2 -= count;
    m.reply(`✔️ Yeay, berhasil hapus *${count}* warn! Sekarang dia punya *${user.warn2}* warn, Senpai!`);
}

handler.help = ['unwarn @user | nomor | reply pesan']
handler.tags = ['group']
handler.command = /^unwarn(user)?$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler;