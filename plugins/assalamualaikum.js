let handler = async (m, { conn }) => {
  const salamRegex = /^(.*\s*)?(ass?alamualaikum|assalamu'alaikum)/i
  if (salamRegex.test(m.text)) {
    let stikerUrl = 'https://files.catbox.moe/v6ws9k.webp'
    conn.sendFile(m.chat, stikerUrl, 'salam.webp', '', m, { asSticker: true })
  }
}
handler.customPrefix = /^(.*\s*)?(ass?alamualaikum|assalamu'alaikum)/i
handler.command = new RegExp

export default handler