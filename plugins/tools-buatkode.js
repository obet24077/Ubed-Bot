import fs from 'fs'
import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
    let kodeBaru = generateRandomCode(8) // Buat kode acak
    let dbPath = "./plugins/database/codereedem.json"

    // **Baca database kode redeem**
    let data = fs.existsSync(dbPath) ? JSON.parse(fs.readFileSync(dbPath)) : []

    // **Simpan kode baru (bisa dipakai 10x)**
    data.push({ code: kodeBaru, remaining: 10, usedBy: [] })
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))

    let apiUrl = `https://beforelife.me/api/maker/captcha?key=${kodeBaru}&image=https://a.top4top.io/p_29537b1he1.jpg&apikey=ubed2407`

    try {
        let response = await fetch(apiUrl)
        if (!response.ok) throw new Error(`❌ Gagal mendapatkan gambar dari API!`)

        let buffer = await response.buffer()

        await conn.sendMessage(m.chat, {
            image: buffer,
            caption: `✅ **Kode berhasil dibuat!**\n📌 Kode: \`${kodeBaru}\`\n👥 Bisa digunakan **10 orang**`
        }, { quoted: m })
    } catch (e) {
        console.error(`[ERROR]`, e)
        await conn.sendMessage(m.chat, { text: '❌ Terjadi kesalahan saat mengambil gambar kode!' }, { quoted: m })
    }
}

handler.help = ['buatkode']
handler.tags = ['rpg']
handler.command = /^(buatkode|createredeem)$/i
handler.owner = true // **Owner bot saja yang bisa pakai**

export default handler

function generateRandomCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
}