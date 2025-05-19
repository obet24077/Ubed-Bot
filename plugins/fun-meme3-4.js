import axios from 'axios'

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) throw `Tolong kirimkan teks setelah perintah *${usedPrefix}${command}*`

  // Memisahkan teks menjadi tiga bagian untuk meme3
  const texts = text.split('|')
  if (command === 'meme3') {
    if (texts.length < 3) throw `Kirimkan tiga teks yang dipisahkan oleh tanda |, contoh: *${usedPrefix}${command} tahu bacem|tahu bacem enak|tahu bacem enak banget*`

    try {
      // Mengirim react emoji saat memproses
      await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

      // Memanggil API untuk membuat meme3 dengan tiga teks
      const res = await axios.get(`https://api.lolhuman.xyz/api/meme3?apikey=ubed2407&text1=${encodeURIComponent(texts[0])}&text2=${encodeURIComponent(texts[1])}&text3=${encodeURIComponent(texts[2])}`, {
        responseType: 'arraybuffer'
      })

      const buffer = res.data

      // Mengirim gambar meme3
      await conn.sendMessage(m.chat, {
        image: buffer,
        caption: 'Meme3 kamu sudah jadi!',
      }, { quoted: m })

      // Mengirim react emoji setelah selesai memproses
      await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    } catch (e) {
      console.error(e)
      conn.reply(m.chat, '❌ Gagal membuat meme3.', m)
    }
  } else if (command === 'meme4') {
    try {
      // Mengirim react emoji saat memproses
      await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

      // Memanggil API untuk membuat meme4 dengan satu teks
      const res = await axios.get(`https://api.lolhuman.xyz/api/meme4?apikey=ubed2407&text=${encodeURIComponent(text)}`, {
        responseType: 'arraybuffer'
      })

      const buffer = res.data

      // Mengirim gambar meme4
      await conn.sendMessage(m.chat, {
        image: buffer,
        caption: 'Meme4 kamu sudah jadi!',
      }, { quoted: m })

      // Mengirim react emoji setelah selesai memproses
      await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    } catch (e) {
      console.error(e)
      conn.reply(m.chat, '❌ Gagal membuat meme4.', m)
    }
  }
}

handler.command = /^(meme3|meme4)$/i
handler.help = ['meme3', 'meme4']
handler.tags = ['fun', 'image']
handler.limit = 3
handler.register = true

export default handler