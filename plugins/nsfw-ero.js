import axios from 'axios'

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    await conn.sendMessage(m.chat, { react: { text: '🍑', key: m.key } })

    const res = await axios.get('https://api.lolhuman.xyz/api/random/nsfw/ero?apikey=ubed2407', {
      responseType: 'arraybuffer'
    })

    const buffer = res.data

    await conn.sendMessage(m.chat, {
      image: buffer,
      caption: '🔞 Gambar ero untukmu~',
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
  } catch (e) {
    console.error(e)
    conn.reply(m.chat, '❌ Gagal mengambil gambar ero.', m)
  }
}

handler.command = /^(ero)$/i
handler.tags = ['nsfw']
handler.help = ['ero']
handler.limit = 3
handler.premium = true
handler.register = true
handler.nsfw = true

export default handler