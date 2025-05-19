let handler = async (m, { conn, usedPrefix, command, quoted }) => {
  if (!quoted || !quoted.message) {
    return conn.reply(m.chat, `⚠️ *Reply* audio yang ingin dikirim ke Channel!\n\n📌 *Contoh:* ${usedPrefix + command}`, m)
  }

  let mime = quoted.mimetype || quoted.message?.audioMessage?.mimetype

  if (!mime || !mime.includes('audio')) {
    return conn.reply(m.chat, `⚠️ *Reply* file audio, bukan yang lain!\n\n📌 *Contoh:* ${usedPrefix + command}\n\n📢 Debug MIME: ${mime}`, m)
  }

  let media = await quoted.download()
  let channelID = '120363369035192952@newsletter' // Ganti dengan ID Channel WA yang benar
  let isPTT = !!quoted.message.audioMessage?.ptt // Cek apakah audio adalah Voice Note atau Audio biasa

  try {
    await conn.sendMessage(channelID, { 
      audio: media, 
      mimetype: mime, 
      ptt: isPTT, 
      fileName: 'audio.mp3', 
      caption: '🎵 Audio dari grup/private chat.'
    })
    await conn.reply(m.chat, '✅ Audio berhasil dikirim ke Channel!', m)
  } catch (e) {
    console.log('[❌] Gagal Kirim MP3:', e.message)
    await conn.reply(m.chat, '⚠️ Gagal mengirim MP3! Coba lagi nanti.', m)
  }
}

handler.help = ['uploadchannel']
handler.tags = ['tools']
handler.command = /^upch2$/i

export default handler