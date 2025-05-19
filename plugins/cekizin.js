let handler = async (m) => {
  let list = Object.entries(db.data.users).filter(([_, u]) => u.izin?.valid)
  if (!list.length) return m.reply('Tidak ada surat izin yang masuk.')

  let teks = '*Daftar Murid yang Izin:*\n\n'
  for (let [jid, u] of list) {
    teks += `• *${u.name || jid.split('@')[0]}* - ${u.izin.alasan}\n`
  }

  m.reply(teks)
}

handler.help = ['cekizin']
handler.tags = ['rpg']
handler.command = /^cekizin$/i

export default handler