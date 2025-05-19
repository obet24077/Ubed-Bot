import fs from 'fs'
import fetch from 'node-fetch'

let cooldowns = new Map()

let handler = async (m, { conn }) => {
    let user = m.sender
    let cooldownTime = 24 * 60 * 60 * 1000 // 1 hari dalam milidetik
    let lastUsed = cooldowns.get(user) || 0
    let now = Date.now()

    if (now - lastUsed < cooldownTime) {
        let remainingTime = ((cooldownTime - (now - lastUsed)) / 1000 / 60).toFixed(1)
        return conn.reply(m.chat, `⏳ Anda sudah mengklaim hadiah hari ini! Coba lagi dalam ${remainingTime} menit.`, m)
    }

    cooldowns.set(user, now)

    let reward = {
        money: 50000,
        limit: 10,
        exp: 4000
    }

    // Simpan data reward (sesuaikan dengan sistem ekonomi bot Anda)
    let userData = global.db.data.users[user]
    if (userData) {
        userData.money += reward.money
        userData.limit += reward.limit
        userData.exp += reward.exp
    }

    let msg = `🎉 *SELAMAT!* 🎉\n\nAnda mendapatkan:\n+ 💰 *${reward.money} Money*\n+ 🏅 *${reward.limit} Limit*\n+ 🌟 *${reward.exp} Exp*\n\n🔥 Terima kasih telah memuji admin!`
    await conn.reply(m.chat, msg, m)
}

handler.customPrefix = /^(admin ganteng|admin tampan|admin cantik)$/i
handler.command = new RegExp

export default handler