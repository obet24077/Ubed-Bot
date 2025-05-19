import fs from 'fs'

let handler = async (m, { conn, args }) => {
    if (!args[0]) return m.reply('⚠️ Masukkan kode yang ingin digunakan!\nContoh: `.reedem hbafd21`')

    // Baca database kode redeem
    let data = JSON.parse(fs.readFileSync("./plugins/database/codereedem.json", "utf-8"))
    let kodeData = data.find(c => c.code === args[0])

    if (!kodeData) return m.reply('❌ Tidak Ada Kode Seperti itu\nHarap Huruf Kecil & Besar sama!!')

    // Cek apakah user sudah menggunakan kode ini sebelumnya
    if (kodeData.usedBy.includes(m.sender)) {
        return m.reply('❌ Anda sudah pernah menggunakan kode ini!')
    }

    let user = db.data.users[m.sender]

    // **Sistem Random** untuk money, exp, dan limit
    let moneyChance = Math.random() * 100;
    let expChance = Math.random() * 100;
    let limitChance = Math.random() * 100;

    // Random untuk money (10000-2000000, dengan 30% kemungkinan mendapatkan >700000)
    let money = 0;
    if (moneyChance <= 30) {
        money = pickRandom([700000, 1000000, 1500000, 2000000]);
    } else {
        money = pickRandom([10000, 30000, 50000, 100000, 200000, 300000, 500000]);
    }

    // Random untuk exp (400-4999, dengan 30% kemungkinan mendapatkan >1000)
    let exp = 0;
    if (expChance <= 30) {
        exp = pickRandom([1000, 2000, 3000, 4000, 4999]);
    } else {
        exp = pickRandom([400, 500, 600, 700, 800, 900, 1000]);
    }

    // Random untuk limit (10-9999, dengan 30% kemungkinan mendapatkan >100)
    let limit = 0;
    if (limitChance <= 30) {
        limit = pickRandom([100, 200, 500, 1000, 2000, 3000, 5000, 7000, 9999]);
    } else {
        limit = pickRandom([10, 20, 30, 50, 70, 100, 150]);
    }

    // Tambahkan money, exp, dan limit ke user
    user.money += money;
    user.exp += exp;
    user.limit += limit;

    // Simpan user yang sudah klaim kode ini
    kodeData.remaining -= 1
    kodeData.usedBy.push(m.sender)

    // Hapus kode jika sudah dipakai 10 orang
    if (kodeData.remaining <= 0) {
        data = data.filter(c => c.code !== args[0]) // Hapus kode dari database
    }

    // Simpan perubahan
    fs.writeFileSync("./plugins/database/codereedem.json", JSON.stringify(data, null, 2))

    // Beri respon ke user
    m.reply(`🎉 **Selamat!**\nAnda mendapatkan:\n- **${money} money**\n- **${exp} exp**\n- **${limit} limit** dari kode redeem!`)
}

handler.help = ['reedemkode']
handler.tags = ['rpg']
handler.command = /^(reedemkode|redeem)$/i

export default handler

function pickRandom(list) {
    return list[Math.floor(list.length * Math.random())]
}