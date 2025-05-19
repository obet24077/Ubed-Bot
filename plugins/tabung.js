let handler = async (m, { conn, args }) => {
  let user = global.db.data.users[m.sender]
  let jumlah

  if (!args[0]) return m.reply(`Masukkan jumlah yang ingin ditabung.\nContoh: .tabung 10000 atau .tabung all`)

  if (/all/i.test(args[0])) {
    jumlah = user.eris
  } else {
    jumlah = parseInt(args[0].replace(/[^0-9]/g, '')) // hanya angka
    if (isNaN(jumlah)) return m.reply(`Masukkan jumlah yang valid!\nContoh: .tabung 50000`)
  }

  if (jumlah < 1000) return m.reply(`Minimal menabung adalah Rp.1000`)
  if (user.eris < jumlah) return m.reply(`Uang kamu tidak cukup untuk menabung Rp.${jumlah.toLocaleString()}`)

  // Eksekusi
  user.eris -= jumlah
  user.bank += jumlah

  conn.reply(m.chat, `✅ Berhasil menabung Rp.${jumlah.toLocaleString()}\n💸 Dompet: Rp.${user.eris.toLocaleString()}\n🏦 Bank: Rp.${user.bank.toLocaleString()}`, m)
}

handler.help = ['tabung <jumlah>', 'tabung all']
handler.tags = ['rpg']
handler.command = /^tabung|deposit|atm$/i

export default handler