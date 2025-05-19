import db from '../lib/database.js'

let handler = async (m, { conn, args, participants }) => {
  let user = db.data.users[m.sender]
  if (user.sekolah?.peran !== 'guru') return m.reply('Perintah ini hanya untuk guru.')

  let mentioned = m.mentionedJid && m.mentionedJid[0]
  if (!mentioned) return m.reply('Tag murid yang mau diberi soal.')
  if (!args[1]) return m.reply('Tuliskan soalnya. Contoh: .berikansoal @murid123 Soal Matematika: 10 + 5 = ?')

  let soal = args.slice(1).join(' ')
  let target = db.data.users[mentioned]
  if (!target) return m.reply('User tidak ditemukan.')

  if (!target.ujian) target.ujian = {}
  target.ujian.soal = soal
  target.ujian.jawaban = null
  target.ujian.nilai = null
  target.ujian.guru = m.sender
  target.ujian.waktu = +new Date()

  conn.reply(mentioned, `Kamu mendapatkan soal ujian dari gurumu:\n\n*${soal}*\n\nBalas dengan:\n.jawabujian JawabanKamu`, m)
  m.reply(`Soal berhasil diberikan.`)
}

handler.help = ['berikansoal @tag soal']
handler.tags = ['rpg']
handler.command = /^berikansoal$/i

export default handler