let handler = async (m, { conn, command, args, isAdmin, isBotAdmin, isOwner }) => {
    if (!m.isGroup) return m.reply('❗ Fitur ini hanya bisa digunakan di grup.')
    if (!(isAdmin || isOwner)) return m.reply('❗ Hanya admin grup yang bisa mengatur fitur ini.')

    let chat = global.db.data.chats[m.chat]
    const isEnable = /^(on|enable|aktifkan)$/i.test(args[0])
    const isDisable = /^(off|disable|matikan)$/i.test(args[0])

    if (isEnable) {
        chat.antiLinkYT = true
        m.reply('✅ Fitur Anti-Link YouTube telah *diaktifkan*.')
    } else if (isDisable) {
        chat.antiLinkYT = false
        m.reply('✅ Fitur Anti-Link YouTube telah *dimatikan*.')
    } else {
        m.reply(`⚙️ Penggunaan:\n\n• .antilinkyt on - untuk mengaktifkan\n• .antilinkyt off - untuk mematikan`)
    }
}

handler.command = /^antilinkyt$/i
handler.help = ['antilinkyt <on/off>']
handler.tags = ['group']
handler.admin = true
handler.botAdmin = true

export default handler