let handler = async (m, { conn, text }) => {
    if (!text) throw 'Siapa Yang Mau Di Berhentikan Sebagai User Premium?'

    let who
    if (m.isGroup) {
        // Check if the message contains a mention
        who = m.mentionedJid[0]
    }

    // If there's no mention, assume the text input is a phone number
    if (!who) {
        // Check if the text is a valid phone number format and construct the JID
        who = text.includes('@s.whatsapp.net') ? text : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    }

    if (!who) throw 'Tag atau masukkan nomor telepon dengan format yang benar'

    let users = global.db.data.users
    if (!(who in users)) throw 'User tidak ditemukan dalam database'

    users[who].premium = false
    users[who].premiumTime = 0
    conn.reply(m.chat, 'Done!', m)
}

handler.help = ['delprem']
handler.tags = ['owner']
handler.command = /^delprem(user)?$/i
handler.rowner = true

export default handler