let handler = async (m, { conn }) => {
  const cooldownPeriod = 365 * 24 * 60 * 60 * 1000 // 1 tahun
  const user = global.db.data.users[m.sender]

  if (!user) throw 'User tidak ditemukan di database.'

  const now = Date.now()
  const lastClaim = user.lastAddLimitMe || 0

  if (now - lastClaim < cooldownPeriod) {
    const remaining = cooldownPeriod - (now - lastClaim)
    const days = Math.floor(remaining / (24 * 60 * 60 * 1000))
    const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000))
    throw `❌ Kamu sudah klaim sebelumnya!\nCoba lagi dalam ${days} hari ${hours} jam ${minutes} menit.`
  }

  user.limit += 1000
  user.lastAddLimitMe = now

  await conn.reply(m.chat, `✅ Kamu berhasil mendapatkan +1000 limit!\nKlaim ini hanya bisa dilakukan 1 tahun sekali.`, m)
}

handler.help = ['addlimitme']
handler.tags = ['rpg']
handler.command = /^addlimitme$/i
handler.register = true

export default handler