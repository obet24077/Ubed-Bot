import fs from 'fs'

let handler = async (m, { conn }) => {
	let tqto = `Team ${global.namebot}

Mau apel? 🍏
Developer Script : Ponta
Pengembang : Ubed

${global.week}`;

conn.sendMessage(m.chat, {
	text: tqto,
	contextInfo: {
	externalAdReply: {
	title: 'Kenalin Team Kami',
	body: '',
	thumbnailUrl: global.thumb,
	sourceUrl: 'https://youtube.com/@badut',
	mediaType: 1,
	renderLargerThumbnail: true
	}}})
  
}
handler.help = ['tqto', 'sc']
handler.tags = ['info']
handler.command = /^(tqto|sc)$/i;

export default handler;