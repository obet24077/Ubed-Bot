// wm ubed bot

const handler = async (m, { conn }) => {
  const user = global.db.data.users[m.sender]

  if (!user || typeof user.balance !== 'number') {
    return m.reply('⚠️ Data tidak ditemukan atau kamu belum memiliki saldo.')
  }

  const balanceFormatted = user.balance.toLocaleString('en-US')

  const teks = `
╭───〔 *U B E D  C O I N S* 〕───⬣
│
│ 🪙 *Saldo Anda Saat Ini:*
│    _ᴜ͢ᴄ.${balanceFormatted}_
│
│ Gunakan untuk:
│ • Bertarung
│ • Berdagang
│ • Menikah
│ • Main game seru!
│
╰────────────────────────⬣
`.trim()

  await conn.reply(m.chat, teks, m)
}

handler.help = ['ubedcoins']
handler.tags = ['info']
handler.command = /^ubedcoins$/i

export default handler