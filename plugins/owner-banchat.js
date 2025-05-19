let handler = async (m, { participants }) => {
    // if (participants.map(v=>v.jid).includes(global.conn.user.jid)) {
    global.db.data.chats[m.chat].isBanned = true
    // } else m.reply('Ada nomor host disini...')
    conn.sendMessage(m.chat, {
text: 'Done Mematikan Ruang Sesi Yue', 
contextInfo: {
externalAdReply: {
title: "Bot Sedang Offline",
body: 'Request Fitur PM +62 838-5718-2374',
thumbnailUrl: "https://telegra.ph/file/8f72af4f9548ad08a73c1.jpg",
sourceUrl: "",
mediaType: 1,
renderLargerThumbnail: true
}
}})
}
handler.help = ['banchat']
handler.tags = ['owner']
handler.command = /^(banchat|bnc)$/i

handler.owner = true

export default handler