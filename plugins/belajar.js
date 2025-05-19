import db from '../lib/database.js'

let handler = async (m) => {
  let user = db.data.users[m.sender]
  if (!user.sekolah || user.sekolah.peran !== 'murid' || user.sekolah.status !== 'terdaftar')
    return m.reply('Kamu belum terdaftar sebagai murid di Sekolah Ubed.')

  let money = Math.floor(Math.random() * (10000000 - 10000 + 1)) + 10000
  let exp = Math.floor(Math.random() * (9999 - 500 + 1)) + 500

  user.money += money
  user.exp += exp

  m.reply(`Kamu belajar dengan giat dan mendapatkan:\n+ Rp${money.toLocaleString()}\n+ ${exp} exp`)
}

handler.help = ['belajar']
handler.tags = ['rpg']
handler.command = /^belajar$/i

export default handler