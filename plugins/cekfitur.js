import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, text }) => {
    try {
        if (!text) throw 'Perintah tidak dikenali!'

        // Pastikan folder 'plugins' ada
        const pluginFolder = path.join(process.cwd(), 'plugins')
        
        if (!fs.existsSync(pluginFolder)) {
            throw 'Folder plugins tidak ditemukan!'
        }

        // Mendapatkan semua file dalam folder 'plugins'
        const pluginFiles = fs.readdirSync(pluginFolder).filter(file => file.endsWith('.js'))

        // Tentukan file yang digunakan berdasarkan perintah
        let usedFile = ''
        
        // Periksa apakah perintah yang dikirim cocok dengan file plugin yang ada
        let matchedFile = pluginFiles.find(file => new RegExp(`^${file.replace('.js', '')}$`, 'i').test(text))

        if (matchedFile) {
            usedFile = matchedFile
        } else {
            throw `Perintah "${text}" tidak dikenali untuk melacak file yang digunakan.`
        }

        // Menyimpan informasi file yang digunakan ke dalam file log
        fs.appendFileSync('./latestUsedFeature.log', `File yang digunakan: ${usedFile} pada ${new Date().toISOString()}\n`)

        // Jika perintah .cekfitur
        if (/^(cekfitur)$/i.test(text)) {
            // Baca file log untuk mengambil 5 file terakhir yang digunakan
            const logData = fs.readFileSync('./latestUsedFeature.log', 'utf8')
            const logs = logData.split('\n').filter(line => line).slice(-5)  // Ambil 5 log terakhir
            let message = '5 file terakhir yang digunakan:\n' + logs.join('\n')

            // Kirimkan hasil ke pengguna
            await conn.sendMessage(m.chat, message, { quoted: m })
        }

        // Proses sesuai perintah yang diberikan
        await processCommand(text, m, conn)

    } catch (e) {
        await conn.sendMessage(m.chat, `Terjadi kesalahan: ${e}`, { quoted: m })
    }
}

// Fungsi untuk memproses perintah sesuai dengan file plugin
async function processCommand(text, m, conn) {
    // Anda bisa menambahkan logika perintah di sini jika perlu
    await conn.sendMessage(m.chat, `Memproses perintah: ${text}`, { quoted: m })
}

handler.help = ['cekfitur']
handler.tags = ['utility']
handler.command = /^(cekfitur)$/i
handler.limit = true
handler.premium = false

export default handler