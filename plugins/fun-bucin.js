import { bucin } from '@bochilteam/scraper'

var handler = async (m, { conn }) => conn.reply(m.chat, await bucin(), m)

handler.help = ['bucin']
handler.tags = ['fun']
handler.command = /^(bucin)$/i

export default handler