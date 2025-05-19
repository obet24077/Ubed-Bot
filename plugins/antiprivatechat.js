// * wm ubed bot */

import fs from 'fs'
import path from 'path'

const dbFolder = './database'
const antiPrivatePath = path.join(dbFolder, 'antiprivate.json')

if (!fs.existsSync(dbFolder)) fs.mkdirSync(dbFolder, { recursive: true })
if (!fs.existsSync(antiPrivatePath)) fs.writeFileSync(antiPrivatePath, JSON.stringify({ active: false }, null, 4))

const loadAntiPrivate = () => {
    try {
        return JSON.parse(fs.readFileSync(antiPrivatePath, 'utf-8')) || {}
    } catch (e) {
        return {}
    }
}
const saveAntiPrivate = (data) => fs.writeFileSync(antiPrivatePath, JSON.stringify(data, null, 4), 'utf-8')

let antiPrivate = loadAntiPrivate()

let handler = async (m, { conn, args, isOwner }) => {
    if (!isOwner) return m.reply('❌ Hanya owner yang bisa mengaktifkan/mematikan fitur ini!')
    if (!args[0]) return m.reply('⚠️ Gunakan perintah: .antiprivatechat on / off')

    if (args[0] === 'on') {
        antiPrivate.active = true
        saveAntiPrivate(antiPrivate)
        m.reply('🍏 Fitur *Anti Private Chat* telah AKTIF.\nSekarang hanya *owner* dan *premium* yang bisa akses private chat.\n> Ubed Bot 2025')
    } else if (args[0] === 'off') {
        antiPrivate.active = false
        saveAntiPrivate(antiPrivate)
        m.reply('❌ Fitur *Anti Private Chat* telah DINONAKTIFKAN.')
    } else {
        m.reply('⚠️ Pilih: on / off')
    }
}

// BEFORE: Hanya Owner dan Premium yang boleh akses Private Chat
handler.before = async (m, { conn, isOwner }) => {
    if (!antiPrivate.active) return
    if (m.isGroup) return

    let user = global.db.data.users[m.sender]
    if (isOwner || (user && user.premium)) return // Izinkan owner dan premium

    if (user && !user.banned) {
        user.banned = true
        // Tidak kirim pesan sama sekali
    }
    return !0 // Hentikan semua plugin
}

handler.command = ['antiprivatechat']
handler.owner = true

export default handler