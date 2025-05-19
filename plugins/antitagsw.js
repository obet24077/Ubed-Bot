import fs from 'fs'
import path from 'path'
import { areJidsSameUser } from '@adiwajshing/baileys'

const dbFolder = './database'
const antiTagSWPath = path.join(dbFolder, 'antitagsw.json')

if (!fs.existsSync(dbFolder)) fs.mkdirSync(dbFolder, { recursive: true })
if (!fs.existsSync(antiTagSWPath)) fs.writeFileSync(antiTagSWPath, '{}', 'utf-8')

const loadAntiTagSW = () => {
    try {
        return JSON.parse(fs.readFileSync(antiTagSWPath, 'utf-8')) || {}
    } catch (e) {
        return {}
    }
}

const saveAntiTagSW = (data) => fs.writeFileSync(antiTagSWPath, JSON.stringify(data, null, 4), 'utf-8')

let antiTagSWGroup = loadAntiTagSW()

let handler = async (m, { conn, args, isAdmin, isOwner }) => {
    if (!m.isGroup) return m.reply("❌ Fitur ini hanya bisa digunakan di grup.")
    if (!(isAdmin || isOwner)) return m.reply("❌ Hanya admin yang bisa mengaktifkan fitur ini.")
    if (!args[0]) return m.reply("⚠️ Gunakan: .antitagsw on/off")

    if (args[0] === "on") {
        antiTagSWGroup[m.chat] = true
        saveAntiTagSW(antiTagSWGroup)
        return m.reply("✅ *Anti Tag WA & Auto Kick +63/+66 AKTIF di grup ini!*")
    } else if (args[0] === "off") {
        delete antiTagSWGroup[m.chat]
        saveAntiTagSW(antiTagSWGroup)
        return m.reply("❌ *Anti Tag WA & Auto Kick +63/+66 DIMATIKAN di grup ini!*")
    } else {
        return m.reply("⚠️ Pilih: on/off")
    }
}

// DETEKSI TAG STATUS WA DAN BERI WARN
handler.before = async (m, { conn }) => {
    if (!m.isGroup || !antiTagSWGroup[m.chat]) return
    if (!m.message?.groupStatusMentionMessage) return

    let sender = m.sender
    let groupMetadata = await conn.groupMetadata(m.chat)
    let botNumber = conn.user.jid.replace(/:\d+@/g, '@')
    let isBotAdmin = groupMetadata.participants.some(p => p.id === botNumber && p.admin)

    if (!isBotAdmin) {
        await conn.sendMessage(m.chat, { text: "⚠️ Bot bukan admin, tidak bisa hapus & kick pelanggar." })
        return
    }

    await conn.sendMessage(m.chat, { delete: m.key })

    global.db.data.users[sender] = global.db.data.users[sender] || {}
    global.db.data.users[sender].warn2 = global.db.data.users[sender].warn2 || 0
    global.db.data.users[sender].warn2 += 1

    if (global.db.data.users[sender].warn2 >= 10) {
        await conn.sendMessage(m.chat, {
            text: `⛔ @${sender.split('@')[0]} kena 10 *WARN* karena tag status WA!`,
            mentions: [sender]
        })
        await conn.groupParticipantsUpdate(m.chat, [sender], 'remove')
        global.db.data.users[sender].warn2 = 0
    } else {
        await conn.sendMessage(m.chat, {
            text: `⚠️ @${sender.split('@')[0]} jangan tag status WA!\n*WARN: ${global.db.data.users[sender].warn2}/10*`,
            mentions: [sender]
        })
    }
}

// AUTO KICK NOMOR +63 / +66 SAAT JOIN
handler.groupParticipantsUpdate = async (update, conn) => {
    if (!update || !update.id || !update.participants || update.action !== 'add') return
    if (!antiTagSWGroup[update.id]) return

    const groupId = update.id
    const groupMetadata = await conn.groupMetadata(groupId)
    const botNumber = conn.user.jid.replace(/:\d+@/g, '@')
    const isBotAdmin = groupMetadata.participants.some(p => p.id === botNumber && p.admin)

    if (!isBotAdmin) return

    for (let user of update.participants) {
        let nomor = user.split('@')[0]
        if ((nomor.startsWith('63') || nomor.startsWith('66')) && !areJidsSameUser(user, conn.user.id)) {
            try {
                await conn.groupParticipantsUpdate(groupId, [user], 'remove')
                await conn.sendMessage(groupId, {
                    text: `❌ Pengguna @${nomor} dengan nomor +63/+66 telah dikeluarkan otomatis.`,
                    mentions: [user]
                })
                await delay(1_000)
            } catch (e) {
                console.error(`Gagal mengeluarkan ${user}:`, e)
            }
        }
    }
}

const delay = (ms) => new Promise(res => setTimeout(res, ms))

handler.command = ['antitagsw']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler