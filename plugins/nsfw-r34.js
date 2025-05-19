import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command }) => {
  if (!global.db.data.chats[m.chat].nsfw) 
    return m.reply('❌ Fitur NSFW tidak aktif di grup ini.')

  m.reply('_Mengambil konten R34..._')

  try {
    let res = await fetch(`https://api.ubed.my.id/nsfw/R34-random?apikey=ubed2407`)
    let json = await res.json()

    if (!json || json.status !== 200 || !Array.isArray(json.result))
      return m.reply('Gagal mengambil data.')

    for (let item of json.result) {
      await conn.sendFile(m.chat, item.url, `r34_${item.id}.mp4`, item.description, m)
    }

  } catch (e) {
    console.error(e)
    m.reply('Terjadi kesalahan saat mengambil data.')
  }
}

handler.command = /^r34random$/i
handler.tags = ['nsfw']
handler.help = ['r34random']
handler.premium = true
handler.limit = true
handler.register = true

export default handler