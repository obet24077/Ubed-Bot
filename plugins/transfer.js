const handler = async (m, { conn, args, text, command }) => {
    if (args.length < 3) {
        return m.reply(`
*Format Salah!*
Contoh: .tf money 100000 @user

*List Yang Bisa di Transfer:*
• money
• exp
• limit
• diamond
• potion
• common
• uncommon
• mythic
• legendary
• string
• atm
`.trim());
    }

    const type = args[0].toLowerCase();
    const count = Math.floor(Number(args[1]));
    if (isNaN(count) || count <= 0) return m.reply('Jumlah harus berupa angka dan lebih dari 0');

    let who;
    if (m.mentionedJid?.[0]) {
        who = m.mentionedJid[0];
    } else if (args[2]) {
        who = args[2].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    } else {
        return m.reply('Tag pengguna atau masukkan nomornya!');
    }

    const user = global.db.data.users[m.sender];
    const target = global.db.data.users[who];

    if (!target) return m.reply('User penerima tidak ditemukan di database.');
    if ((user[type] || 0) < count) return m.reply(`${type} kamu tidak cukup!`);

    try {
        user[type] -= count;
        target[type] = (target[type] || 0) + count;

        m.reply(`✅ Berhasil mentransfer *${count.toLocaleString()} ${type}* ke @${who.split('@')[0]}`, null, {
            mentions: [who]
        });
    } catch (e) {
        console.error(e);
        m.reply('⚠️ Gagal mentransfer. Terjadi kesalahan.');
    }
};

handler.help = ['tf <type> <jumlah> <@tag/nomor>'];
handler.tags = ['rpg'];
handler.command = /^tf$/i;

export default handler;