import { areJidsSameUser } from '@adiwajshing/baileys'

let handler = async (m, { conn, participants }) => {
    try {
        if (!m.mentionedJid?.length) {
            return m.reply(`📢 Siapa yang mau di promote??\nContoh: .promote @user`)
        }

        const validUsers = m.mentionedJid.filter(u => 
            !areJidsSameUser(u, conn.user.id) && 
            u.endsWith('@s.whatsapp.net')
        )
        
        if (!validUsers.length) return m.reply('🚫 Tidak ada user yang valid!')

        let successCount = 0
        for (const user of validUsers) {
            try {
                const participant = participants.find(p => areJidsSameUser(p.id, user))
                if (participant?.admin) continue
                
                await conn.groupParticipantsUpdate(m.chat, [user], 'promote')
                successCount++
                await new Promise(resolve => setTimeout(resolve, 500))
            } catch (e) {
                console.error(`Gagal promote ${user}:`, e)
            }
        }

        m.reply(`✅ Berhasil promote ${successCount} user!` + (successCount ? 
            `\n${validUsers.slice(0, successCount).map(u => `@${u.split('@')[0]}`).join(' ')}` : ''), 
            null, { mentions: validUsers.slice(0, successCount) }
        )

    } catch (error) {
        console.error(error)
        m.reply(`💥 Error: ${error.message}`)
    }
}

handler.help = ['promote']
handler.tags = ['group']
handler.command = /^promote$/i

handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler