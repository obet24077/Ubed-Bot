import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    let [title, ...textParts] = args.join(" ").split('|')
    if (!title || textParts.length === 0) {
      return m.reply(`⚠️ *Format salah!*\n\n📌 *Contoh:* ${usedPrefix + command} Tanya aku|Siapakah aku?`)
    }
    let text = textParts.join('|')

    await conn.sendMessage(m.chat, { react: { text: '✉️', key: m.key } })

    let url = `https://api.ubed.my.id/maker/NGL?apikey=ubed2407&title=${encodeURIComponent(title)}&text=${encodeURIComponent(text)}`
    let res = await fetch(url)
    if (!res.ok) return m.reply('⚠️ *Gagal mendapatkan gambar!*')

    let buffer = await res.buffer()

    await conn.sendMessage(m.chat, { image: buffer, caption: `🧾 *NGL Message*\n\n📌 *${title}*\n💬 ${text}` }, { quoted: m })
  } catch (e) {
    console.error(e)
    m.reply(`❌ *Terjadi Kesalahan!*\n\n${e.message}`)
  }
}

handler.help = ['ngl <judul>|<teks>']
handler.tags = ['maker']
handler.command = /^ngl$/i
handler.premium = false
handler.register = true

export default handler