let handler = async (m, { conn, text, isROwner, isOwner, isAdmin, usedPrefix, command }) => {
  if (text) {
    global.db.data.chats[m.chat].sBye = text
    m.reply('Bye berhasil diatur\n\nGunakan:\n@user (Mention)\n@subject (Judul Grup)\n@desc (Deskripsi Grup)')
  } else throw `Teksnya mana?\n\nContoh:\n${usedPrefix + command} Sampai jumpa @user!\nSemoga sukses selalu dari @subject\n\n@desc`
}

handler.help = ['setbye <teks>']
handler.tags = ['group']
handler.command = /^(setbye|setb)$/i
handler.group = true
handler.admin = true

export default handler