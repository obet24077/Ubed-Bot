import fetch from 'node-fetch'

const handler = async (m, { conn, text }) => {
  if (!text) return m.reply('Masukkan URL Twitter!\nContoh: *.twitter https://x.com/i/status/1234567890*')
  if (!text.includes('twitter.com') && !text.includes('x.com')) return m.reply('URL tidak valid. Harap gunakan link dari Twitter/X.')

  await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

  try {
    let res = await fetch(`https://fastrestapis.fasturl.cloud/downup/twdown?url=${encodeURIComponent(text)}`)
    if (!res.ok) throw await res.text()
    let json = await res.json()

    if (json.status !== 200 || !json.result?.videohd) throw 'Video tidak ditemukan atau tidak bisa diunduh.'

    const { desc, thumb, videohd } = json.result
    let caption = `┌─⊷ *TWITTER DL*\n▢ Deskripsi: ${desc || '-'}\n▢ By: Ubed Bot 🍏\n└───────────`

    await conn.sendFile(m.chat, videohd, 'twitter.mp4', caption, m, false, { thumbnail: await (await fetch(thumb)).buffer() })
    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } })

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
    m.reply('Gagal mengunduh video dari Twitter.')
  }
}

handler.command = ['twitter','x']
handler.help = ['twitter <url>']
handler.tags = ['downloader']

export default handler