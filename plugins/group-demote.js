import { areJidsSameUser } from '@adiwajshing/baileys'

let handler = async (m, { conn, participants }) => {
    try {
        if (!m.mentionedJid?.length) {
            return m.reply(`📢 Siapa yang mau di demote??\nContoh: .demote @user`)
        }

        const [user] = m.mentionedJid
            .filter(u => !areJidsSameUser(u, conn.user.id))
            .slice(0, 1)

        if (!user) return m.reply('🚫 User tidak valid!')

        await conn.groupParticipantsUpdate(m.chat, [user], 'demote')
        m.reply('🔥 Berhasil demote user!')

    } catch (error) {
        console.error(error)
        m.reply(`💥 Error: ${error.message}`)
    }
}

handler.help = ['demote']
handler.tags = ['group']
handler.command = /^demote$/i
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler