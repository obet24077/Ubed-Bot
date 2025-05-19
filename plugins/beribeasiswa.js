let handler = async (m, { args, isROwner }) => {
  let sender = m.sender
  let user = db.data.users[sender]
  if (!user.sekolah || user.sekolah.peran !== 'guru')
    return m.reply('Fitur ini hanya untuk guru.')

  let mention = m.mentionedJid?.[0]
  let jumlah = parseInt(args[1])
  if (!mention || isNaN(jumlah)) return m.reply('Format: .beribeasiswa @murid [jumlah]')

  let murid = db.data.users[mention]
  if (!murid || murid.sekolah?.peran !== 'murid')
    return m.reply('Yang kamu beri beasiswa harus murid.')

  murid.money += jumlah

  m.reply(`Beasiswa sebesar Rp${jumlah.toLocaleString()} telah diberikan ke *${murid.name || mention.split('@')[0]}*.`)
}

handler.help = ['beribeasiswa @murid [jumlah]']
handler.tags = ['rpg']
handler.command = /^beribeasiswa$/i

export default handler