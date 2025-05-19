let handler = async (m, { conn, command, args }) => {
    let user = global.db.data.users[m.sender]

    if (!user.premium) throw 'Fitur ini hanya dapat digunakan oleh pengguna Premium!'
    
    // Batas 2x per hari
    const now = new Date()
    const today = now.toDateString()

    if (!user.last_addmoney || user.last_addmoney !== today) {
        user.last_addmoney = today
        user.addmoney_count = 0
    }

    if (user.addmoney_count >= 2) throw 'Kamu sudah mencapai batas *2x penggunaan addmoney hari ini*. Coba lagi besok.'

    let jumlah = args[0] ? parseInt(args[0]) : 1000
    if (isNaN(jumlah)) throw 'Jumlah money tidak valid!'
    if (jumlah <= 0) throw 'Jumlah harus lebih dari 0!'

    let batasMax = 5000_000_000
    if (user.money >= batasMax) throw 'Kamu sudah mencapai batas maksimal money (5000.000.000), tidak bisa menambah lagi.'
    
    if (user.money + jumlah > batasMax) {
        jumlah = batasMax - user.money // Biar tidak melewati batas
    }

    user.money += jumlah
    user.addmoney_count += 1

    conn.reply(m.chat, `Berhasil menambahkan *${jumlah.toLocaleString()}* money ke akunmu. Total sekarang: *${user.money.toLocaleString()}*.\n\nSisa penggunaan hari ini: *${2 - user.addmoney_count}x*`, m)
}

handler.help = ['addmoneyprem']
handler.tags = ['premium']
handler.command = /^addmoneyprem$/i
handler.premium = true

export default handler