import fetch from 'node-fetch'

let timeout = 180000
let eris = 5000
let limit = 1
let balance = 15
let handler = async (m, { conn, usedPrefix }) => {
    conn.susunkata = conn.susunkata ? conn.susunkata : {}
    let id = m.chat
    if (id in conn.susunkata) {
        conn.reply(m.chat, ' *Masih Ada Soal Yang Belu Terjawab* ', conn.susunkata[id][0])
        throw false
    }
    let src = await (await fetch('https://raw.githubusercontent.com/BochilTeam/database/master/games/susunkata.json')).json()
    let json = src[Math.floor(Math.random() * src.length)]
    let caption = `
${json.soal}

Tipe : ${json.tipe}
Timeout *${(timeout / 1000).toFixed(2)} detik*
Ketik ${usedPrefix}suska untuk bantuan
Bonus: ${eris} Money
Limit: ${limit} Limit
Balance: ${balance} Balance
`.trim()
    conn.susunkata[id] = [
        await conn.reply(m.chat, caption, m),
        json, eris,
        setTimeout(() => {
            if (conn.susunkata[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.susunkata[id][0])
            delete conn.susunkata[id]
        }, timeout)
    ]
}
handler.help = ['susunkata']
handler.tags = ['game']
handler.command = /^susunkata|sskata/i
handler.limit = true
handler.group = true

export default handler