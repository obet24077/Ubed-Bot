let handler = async (m, { conn, text, usedPrefix, command }) =>  conn.sendMessage(m.chat, {
text: 'Emoji Fitur\n\n\r⨳\r\r[💳] Bank\n\r⨳\r\r[🪪] Inventory\n\r⨳\r\r[🪀] Runtime\n\r⨳\r\r[💰] Dompet', 
contextInfo: {
externalAdReply: {
title: `Emoji Command`,
body: 'Tetap Pakek Prefix Ya Blog',
thumbnailUrl: "https://telegra.ph/file/09d2c759a23cb53c0df7d.jpg",
sourceUrl: "",
mediaType: 1,
renderLargerThumbnail: false
}
}})

handler.customPrefix = /^(note|.note)$/i
handler.command = new RegExp
export default handler