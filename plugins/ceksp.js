import db from '../lib/database.js'

let handler = async (m) => {
  let user = db.data.users[m.sender]
  user.bk = user.bk || { sp: 0, bannedUjianUntil: 0 }

  let banned = user.bk.bannedUjianUntil > Date.now()
  let status = banned ? `Kamu tidak bisa ikut ujian sampai ${new Date(user.bk.bannedUjianUntil).toLocaleString()}` : 'Kamu bisa ikut ujian.'

  m.reply(`Jumlah Surat Peringatan: *${user.bk.sp || 0}*\n${status}`)
}

handler.help = ['ceksp']
handler.tags = ['rpg']
handler.command = /^ceksp$/i

export default handler