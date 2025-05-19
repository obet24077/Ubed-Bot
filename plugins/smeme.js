import { Sticker } from 'wa-sticker-formatter'
import FormData from 'form-data'
import fetch from 'node-fetch'
import fs from 'fs'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let stiker = false
    try {
        await conn.sendMessage(m.chat, { react: { text: '🍏', key: m.key } })

        if (!args[0]) return m.reply(`⚠️ *Format salah!*\n\n📌 *Contoh:* ${usedPrefix + command} atas|bawah`)
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || ''
        if (!mime) return m.reply(`⚠️ *Balas gambar dengan perintah ${usedPrefix + command}*`)
        if (!/image\/(jpeg|png|jpg)/.test(mime)) return m.reply('⚠️ *Format gambar tidak didukung! Gunakan JPG atau PNG.*')

        let media = await q.download().catch(() => null)
        if (!media) return m.reply('⚠️ *Gagal mengunduh gambar! Pastikan file tidak rusak.*')

        // Upload ke FastRestAPI
        let form = new FormData()
        form.append('file', media, 'image.jpg')
        let uploadRes = await fetch('https://fastrestapis.fasturl.cloud/downup/uploader-v1', {
            method: 'POST',
            body: form
        }).then(res => res.json()).catch(() => null)

        if (!uploadRes?.result) return m.reply('⚠️ *Gagal mengunggah gambar ke server. Coba lagi nanti!*')

        let [top, bottom] = args.join(" ").split('|')
        top = encodeURIComponent(top || '_')
        bottom = encodeURIComponent(bottom || '_')

        let apiUrl = `https://api.memegen.link/images/custom/${top}/${bottom}.png?background=${uploadRes.result}`
        let response = await fetch(apiUrl)
        if (!response.ok) return m.reply('⚠️ *Terjadi kesalahan saat memproses meme. Coba lagi nanti!*')

        let buffer = Buffer.from(await response.arrayBuffer())

        // Membuat stiker menggunakan wa-sticker-formatter
        const sticker = new Sticker(buffer, {
            type: 'full',
            pack: 'Stiker Meme',
            author: 'Bot Kamu',
            quality: 50 // Bisa disesuaikan
        })

        stiker = await sticker.toBuffer()

        await conn.sendMessage(m.chat, { sticker: stiker }, { quoted: m })

    } catch (e) {
        console.error(e)
        m.reply(`❌ *Terjadi Kesalahan Teknis!*\n⚠️ *Detail:* ${e.message}`)
    } finally {
        await conn.sendMessage(m.chat, { react: { text: '🍏', key: m.key } })
    }
}

handler.help = ['smeme']
handler.tags = ['sticker']
handler.command = /^(smeme)$/i
handler.premium = false
handler.register = true

export default handler