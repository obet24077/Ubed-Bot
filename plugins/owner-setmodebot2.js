let handler = async (m) => {
    global.db.data.chats[m.chat].isBanned = false
    m.reply('Done!')
}
handler.help = ['setmodebot2']
handler.tags = ['owner']
handler.customPrefix = /^(Nanao Upmode)$/i;
handler.command = new RegExp()
handler.owner = true

export default handler