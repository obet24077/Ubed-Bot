import fs from 'fs'

let handler = async (m, { args }) => {
    if (!args[0]) return m.reply('⚠️ Masukkan kode yang ingin digunakan!\nContoh: `.redeem hbafd21`')

    // Cek apakah user sudah klaim kode ini
    let dbPath = "./plugins/database/codereedem.json"
    let claimPath = `./plugins/database/userclaim/${m.sender}.json`
    let data = fs.existsSync(dbPath) ? JSON.parse(fs.readFileSync(dbPath)) : []

    let kodeIndex = data.findIndex(k => k.code === args[0])
    if (kodeIndex === -1) return m.reply('❌ Kode tidak ditemukan atau sudah habis!')

    let kodeData = data[kodeIndex]

    // Cek apakah user sudah pernah menggunakan kode ini
    if (kodeData.usedBy.includes(m.sender)) return m.reply('❌ Anda sudah pernah menggunakan kode ini!')

    let user = db.data.users[m.sender]
    let chance = Math.random() * 100
    let jumlah = chance <= 80 ? pickRandom([30, 70, 77, 88, 100, 200, 333, 500]) : pickRandom([1000, 2000, 4000, 5000, 7000, 10000])

    user.limit += jumlah * 1 // Tambahkan limit

    // Update kode redeem
    kodeData.remaining -= 1
    kodeData.usedBy.push(m.sender)
    if (kodeData.remaining <= 0) data.splice(kodeIndex, 1)

    // Simpan perubahan
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
    fs.writeFileSync(claimPath, JSON.stringify({ status: 'telah claim code' }))

    m.reply(`🎉 **Selamat!**\nAnda mendapatkan **${jumlah} limit** dari kode redeem!`)
}

handler.help = ['redeem']
handler.tags = ['rpg']
handler.command = /^(redeem|reedemkode|reedem)$/i

export default handler

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}