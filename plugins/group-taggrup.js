let handler = async (m, { conn, text, participants, groupMetadata }) => {
  // Cek jika ini adalah grup
  if (!m.isGroup) return;

  // Ambil daftar ID admin
  let admins = participants.filter(a => a.isAdmin).map(a => a.id);

conn.sendMessage(m.chat, {
	text: `@${m.chat} ${text}`,
	contextInfo: {
mentionedJid: admins, 
		groupMentions: [
			{
				groupSubject: `Join Grupku`,
				groupJid: m.chat,
			},
		],
	},
});
}
handler.help = ['taggrup']
handler.tags = ['group']
/*handler.customPrefix = /^(@taggrup)$/i
handler.command = new RegExp*/
handler.command = /^(taggrup)$/i
handler.group = true
handler.admin = true

export default handler