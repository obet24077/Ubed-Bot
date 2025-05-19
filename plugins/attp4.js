import https from "https"
import { sticker } from "../lib/sticker.js"

let handler = async (m, { conn, text }) => {
    if (!text) throw `Tolong masukkan teks!`

    try {
        // Ambil apikey dari plugin sebelumnya
        const apiKey = 'ubed2407'; // Ganti dengan apikey yang sesuai jika perlu
        
        // Menambahkan emoji "⏳" untuk menandakan bahwa bot sedang memproses
        await m.react("⏳")

        // Mengambil gambar dari API dan membuat stiker
        let buffer = await IBuffer(`https://api.autoresbot.com/api/maker/attp?apikey=${apiKey}&text=${encodeURIComponent(text)}`)
        let stiker = await sticker(buffer, false, global.packname, global.author)

        if (stiker) {
            await conn.sendFile(m.chat, stiker, 'brat.webp', '', m)
        }

        // Setelah selesai, menambahkan emoji selesai "✅"
        await m.react("✅")

    } catch (e) {
        throw e
    }
}

handler.help = ["attp4"]
handler.tags = ["sticker"]
handler.command = /^(attp4)$/i
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