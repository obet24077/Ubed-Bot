import fs from 'fs'
import path from 'path'

const dbFolder = './database'
const antiNofPath = path.join(dbFolder, 'antinofhilipina.json')

// Pastikan folder database ada
if (!fs.existsSync(dbFolder)) fs.mkdirSync(dbFolder, { recursive: true })

// Pastikan file JSON ada
if (!fs.existsSync(antiNofPath)) fs.writeFileSync(antiNofPath, '{}', 'utf-8')

const loadAntiNof = () => {
    try {
        return JSON.parse(fs.readFileSync(antiNofPath, 'utf-8')) || {}
    } catch (e) {
        return {}
    }
}

const saveAntiNof = (data) => fs.writeFileSync(antiNofPath, JSON.stringify(data, null, 4), 'utf-8')

let antiNofGroup = loadAntiNof()

let handler = async (m, { conn, args, isAdmin, isOwner }) => {
    if (!m.isGroup) return m.reply("❌ Fitur ini hanya untuk grup.")
    if (!(isAdmin || isOwner)) return m.reply("❌ Hanya admin yang bisa mengatur fitur ini.")

    if (!args[0]) return m.reply("Gunakan: .antinofhilipina on/off")

    if (args[0] === 'on') {
        antiNofGroup[m.chat] = true
        saveAntiNof(antiNofGroup)
        return m.reply("✅ *Anti Nomor Filipina diaktifkan di grup ini!*")
    } else if (args[0] === 'off') {
        delete antiNofGroup[m.chat]
        saveAntiNof(antiNofGroup)
        return m.reply("❌ *Anti Nomor Filipina dimatikan di grup ini!*")
    } else {
        return m.reply("⚠️ Pilih: on/off")
    }
}

// Cek saat ada yang join
handler.participantsUpdate = async ({ id, participants, action }, { conn }) => {
    if (action !== 'add') return
    if (!antiNofGroup[id]) return

    for (let user of participants) {
        if (user.startsWith('63')) {
            try {
                await conn.groupParticipantsUpdate(id, [user], 'remove')
                await conn.sendMessage(id, {
                    text: `❌ Nomor ${user} telah dikeluarkan dari grup karena terdeteksi berasal dari *Filipina* (+63).`,
                })
            } catch (err) {
                console.log(`Gagal mengeluarkan ${user}:`, err)
            }
        }
    }
}

handler.command = ['antinofhilipina']
handler.group = true
handler.admin = true

export default handler