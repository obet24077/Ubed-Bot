let handler = async (m, { conn, participants }) => {
    let warnList = [];

    for (let { id } of participants) {
        let user = global.db.data.users[id];
        if (user && user.warn2 > 0) {
            warnList.push({ jid: id, warn: user.warn2 });
        }
    }

    if (warnList.length === 0) {
        return m.reply('✅ Tidak ada member yang memiliki warn di grup ini!');
    }

    let teks = '*Daftar Member yang Di-Warn:*\n\n';
    let mentions = [];

    warnList.forEach((u, i) => {
        teks += `${i + 1}. @${u.jid.split('@')[0]} - *${u.warn}/3 warn*\n`;
        mentions.push(u.jid);
    });

    m.reply(teks, null, { mentions });
};

handler.help = ['listwarn'];
handler.tags = ['group'];
handler.command = /^listwarn$/i;
handler.group = true;
handler.admin = true;

export default handler;