let handler = async (m, { conn }) => { 
   let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender 
   conn.sendFile(m.chat, global.API('https://some-random-api.com', '/canvas/simpcard', { 
     avatar: await conn.profilePictureUrl(who).catch(_ => 'https://telegra.ph/file/24fa902ead26340f3df2c.png'), 
   }), 'simpcard.png', 'simp', m) 
 } 
  
 handler.help = ['simpcard'] 
 handler.tags = ['tools'] 
  
 handler.command = /^(simpcard)$/i 
 export default handler