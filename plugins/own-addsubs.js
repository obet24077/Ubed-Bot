let handler = async (m, { conn, command, text, args }) => {

if (!text) throw 'nomor/tag!'
let t1 = text.split(' ')
let who
if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : t1[0] + '@s.whatsapp.net'
else who = m.sender

    let users = global.db.data.users
    let jumlah = t1[1] ? t1[1] : 250
    users[who]. subscribers += jumlah * 1
    conn.reply(m.chat, `sukses menambah limit sebanyak ${t1[1] ? t1[1] : 250} !`, m)
}
handler.help = ['addsubsribers']
handler.tags = ['owner']
handler.command = /^addsubscribers(user)?$/i
handler.owner = true

export default handler