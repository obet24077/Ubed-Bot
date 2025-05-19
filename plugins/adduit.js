let handler = async (m, { conn, text, args, isOwner }) => {
  if (!isOwner) return m.reply('❌ Hanya owner yang bisa menggunakan perintah ini.')

  let user = global.db.data.users[m.sender]
  let jumlah = parseInt(args[0]?.replace(/[^0-9]/g, ''))

  if (!jumlah || isNaN(jumlah)) return m.reply(`Masukkan jumlah yang valid.\nContoh: .addduit 100000`)
  if (jumlah < 1) return m.reply(`Jumlah minimal adalah 1`)

  user.eris += jumlah

  m.reply(`✅ Berhasil menambahkan Rp.${jumlah.toLocaleString()} ke saldo mu.\nTotal sekarang: Rp.${user.eris.toLocaleString()}`)
}

handler.help = ['addduit <jumlah>']
handler.tags = ['owner']
handler.command = /^addduit$/i
handler.owner = true

export default handler