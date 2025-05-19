import { Sticker } from 'wa-sticker-formatter'
import FormData from 'form-data'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    await conn.sendMessage(m.chat, { react: { text: '🖼️', key: m.key } })

    if (!args[0]) return m.reply(`⚠️ *Format salah!*\n\n📌 *Contoh:* ${usedPrefix + command} Atas|Bawah\n*Balas gambar dengan perintah ini!*`)

    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!mime || !/image\/(jpeg|png|jpg|webp)/.test(mime)) return m.reply('⚠️ *Balas gambar dengan format JPG/PNG/WEBP!*')

    let media = await q.download().catch(() => null)
    if (!media) return m.reply('⚠️ *Gagal mengunduh gambar!*')

    // Upload gambar ke FastRestAPI
    let form = new FormData()
    form.append('file', media, 'image.jpg')
    let uploadRes = await fetch('https://fastrestapis.fasturl.cloud/downup/uploader-v1', {
      method: 'POST',
      body: form
    }).then(res => res.json()).catch(() => null)

    if (!uploadRes?.result) return m.reply('⚠️ *Gagal mengunggah gambar ke server FastRestAPI!*')

    // Ambil teks atas dan bawah
    let [text1, text2] = args.join(" ").split("|")
    text1 = encodeURIComponent(text1 || '_')
    text2 = encodeURIComponent(text2 || '_')

    // Panggil API Smeme
    let apiUrl = `https://api.ubed.my.id/sticker/Smeme?apikey=ubed2407&url=${encodeURIComponent(uploadRes.result)}&text=${text1}&text2=${text2}`
    let response = await fetch(apiUrl)
    if (!response.ok) return m.reply('⚠️ *Gagal membuat meme dari API!*')

    let buffer = await response.buffer()

    // Konversi ke stiker
    const sticker = new Sticker(buffer, {
      type: 'full',
      pack: 'Stiker Meme',
      author: 'Bot Kamu',
      quality: 50
    })

    let stiker = await sticker.toBuffer()
    await conn.sendMessage(m.chat, { sticker: stiker }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply(`❌ *Terjadi Kesalahan Teknis!*\n\n${e.message}`)
  }
}

handler.help = ['smeme <atas>|<bawah>']
handler.tags = ['sticker']
handler.command = /^smeme22$/i
handler.premium = true
handler.register = true

export default handler