let { MessageType } = (await import('@adiwajshing/baileys')).default

let handler = async (m, { conn, text }) => {
    if (!text) throw 'Masukkan jumlah *Level* yang akan diberi.'
    
    let who
    if (m.isGroup) who = m.mentionedJid[0]
    else who = m.chat
    if (!who) throw 'Tag salah satu pengguna.'

    let txt = text.replace('@' + who.split`@`[0], '').trim()
    if (isNaN(txt)) throw 'Input harus berupa angka.'
    
    let level = parseInt(txt)
    if (level < 1) throw 'Minimal 1 level.'

    let users = global.db.data.users
    users[who].level += level

    conn.reply(m.chat, `Selamat @${who.split`@`[0]}, kamu mendapatkan +${level} LEVEL!`, m, {
        mentions: [who]
    })
}

handler.help = ['addlevel @user <jumlah>']
handler.tags = ['owner']
handler.command = /^addlevel$/i
handler.owner = true

export default handler