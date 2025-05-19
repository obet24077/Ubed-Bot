let handler = async (m, { args, conn }) => {
  if (args.length !== 1) {
    return conn.reply(m.chat, 'Silakan masukkan jumlah uang yang ingin diubah menjadi balance! Contoh: .moneytobalance 1000', m)
  }

  let money = parseInt(args[0])
  if (isNaN(money) || money <= 0) {
    throw 'Jumlah uang yang dimasukkan harus angka positif!'
  }

  let fee = Math.floor(money * 0.5)
  let balance = Math.floor(money * 0.5)

  let user = global.db.data.users[m.sender]

  if (!user) {
    user = { eris: 0, balance: 0 }
    global.db.data.users[m.sender] = user
  }

  if ((user.eris || 0) < money) {
    throw 'Uang kamu tidak cukup untuk dikonversi!'
  }

  user.eris -= money
  user.balance = (user.balance || 0) + balance

  global.db.write()

  let message = `• Kamu menconvert uang senilai Rp.${money.toLocaleString('en-US')}\n`
  message += `• Dan kamu mendapatkan balance (Ubed Coins) senilai ᴜ͢ᴄ.${balance.toLocaleString('en-US')}\n`
  message += `• Biaya fee kamu adalah Rp.${fee.toLocaleString('en-US')}`

  conn.reply(m.chat, message, m)
}

handler.help = ['moneytobalance *<amount>*']
handler.tags = ['rpg']
handler.command = /^moneytobalance$/i
handler.register = true
handler.limit = true

export default handler