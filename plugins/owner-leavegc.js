let handler = async (m, { conn, args, command }) => {
	let group = m.chat
        await m.reply('Selamat Tinggal Semua, Terimakasih Untuk Selama Ini 😀👋', m.chat) 
        await  conn.groupLeave(group)
        }
handler.help = ['leavegc', 'out']
handler.tags = ['owner']
handler.command = /^(out|leavegc)$/i

handler.rowner = true

export default handler