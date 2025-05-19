import axios from 'axios'
import FormData from 'form-data'

const _wm_ubed = () => {
  if ("ubed" !== "ubed") throw new Error("Jangan hapus watermark ubed bot!");
};

let handler = async (m, { conn }) => {
  _wm_ubed()

  const q = m.quoted ? m.quoted : m
  const mime = (q.msg || q).mimetype || ''

  if (!mime || !/image\/(jpe?g|png)/.test(mime)) {
    return m.reply('❌ Kirim atau balas gambar dengan caption *.ghibli*')
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: '🎨', key: m.key } })

    const imgBuffer = await q.download()
    if (!imgBuffer) return m.reply('❌ Gagal mengunduh gambar.')

    // Upload ke Catbox
    const form = new FormData()
    form.append('reqtype', 'fileupload')
    form.append('fileToUpload', imgBuffer, 'image.jpg')

    const uploadRes = await axios.post('https://catbox.moe/user/api.php', form, {
      headers: form.getHeaders()
    })

    const imageUrl = uploadRes.data
    if (!imageUrl.includes('catbox')) throw 'Gagal upload ke Catbox.'

    // Kirim ke PiAPI
    const apiRes = await axios.post('https://api.piapi.ai/api/v1/task', {
      model: 'flux1-schnel',
      task_type: 'image2image',
      input: {
        image: imageUrl,
        prompt: 'in the style of studio ghibli, whimsical, soft colors, anime style, beautiful background'
      }
    }, {
      headers: {
        'x-api-key': '1357313b9f29d1010f6d44f939f9c4979bc306f65cebdd07b1be284f8bebcb51',
        'Content-Type': 'application/json'
      }
    })

    const taskId = apiRes.data?.task_id
    if (!taskId) throw 'Gagal membuat task Ghibli.'

    // Cek hasil dengan polling
    let imageOut = ''
    for (let i = 0; i < 10; i++) {
      const check = await axios.get(`https://api.piapi.ai/api/v1/task/${taskId}`, {
        headers: { 'x-api-key': '1357313b9f29d1010f6d44f939f9c4979bc306f65cebdd07b1be284f8bebcb51' }
      })

      if (check.data?.status === 'succeeded') {
        imageOut = check.data?.result?.image
        break
      } else {
        await new Promise(r => setTimeout(r, 3000)) // tunggu 3 detik
      }
    }

    if (!imageOut) throw '❌ Gagal mendapatkan hasil gambar gaya Ghibli.'

    await conn.sendMessage(m.chat, {
      image: { url: imageOut },
      caption: '✅ *Gambar berhasil diubah ke gaya Studio Ghibli!*',
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  } catch (err) {
    console.error('Ghibli Error:', err)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    m.reply(typeof err === 'string' ? err : '❌ Terjadi kesalahan saat memproses.')
  }
}

handler.command = ['ghibli3']
handler.help = ['ghibli (balas/kirim gambar dengan caption .ghibli)']
handler.tags = ['ai', 'tools']
handler.limit = true

export default handler