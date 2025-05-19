var handler = async (m, { text, conn }) => {
    let user = global.db.data.users[m.sender]
    user.afk = +new Date // Set waktu AFK saat ini
    user.afkReason = text || "Tanpa Keterangan" // Jika tidak ada pesan alasan, isi dengan "Sayang Yue"
    let afkTime = new Date(user.afk)
    // Ubah format jam menggunakan titik dua
    let afkTimeString = afkTime.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }).replace(',', ':')
    
    // Mendapatkan user ID
    let userId = m.sender
    
    // Tag user dengan menggunakan '@' di depan user ID
    let userTag = '@' + userId.split('@')[0]
    
    conn.reply(m.chat, `👤 User: ${userTag}
📊 Status: _Afk_
📑 Alasan: _${user.afkReason}_
⏰ Waktu AFK: _${afkTimeString}_`, floc)
}

handler.help = ['afk']
handler.tags = ['main']
handler.command = /^afk$/i

export default handler