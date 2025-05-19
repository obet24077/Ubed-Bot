//Untuk HD

import fetch from 'node-fetch'
import axios from 'axios'

const _wm_ubed = () => {
  if ("ubed" !== "ubed") throw new Error("Jangan hapus watermark ubed bot!");
};

let handler = async (m, { conn }) => {
  _wm_ubed()
  const q = m.quoted ? m.quoted : m
  const mime = (q.msg || q).mimetype || ''

  if (!mime || !/image\/(jpe?g|png)/.test(mime)) {
    return m.reply('❌ Kirim atau balas gambar dengan caption *.hd*')
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    const imgBuffer = await q.download()
    if (!imgBuffer) return m.reply('❌ Gagal mengunduh gambar.')

    const FormData = (await import('form-data')).default
    const form = new FormData()
    form.append('file', imgBuffer, 'image.jpg')

    const uploadRes = await axios.post('https://fastrestapis.fasturl.cloud/downup/uploader-v1', form, {
      headers: form.getHeaders()
    })

    const imageUrl = uploadRes.data?.result
    if (!imageUrl || !imageUrl.includes('fasturl')) throw 'Gagal upload ke FastURL.'

    const upscaleUrl = `https://fastrestapis.fasturl.cloud/aiimage/upscale?imageUrl=${encodeURIComponent(imageUrl)}&resize=4`
    const res = await fetch(upscaleUrl)
    if (!res.ok) throw 'Gagal mendapatkan gambar hasil HD.'

    const buffer = await res.buffer()
    await conn.sendMessage(m.chat, {
      image: buffer,
      caption: '✅ *Gambar berhasil di-HD-kan!*',
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  } catch (e) {
    console.error('HD API Error:', e)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    m.reply('❌ Terjadi kesalahan saat memproses gambar.')
  }
}

handler.command = ['hd', 'hdr', 'remini']
handler.help = ['hd (balas/kirim gambar dengan caption .hd)']
handler.tags = ['ai', 'tools']

export default handler