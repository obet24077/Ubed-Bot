let handler = async (m, { conn, args }) => {
  if (!args[0]) return m.reply('Masukkan URL Facebook yang ingin diunduh!')

  try {
    // Tampilkan emoji react saat memproses
    await conn.sendMessage(m.chat, { react: { text: '🍏', key: m.key } })

    const res = await fetch(`https://fastrestapis.fasturl.cloud/downup/fbdown?url=${encodeURIComponent(args[0])}`)
    const json = await res.json()

    if (!json.result || !json.result.sd) throw 'Terjadi kesalahan saat mengunduh video.'

    await conn.sendFile(m.chat, json.result.sd, 'fb.mp4', `🎥 *${json.result.title}*\n\n© ubed bot`, m)
  } catch (e) {
    console.error(e)
    m.reply('Terjadi kesalahan saat mengunduh video.')
  }
}

handler.help = ['fb <url>']
handler.tags = ['downloader']
handler.command = /^fb|facebook$/i

export default handler