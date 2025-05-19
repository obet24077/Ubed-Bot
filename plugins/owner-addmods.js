let handler = async (m, { conn, text, db, command }) => {
    let who = m.isGroup ? (m.mentionedJid[0] || m.quoted?.sender || text) : m.chat
    if (!who) throw 'Tag Orangnya!'
    
    let userId = who.split`@`[0]
    let user = db.getUser(userId) // Retrieve user from db
    
    if (/^(add|tambah|\+)mods$/i.test(command)) {
        // Add moderator
        if (user.moderatorV2) throw 'Dia Sudah Menjadi Moderator!'
        
        user.moderatorV2 = true // Set the user as a moderator
        db.updateUser(userId, user) // Save the updated user in db
        conn.reply(m.chat, `@${userId} Sekarang Moderator!`, m, {
            contextInfo: { mentionedJid: [who] }
        })
    } else if (/^(del|hapus|-)mods$/i.test(command)) {
        // Remove moderator
        if (!user.moderatorV2) throw 'Dia Bukan Moderator!'
        
        user.moderatorV2 = false // Remove the moderator status
        db.updateUser(userId, user) // Save the updated user in db
        conn.reply(m.chat, `@${userId} Bukan Moderator Lagi!`, m, {
            contextInfo: { mentionedJid: [who] }
        })
    } else {
        throw 'Perintah tidak dikenali!'
    }
}

handler.help = ['addmods', 'delmods']
handler.tags = ['owner']
handler.command = /^(add|tambah|\+|del|hapus|-)mods$/i
handler.owner = true

export default handler