let handler = async (m) => {
  let user = db.data.users[m.sender]
  let role = user.sekolah?.peran

  if (role === 'murid') {
    let spp = user.sekolah?.spp || 0
    m.reply(`*Status Keuangan*\n• Uang: Rp${user.money.toLocaleString()}\n• SPP Dibayar: Rp${spp.toLocaleString()}`)
  } else if (role === 'ortu') {
    let anak = Object.entries(db.data.users).find(([_, u]) => u.sekolah?.ortu === m.sender)
    if (!anak) return m.reply('Kamu belum punya anak terdaftar.')
    let [_, anakData] = anak
    let spp = anakData.sekolah?.spp || 0
    m.reply(`*Keuangan Anakmu*\n• Nama: ${anakData.name}\n• Uang: Rp${anakData.money.toLocaleString()}\n• SPP Dibayar: Rp${spp.toLocaleString()}`)
  } else {
    m.reply('Fitur ini hanya bisa diakses oleh murid atau orang tua.')
  }
}

handler.help = ['cekkeuangan']
handler.tags = ['rpg']
handler.command = /^cekkeuangan$/i

export default handler