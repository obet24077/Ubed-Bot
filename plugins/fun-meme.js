import axios from 'axios'

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) throw `Tolong kirimkan teks setelah perintah *${usedPrefix}${command}*`

  try {
    // Mengirim react emoji saat memproses
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    // Memanggil API untuk mendapatkan meme
    const res = await axios.get(`https://api.lolhuman.xyz/api/meme1?apikey=ubed2407&text=${encodeURIComponent(text)}`, {
      responseType: 'arraybuffer'
    })

    const buffer = res.data

    // Mengirim gambar meme
    await conn.sendMessage(m.chat, {
      image: buffer,
      caption: 'Meme kamu sudah jadi!',
    }, { quoted: m })

    // Mengirim react emoji setelah selesai memproses
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, '❌ Gagal membuat meme.', m)
  }
}

handler.command = /^(bratkertas)$/i
handler.help = ['bratkertas']
handler.tags = ['fun', 'image']
handler.limit = 3
handler.register = true

export default handler