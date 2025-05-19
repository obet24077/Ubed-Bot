let handler = async (m, { conn, args, participants }) => {
    if (args[0] === 'all') {
        let members = participants.map(part => part.id);
        let warnList = [];
        for (let member of members) {
            if (member in global.db.data.users) {
                let user = global.db.data.users[member];
                if (!user.warn2) user.warn2 = 0;
                if (user.warn2 > 0) {
                    warnList.push({ jid: member, warn: user.warn2 });
                }
            }
        }
        if (warnList.length === 0) {
            return m.reply('Tidak ada member yang memiliki warn di grup ini!');
        }
        let message = '*Daftar Warn Member:*\n';
        let mentions = [];
        warnList.forEach((item, index) => {
            let username = `@${item.jid.split('@')[0]}`;
            message += `${index + 1}. ${username}: *${item.warn}/3* warn\n`;
            mentions.push(item.jid);
        });
        m.reply(message, null, { mentions });
    } else {
        let mention = m.mentionedJid && m.mentionedJid[0] || conn.parseMention(args[0]);
        if (!mention) mention = m.sender;
        if (!(mention in global.db.data.users)) {
            return m.reply('Tag salah satu yg sudah terdaftar ke dalam database!');
        }
        let user = global.db.data.users[mention];
        if (!user.warn2) user.warn2 = 0;
        let isSelf = mention === m.sender;
        let username = isSelf ? 'Kamu' : `@${mention.split('@')[0]}`;
        m.reply(`${username} memiliki *${user.warn2}/3* warn.`, null, { mentions: [mention] });
    }
}

handler.help = ['cekwarn [@mention/all]']
handler.tags = ['group']
handler.command = /^cekwarn$/i
handler.group = true
handler.admin = true

export default handler