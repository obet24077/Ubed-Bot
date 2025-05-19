import db from '../lib/database.js'
import { randomInt } from '../lib/func.js'

let handler = async (m, { conn }) => {
  let user = db.data.users[m.sender]
  if (!user.sekolah || user.sekolah.peran !== 'murid') return m.reply('Kamu bukan murid.')

  let ujian = db.data.sekolahUbed?.ujianAktif
  if (!ujian) return m.reply('Tidak ada ujian aktif saat ini.')

  if (user.sekolah.ikutUjian === ujian.nama)
    return m.reply('Kamu sudah mengikuti ujian ini.')

  user.sekolah.ikutUjian = ujian.nama

  // Kirim soal satu per satu
  let benar = 0
  for (let i = 0; i < ujian.soal.length; i++) {
    await m.reply(`Soal ${i + 1}:\n${ujian.soal[i].pertanyaan}`)

    let jawab = await conn.waitForMessage(m.chat, m.sender, 30_000)
    if (!jawab) {
      await m.reply('Waktu habis.')
      break
    }

    if (jawab.text.trim() === ujian.soal[i].jawaban.trim()) {
      benar++
      await m.reply('Benar!')
    } else {
      await m.reply(`Salah. Jawaban benar: *${ujian.soal[i].jawaban}*`)
    }
  }

  // Nilai akhir
  let nilai = Math.round((benar / ujian.soal.length) * 100)
  user.sekolah.nilaiUjian = nilai

  // Reward
  let money = randomInt(10000, 10000000)
  let exp = randomInt(500, 9999)
  user.money += money
  user.exp += exp

  m.reply(`Ujian selesai!\nNilaimu: *${nilai}*\n+Rp${money.toLocaleString()} dan +${exp} exp`)
}

handler.help = ['ikutujian']
handler.tags = ['rpg']
handler.command = /^ikutujian$/i

export default handler