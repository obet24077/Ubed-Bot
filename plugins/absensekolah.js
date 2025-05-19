import db from '../lib/database.js'
import moment from 'moment-timezone'

let handler = async (m) => {
  let user = db.data.users[m.sender]
  if (!user.sekolah || user.sekolah.peran !== 'murid' || user.sekolah.status !== 'terdaftar')
    return m.reply('Kamu belum terdaftar sebagai murid di Sekolah Ubed.')

  let now = moment().tz('Asia/Jakarta')
  let lastAbsen = user.sekolah.lastAbsen || 0

  if (now.diff(moment(lastAbsen), 'hours') < 24)
    return m.reply('Kamu sudah absen hari ini. Coba lagi besok.')

  user.sekolah.lastAbsen = now.valueOf()

  let money = Math.floor(Math.random() * (10000000 - 10000 + 1)) + 10000
  let exp = Math.floor(Math.random() * (9999 - 500 + 1)) + 500

  user.money += money
  user.exp += exp

  m.reply(`Absen berhasil!\nKamu mendapatkan:\n+ Rp${money.toLocaleString()}\n+ ${exp} exp`)
}

handler.help = ['absensekolah']
handler.tags = ['rpg']
handler.command = /^absensekolah$/i

export default handler