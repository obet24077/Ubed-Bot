let handler = async (m, { args }) => {
  let user = db.data.users[m.sender]
  if (!user.sekolah || user.sekolah.peran !== 'ortu')
    return m.reply('Fitur ini hanya untuk orang tua.')

  let anak = Object.entries(db.data.users).find(([_, u]) => u.sekolah?.ortu === m.sender)
  if (!anak) return m.reply('Kamu belum punya anak di sekolah.')

  let [jid, anakData] = anak

  const biayaSPP = 100000
  if (user.money < biayaSPP) return m.reply('Uangmu tidak cukup untuk membayar SPP.')

  user.money -= biayaSPP
  anakData.sekolah.spp = (anakData.sekolah.spp || 0) + biayaSPP

  m.reply(`Kamu telah membayar SPP sebesar Rp${biayaSPP.toLocaleString()} untuk anakmu *${anakData.name || jid.split('@')[0]}*.`)
}

handler.help = ['bayarspp']
handler.tags = ['rpg']
handler.command = /^bayarspp$/i

export default handler