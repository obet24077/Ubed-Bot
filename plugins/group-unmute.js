let handler = async (m, { conn, args, command, isAdmin, isBotAdmin, isOwner }) => {
    let chat = global.db.data.chats[m.chat]

    if (command === 'mute') {
        if (chat.isMuted) return m.reply('Bot sudah dalam keadaan mute.')

        let minutes = parseInt(args[0])
        if (!minutes || isNaN(minutes)) return m.reply('Masukkan durasi dalam menit!\nContoh: .mute 10')

        chat.isMuted = true
        chat.muteTimeout = Date.now() + minutes * 60 * 1000

        m.reply(`Bot telah dimute selama *${minutes} menit*. Hanya admin dan owner yang bisa menggunakannya.`)

        setTimeout(() => {
            chat.isMuted = false
            conn.sendMessage(m.chat, { text: 'Waktu mute telah habis. Bot aktif kembali untuk semua member.' })
        }, minutes * 60 * 1000)

    } else if (command === 'unmute') {
        if (!chat.isMuted) return m.reply('Bot belum dimute.')
        chat.isMuted = false
        chat.muteTimeout = null
        m.reply('Bot telah diunmute.')
    }
}

handler.help = ['mute <menit>', 'unmute']
handler.tags = ['group']
handler.command = /^(mute|unmute)$/i
handler.admin = true
handler.botAdmin = true
handler.group = true

export default handler