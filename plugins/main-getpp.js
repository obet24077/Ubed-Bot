import fetch from 'node-fetch'
let handler = async(m, { conn }) => {
	try {
    let who
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    else who = m.sender
    let url = await conn.profilePictureUrl(who, 'image')
    await conn.sendFile(m.chat, url, 'profile.jpg', `@${who.split`@`[0]}`, m, null, { mentions: [who]})
 } catch (e) {
    m.reply('Pp Nya Di Privasi :(')
  }
}
handler.command = /^(getpp)$/i
handler.help = ['getprofile [@users]']
handler.tags = ['main']
handler.group = true
handler.limit = true
export default handler