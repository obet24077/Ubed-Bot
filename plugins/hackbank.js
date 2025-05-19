let handler = async (m, { conn, usedPrefix, command, text }) => {
    let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.sender
    let targetingOther = who !== m.sender
    let user = global.db.data.users

    if (typeof user[who] == 'undefined') return m.reply('User tidak ditemukan di database.')

    // Fitur Lock Bank
    if (command === 'lockbank') {
        if (user[who].lockBank) return m.reply('Bank orang ini sudah terkunci!')
        user[who].lockBank = true
        user[who].lockBankCD = new Date().getTime()
        return conn.reply(m.chat, `Bank dari *${await conn.getName(who)}* berhasil dikunci!`, m)
    }

    // Fitur Unlock Bank (hanya bisa untuk diri sendiri)
    // Fitur Unlock Bank (khusus diri sendiri)
if (command === 'unlockbank') {
    if (targetingOther) {
        if (!user[who].lockBank) return m.reply(`Bank @${who.split('@')[0]} tidak terkunci.`, m, { mentions: [who] })
        
        let nama = await conn.getName(who)
        await conn.reply(m.chat, `Mencoba membuka kunci bank milik @${who.split('@')[0]}...`, m, { mentions: [who] })
        await delay(2000)
        return conn.reply(m.chat, `Bank @${who.split('@')[0]} keamanannya terlalu ketat! Kamu gagal membukanya.`, m, { mentions: [who] })
    }

    if (!user[m.sender].lockBank) return m.reply('Bank kamu tidak sedang terkunci.')
    user[m.sender].lockBank = false
    user[m.sender].lockBankCD = 0
    return conn.reply(m.chat, `Bank kamu berhasil dibuka kembali. Kamu bisa mengakses saldo bank sekarang.`, m)
}


    // Fitur Hack Bank (tetap sama seperti sebelumnya)
    if (command === 'hackbank') {
        if (user[who].lockBank) return m.reply('Bank orang ini terkunci, tidak bisa dihack!')
        if (user[who].bank < 1000000) return m.reply('Saldo bank orang tersebut tidak mencukupi')
        if (new Date - user[who].lockBankCD < 36000000) return m.reply(`Bank orang tersebut terkunci selama ${getTime(36000000, user[who].lockBankCD)}`)
        if (new Date - user[m.sender].lasthackbank < 10800000) return conn.reply(m.chat, `Anda sudah menjebol bank hari ini, cooldown ${getTime(10800000, user[m.sender].lasthackbank)}`, m)
        if (user[m.sender].level < user[who].level) return m.reply('Level kamu kurang untuk hack bank dia')

        let dapat = Math.floor(Math.random() * 1000000)
        let caption = [
            'Please enter the password and user',
            'Login *****',
            'Password ******',
            `Berhasil masuk ke sistem ${await conn.getName(who)}`,
            `Mengambil *${toRupiah(dapat)} Money* ${global.rpg.emoticon("money")}`,
            'Logout ******',
            `Berhasil mendapatkan *${toRupiah(dapat)} Money* ${global.rpg.emoticon("money")} dari bank user`
        ]
        user[who].bank -= dapat
        user[m.sender].money += dapat
        user[m.sender].lasthackbank = new Date() * 1

        let { key } = await m.reply('Sedang mencoba menjebol sistem...')
        for (let cap of caption) {
            await conn.sendMessage(m.chat, { text: cap, edit: key })
            await delay(2000)
        }
    }
}

handler.help = ['lockbank', 'unlockbank', 'hackbank']
handler.tags = ['rpg']
handler.command = ['lockbank', 'unlockbank', 'hackbank']
handler.rpg = true
handler.group = true

export default handler

const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(resolve, ms))

function getTime(cooldown, date) {
    let __timers = (new Date - date)
    let _timers = (cooldown - __timers)
    let timers = clockString(_timers)
    return timers
}

function clockString(ms) {
    let h = Math.floor(ms / 3600000)
    let m = Math.floor(ms / 60000) % 60
    let s = Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

const toRupiah = number => parseInt(number).toLocaleString().replace(/,/gi, ".")