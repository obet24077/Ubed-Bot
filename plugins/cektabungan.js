let handler = async (m) => {
  let user = db.data.users[m.sender]
  if (user.sekolah?.peran !== 'murid') return m.reply('Hanya murid yang punya tabungan.')

  let tabungan = user.sekolah.tabungan || 0
  m.reply(`*Tabunganmu Saat Ini:* Rp${tabungan.toLocaleString()}`)
}

handler.help = ['cektabungan']
handler.tags = ['rpg']
handler.command = /^cektabungan$/i

export default handler