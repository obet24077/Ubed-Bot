import https from "https"
import { sticker } from "../lib/sticker.js"

let handler = async (m, { conn, text }) => {
    if (!text) throw `ubed tampan?`

    try {
        // Menambahkan emoji "⏳" sebagai tanda bahwa bot sedang memproses
        await m.react("⏳")

        // Mengambil gambar dari API dan membuat stiker
        let buffer = await IBuffer(`https://api.autoresbot.com/api/maker/attp2?apikey=ubed2407&text=${encodeURIComponent(text)}`)
        let stiker = await sticker(buffer, false, global.packname, global.author)

        if (stiker) {
            await conn.sendFile(m.chat, stiker, 'brat.webp', '', m)
        }

        // Setelah selesai, proses penghapusan emoji atau menambahkan reaksi lain jika perlu
        // Biasanya, untuk bot WhatsApp, reaksi bisa tidak langsung dihapus, namun cukup memberikan feedback
        await m.react("✅") // Emoji selesai

    } catch (e) {
        throw e
    }
}

handler.help = ["attp3"]
handler.tags = ["sticker"]
handler.command = /^(attp3)$/i
handler.limit = false
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