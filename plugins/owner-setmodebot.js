let handler = async (m, { participants }) => {
    // if (participants.map(v=>v.jid).includes(global.conn.user.jid)) {
    global.db.data.chats[m.chat].isBanned = true
    m.reply('Done!')
    // } else m.reply('Ada nomor host disini...')
}
handler.help = ['setmodebot']
handler.tags = ['owner']
handler.customPrefix = /^(nanao 😪|nanao 😴)$/i;
handler.command = new RegExp() 

handler.owner = true

export default handler