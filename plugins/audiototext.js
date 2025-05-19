import fetch from 'node-fetch'
import fs from 'fs'
import FormData from 'form-data'

let handler = async (m, { conn, usedPrefix, command }) => {
  if (!m.quoted || !/audio|voice/.test(m.quoted.mimetype)) {
    return m.reply(`Reply audio/voice note dengan perintah *${usedPrefix + command}*`)
  }

  m.reply('⏳ Sedang mengubah audio ke teks...')

  try {
    const audio = await m.quoted.download()
    const form = new FormData()
    form.append('audio_file', audio, {
      filename: 'voice.ogg',
      contentType: 'audio/ogg'
    })

    const res = await fetch('https://whisper.lablab.ai/asr', {
      method: 'POST',
      body: form
    })

    const json = await res.json()
    if (!json || !json.text) throw 'Gagal mendapatkan teks.'

    m.reply(`🎧 Hasil transkripsi:\n\n"${json.text}"`)
  } catch (err) {
    console.log(err)
    m.reply('Gagal mengubah audio ke teks, pastikan formatnya audio/voice note.')
  }
}

handler.help = ['audiototext']
handler.tags = ['tools']
handler.command = /^audiototext$/i
handler.limit = true

export default handler