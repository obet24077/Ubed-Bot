let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender]
  let smallFish = `
╭━━━━「 *BIO* 」   
┊ *💌 Name :* ${user.registered ? user.name : conn.getName(m.sender)}
┊ *📊 Level :* ${user.level}
┊ *✨ Exp :* ${user.exp}
╰═┅═━––––––─ׄ✧

╭━━━━「 *IKAN KECIL* 」
┊🦀 Kepiting: ${user.kepiting}
┊🦞 Lobster: ${user.lobster}
┊🦐 Udang: ${user.udang}
┊🦑 Cumi: ${user.cumi}
┊🐙 Gurita: ${user.gurita}
┊🐡 Buntal: ${user.buntal}
╰═┅═━––––––─ׄ✧
🎏 Total Isi: *${user.kepiting + user.lobster + user.udang + user.cumi + user.gurita + user.buntal}* Jenis

╭━━━━「 *IKAN BESAR* 」
┊🐠 Dory: ${user.dory}
┊🐳 Orca: ${user.orca}
┊🐬 Lumba: ${user.lumba}
┊🐋 Paus: ${user.paus}
┊🦈 Hiu: ${user.hiu}
╰═┅═━––––––─ׄ✧
🎏 Total Isi: *${user.dory + user.orca + user.lumba + user.paus + user.hiu}* Jenis`

  m.reply(smallFish)
}

handler.help = ['kolam']
handler.tags = ['rpg']
handler.command = /^(kotak(ikan)?|kolam(ikan)?)$/i
handler.register = true
handler.group = true
handler.rpg = true
export default handler