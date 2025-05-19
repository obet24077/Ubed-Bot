import db from '../lib/database.js'
import { randomInt } from '../lib/func.js'

let handler = async (m) => {
  let user = db.data.users[m.sender]
  if (!user.sekolah || user.sekolah.peran !== 'murid')
    return m.reply('Kamu bukan murid di Sekolah Ubed.')

  let tugas = db.data.sekolahUbed?.tugasAktif
  if (!tugas) return m.reply('Tidak ada tugas yang aktif.')

  if (user.sekolah.terakhirKumpul === tugas.dibuat)
    return m.reply('Kamu sudah mengumpulkan tugas ini.')

  // Simulasi nilai
  let nilai = randomInt(60, 100)
  user.sekolah.terakhirKumpul = tugas.dibuat
  user.sekolah.nilaiUjian = nilai

  // Hadiah
  let money = randomInt(10000, 10000000)
  let exp = randomInt(500, 9999)
  user.money += money
  user.exp += exp

  m.reply(`Tugas berhasil dikumpulkan!\nKamu mendapatkan nilai *${nilai}*\n\n+Rp${money.toLocaleString()} dan +${exp} exp`)
}

handler.help = ['kumpultugas']
handler.tags = ['rpg']
handler.command = /^kumpultugas$/i

export default handler