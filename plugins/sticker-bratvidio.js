import https from "https"
import { sticker } from "../lib/sticker.js"

let handler = async (m, { conn, text }) => {
    if (!text) throw `Ubed tampan?`    

    try {
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

        
      

        let buffer = await IBuffer(`https://fastrestapis.fasturl.cloud/maker/brat/animated?text=${encodeURIComponent(text)}&mode=animated`)
        let stiker = await sticker(buffer, false, global.packname, global.author)

        if (stiker) {
            await conn.sendFile(m.chat, stiker, 'brat.webp', '', m)
            await conn.sendMessage(m.chat, { react: { text: '👍', key: m.key } }) 
        }
    } catch (e) {
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } }) 
        throw e
    }
}

handler.help = ["bratvid"]
handler.tags = ["sticker"]
handler.command = /^(bratvid)$/i
handler.limit = true
handler.premium = false

export default handler

async function IBuffer(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = []
            res.on('data', chunk => data.push(chunk))
            res.on('end', () => resolve(Buffer.concat(data)))
            res.on('error', reject)
        })
    })
}