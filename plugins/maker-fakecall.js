import fetch from 'node-fetch'
import FormData from 'form-data'
import axios from 'axios'

const handler = async (m, { conn, text, participants }) => {
  if (!text) {
    return m.reply(`Tag seseorang atau tulis nama custom lalu beri durasi!\n\nContoh:\n.fakecall @user|05:00\n.fakecall John Cena|05:00 (dengan mengirim gambar bersamaan atau membalas gambar)`)
  }

  const [input, duration] = text.split('|').map(v => v.trim())
  if (!input || !duration) {
    return m.reply(`Format salah!\n\nContoh:\n.fakecall @user|05:00\n.fakecall Nama Custom|05:00`)
  }

  let name, avatar

  if (input.startsWith('@')) {
    // Mode tag user
    const taggedUser = input.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    const isParticipant = participants.some(p => p.id === taggedUser)
    if (!isParticipant) return m.reply('Pengguna yang Anda tag tidak ada dalam grup ini!')

    name = (await conn.getName(taggedUser)).trim()
    avatar = await conn.profilePictureUrl(taggedUser, 'image').catch(_ => 'https://files.catbox.moe/75rk9m.jpg')
  } else {
    // Mode nama custom + gambar (direct atau reply)
    name = input

    const q = m.quoted ? m.quoted : m
    const mime = (q.msg || q).mimetype || ''

    if (!mime || !/image\/(jpe?g|png)/.test(mime)) {
      return m.reply('❌ Untuk nama custom, kirim atau balas gambar dengan perintah ini!')
    }

    const media = await q.download()
    if (!media) return m.reply('❌ Gagal mengunduh gambar.')

    avatar = await uploadToCatbox(media)
    if (!avatar) return m.reply('❌ Gagal mengunggah gambar ke Catbox.')
  }

  try {
    const api = `https://velyn.biz.id/api/maker/calling?name=${encodeURIComponent(name)}&duration=${encodeURIComponent(duration)}&avatar=${encodeURIComponent(avatar)}&apikey=velyn`

    const res = await fetch(api)
    if (!res.ok) throw await res.text()

    const buffer = await res.arrayBuffer()
    await conn.sendFile(m.chat, Buffer.from(buffer), 'calling.jpg', `📞 Panggilan palsu dari ${name} (${duration})`, m)
  } catch (e) {
    console.error(e)
    m.reply('❌ Gagal membuat fake calling. Coba lagi nanti.')
  }
}

handler.command = ['fakecall']
handler.help = ['fakecall @user|durasi', 'fakecall Nama|durasi (dengan gambar)']
handler.tags = ['maker']
handler.limit = true
handler.group = true

export default handler

// Fungsi upload Catbox
async function uploadToCatbox(buffer) {
  try {
    const form = new FormData()
    form.append('reqtype', 'fileupload')
    form.append('fileToUpload', buffer, 'image.jpg')

    const res = await axios.post('https://catbox.moe/user/api.php', form, {
      headers: form.getHeaders()
    })

    return res.data.startsWith('https://') ? res.data : null
  } catch (err) {
    console.error('Upload Catbox gagal:', err)
    return null
  }
}