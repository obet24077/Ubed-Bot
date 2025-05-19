import db from '../lib/database.js'

let handler = async (m) => {
  let user = db.data.users[m.sender]
  if (user.sekolah?.peran !== 'murid') return m.reply('Kamu harus menjadi murid untuk cek beasiswa.')

  if (!user.ujian?.nilai) return m.reply('Kamu belum dinilai dalam ujian.')

  if (user.ujian.nilai >= 85) {
    let hadiahMoney = Math.floor(Math.random() * (10000000 - 10000 + 1)) + 10000
    let hadiahExp = Math.floor(Math.random() * (9999 - 500 + 1)) + 500
    user.money = (user.money || 0) + hadiahMoney
    user.exp = (user.exp || 0) + hadiahExp

    m.reply(`Selamat! Kamu mendapatkan *Beasiswa Otomatis* karena nilai ujianmu *${user.ujian.nilai}*.\n\n+Rp${hadiahMoney.toLocaleString()}\n+${hadiahExp} XP`)
  } else {
    m.reply(`Nilaimu ${user.ujian.nilai}. Sayangnya belum memenuhi syarat beasiswa otomatis (minimal 85).`)
  }
}

handler.help = ['beasiswaauto']
handler.tags = ['rpg']
handler.command = /^beasiswaauto$/i

export default handler