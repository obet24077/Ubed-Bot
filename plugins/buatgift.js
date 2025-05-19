import { randomBytes } from 'crypto'

let handler = async (m, { conn, args, isOwner }) => {
  if (!isOwner) return conn.reply(m.chat, 'Perintah ini hanya bisa digunakan oleh Owner.', m)

  if (!args[0]) return conn.reply(m.chat, `Contoh penggunaan:\n.buatgift 2|5000|1500|3`, m)

  let [limit = 0, money = 0, exp = 0, potion = 0] = args[0].split('|').map(v => parseInt(v))

  if (isNaN(limit) || isNaN(money) || isNaN(exp) || isNaN(potion)) {
    return conn.reply(m.chat, 'Format salah. Gunakan: jumlahLimit|jumlahUang|jumlahExp|jumlahPotion\nContoh: .buatgift 2|5000|1500|3', m)
  }

  let kode = randomBytes(6).toString('hex').toUpperCase() // contoh: 3F2A7C9B015F
  global.db.data.giftcodes = global.db.data.giftcodes || {}

  global.db.data.giftcodes[kode] = {
    limit, money, exp, potion,
    creator: m.sender,
    claimed: false
  }

  return conn.reply(m.chat, `✅ Kode Gift berhasil dibuat!\n\n*Kode:* ${kode}\n*Limit:* ${limit}\n*Uang:* ${money}\n*Exp:* ${exp}\n*Potion:* ${potion}\n\nGunakan dengan: *.freegift ${kode}*`, m)
}

handler.help = ['buatgift <limit|money|exp|potion>']
handler.tags = ['owner']
handler.command = /^buatgift$/i
handler.owner = true

export default handler