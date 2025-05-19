let { MessageType } = (await import('@adiwajshing/baileys')).default
let handler = async (m, { conn, text }) => {
    if (!text) throw 'Masukkan jumlah limit yang akan ditambahkan'

    let who
    let phoneRegex = /^\+?\d+(-\d+)*$/

    if (m.isGroup) {
        if (phoneRegex.test(text.split(' ')[0])) {
            who = text.split(' ')[0].replace(/\D/g, '') + '@s.whatsapp.net'
        } else {
            who = m.mentionedJid[0]
        }
    } else {
        if (phoneRegex.test(text.split(' ')[0])) {
            who = text.split(' ')[0].replace(/\D/g, '') + '@s.whatsapp.net'
        } else {
            who = m.chat
        }
    }

    if (!who) throw 'Tag salah satu atau masukkan nomor telepon yang valid'

    let txt = text.replace('@' + who.split`@`[0], '').replace(text.split(' ')[0], '').trim()
    if (isNaN(txt)) throw 'Hanya angka'

    let poin = parseInt(txt)
    let limit = poin
    if (limit < 1) throw 'Minimal 1'

    let users = global.db.data.users
    if (!users[who]) throw 'User tidak ditemukan di database'

    users[who].limit += poin

    conn.reply(m.chat, `Selamat Kak @${who.split`@`[0]}. Kamu Mendapatkan limit Dari Owner Sebanyak +${poin} limit!`, m, { mentions: [who] })
}

handler.help = ['addlimit @user|+phone <amount>']
handler.tags = ['owner']
handler.command = /^addlimit$/
handler.owner = true

export default handler