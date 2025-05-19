/*
wa.me/6282285357346
github: https://github.com/sadxzyq
Instagram: https://instagram.com/tulisan.ku.id
ini wm gw cok jan di hapus
*/

let handler = async (m, { conn, command, text, args, isOwner, isMods }) => {
    if (!isOwner && !isMods) throw 'Fitur ini hanya bisa digunakan oleh Owner atau Moderator!'
    
    if (!text) throw 'Nomor atau tag user tidak ditemukan!'
    
    let who
    if (m.isGroup) {
        who = m.mentionedJid[0] ? m.mentionedJid[0] : args[0] + '@s.whatsapp.net'
    } else {
        who = m.sender
    }

    let users = global.db.data.users
    let jum = args[1] ? parseInt(args[1]) : 1000
    
    if (!users[who]) throw 'User tidak ditemukan dalam database!'
    
    users[who].money += jum
    conn.reply(m.chat, `Sukses menambah money sebanyak ${jum} untuk @${who.split('@')[0]}`, m, { mentions: [who] })
}

handler.help = ['addmoney2']
handler.tags = ['owner']
handler.command = /^addmoney2(user)?$/i
handler.premium = false

export default handler