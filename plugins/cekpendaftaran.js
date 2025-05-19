import db from '../lib/database.js'

let handler = async (m, { conn }) => {
  let user = db.data.users[m.sender]
  if (!user.sekolah || user.sekolah.peran !== 'guru') 
    return m.reply('Perintah ini hanya untuk guru.')

  let daftar = Object.entries(db.data.users).filter(([jid, data]) =>
    data.sekolah?.status === 'menunggu'
  )

  if (!daftar.length) return m.reply('Tidak ada permohonan pendaftaran murid.')

  let teks = '*Daftar Permohonan Masuk Sekolah:*\n\n'
  for (let [jid, data] of daftar) {
    teks += `• @${jid.split('@')[0]}\n  Ortu: @${data.sekolah.ortu.split('@')[0]}\n\n`
  }

  m.reply(teks, null, {
    mentions: daftar.map(([jid]) => jid).concat(daftar.map(([_, d]) => d.sekolah.ortu))
  })
}

handler.help = ['cekpendaftaran']
handler.tags = ['rpg']
handler.command = /^cekpendaftaran$/i

export default handler