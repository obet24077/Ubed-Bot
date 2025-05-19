import axios from 'axios'

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) throw `Tolong kirimkan dua teks setelah perintah *${usedPrefix}${command}*`

  // Memisahkan teks menjadi dua bagian
  const texts = text.split('|')
  if (texts.length < 2) throw `Kirimkan dua teks yang dipisahkan oleh tanda |, contoh: *${usedPrefix}${command} tahu bacem enak|tahu bacem enak banget*`

  try {
    // Mengirim react emoji saat memproses
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    // Memanggil API untuk membuat meme dengan dua teks
    const res = await axios.get(`https://api.lolhuman.xyz/api/meme2?apikey=ubed2407&text1=${encodeURIComponent(texts[0])}&text2=${encodeURIComponent(texts[1])}`, {
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

handler.command = /^(meme2)$/i
handler.help = ['meme2']
handler.tags = ['fun', 'image']
handler.limit = 3
handler.register = true

export default handler