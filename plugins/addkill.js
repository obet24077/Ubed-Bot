import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const killerDatabasePath = path.join(__dirname, '../database/killerDatabase.json')

function loadData(filePath) {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath)
        return JSON.parse(data)
    }
    return {}
}

function saveData(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

const getUserName = (jid) => {
    const user = global.db.data.users[jid] || {}
    return user.name || jid.split('@')[0]
}

let handler = async (m, { conn, text }) => {
    if (!m.isGroup) return m.reply('Perintah ini hanya bisa digunakan di grup.')
    if (!m.mentionedJid[0]) return m.reply('Tag siapa yang mau ditambah kill-nya.')

    const args = text.trim().split(' ')
    const target = m.mentionedJid[0]
    const amount = parseInt(args[args.length - 1]) || 1

    if (isNaN(amount)) return m.reply('Contoh: .addkill @user 5')

    let killerDatabase = loadData(killerDatabasePath)

    if (!killerDatabase[target]) {
        killerDatabase[target] = { kills: 0, deaths: 0 }
    }

    killerDatabase[target].kills += amount
    saveData(killerDatabasePath, killerDatabase)

    m.reply(`✅ Kill untuk *${getUserName(target)}* berhasil ditambah *${amount}x*.\nTotal sekarang: *${killerDatabase[target].kills} kill*`)
}

handler.help = ['addkill @tag jumlah']
handler.tags = ['owner']
handler.command = /^addkill$/i
handler.owner = true

export default handler