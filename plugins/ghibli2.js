import fetch from 'node-fetch'
import FormData from 'form-data'

const handler = async (m, { conn, args }) => {
  // Tentukan sumber gambar (reply atau kirim langsung)
  const q = m.quoted ? m.quoted : m
  const mime = (q.msg || q).mimetype || ''

  // Jika argumen URL ada, pakai itu langsung
  let imageUrl = args[0]

  // Jika tidak ada argumen URL, cek mime harus image (jpeg/png)
  if (!imageUrl) {
    if (!mime || !/image\/(jpe?g|png)/.test(mime)) {
      return m.reply('❌ Kirim gambar, balas gambar, atau berikan URL gambar sebagai argumen.\nContoh:\n.ghibli2 https://example.com/image.jpg')
    }
  }

  // React emoji 🍏 saat memproses
  await conn.sendMessage(m.chat, { react: { text: '🍏', key: m.key } })

  try {
    if (!imageUrl) {
      // Download gambar dari reply
      const imgBuffer = await q.download()
      if (!imgBuffer) return m.reply('❌ Gagal mengunduh gambar.')

      // Upload ke Catbox untuk dapat URL publik
      const form = new FormData()
      form.append('reqtype', 'fileupload')
      form.append('fileToUpload', imgBuffer, 'image.jpg')

      const uploadRes = await fetch('https://catbox.moe/user/api.php', {
        method: 'POST',
        body: form
      })
      imageUrl = await uploadRes.text()
      if (!imageUrl.startsWith('http')) throw new Error('Gagal upload gambar ke catbox.')
    }

    // Panggil API ghibli2 dengan imageUrl
    const apikey = 'ubed2407'
    const apiUrl = `https://api.ubed.my.id/maker/ghibli2?apikey=${apikey}&url=${encodeURIComponent(imageUrl)}`

    const res = await fetch(apiUrl)
    if (!res.ok) throw new Error('Gagal mengambil gambar dari API.')
    const imageBuffer = await res.buffer()

    await conn.sendMessage(m.chat, {
      image: imageBuffer,
      caption: '✨ Berikut hasil efek Ghibli!'
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    m.reply('❌ Terjadi kesalahan saat memproses gambar.\n' + e.message)
  }
}

handler.help = ['ghibli2 <url|reply gambar>']
handler.tags = ['maker']
handler.command = /^ghibli2$/i
handler.limit = true
handler.premium = false
handler.register = true

export default handler