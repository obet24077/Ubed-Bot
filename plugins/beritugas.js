import db from '../lib/database.js'

let handler = async (m, { args, text }) => {
  let user = db.data.users[m.sender]
  if (!user.sekolah || user.sekolah.peran !== 'guru')
    return m.reply('Hanya guru yang bisa memberi tugas.')

  if (!text) return m.reply('Tulis deskripsi tugasnya!\nContoh: .beritugas Kerjakan PR Matematika halaman 30.')

  if (!db.data.sekolahUbed) db.data.sekolahUbed = {}
  db.data.sekolahUbed.tugasAktif = {
    deskripsi: text,
    dibuat: new Date(),
    oleh: m.sender
  }

  m.reply(`Tugas berhasil dibuat dan dikirim ke semua murid!\n\n*Tugas:*\n${text}`)
}

handler.help = ['beritugas <deskripsi>']
handler.tags = ['rpg']
handler.command = /^beritugas$/i

export default handler