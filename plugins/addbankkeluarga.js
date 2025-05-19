/*
wa.me/6282285357346
github: https://github.com/sadxzyq
Instagram: https://instagram.com/tulisan.ku.id
ini wm gw cok jan di hapus
*/

let handler = async (m, { conn, command, text, args, isOwner, isMods }) => {
    // Cek apakah yang menggunakan fitur adalah Owner atau Moderator
    if (!isOwner && !isMods) throw 'Fitur ini hanya bisa digunakan oleh Owner atau Moderator!'

    // Cek apakah ada input nomor atau tag user
    if (!text) throw 'Nomor atau tag user tidak ditemukan!'

    let who
    if (m.isGroup) {
        // Jika di grup, ambil yang di-mention atau dari args
        who = m.mentionedJid[0] ? m.mentionedJid[0] : args[0] + '@s.whatsapp.net'
    } else {
        // Jika bukan grup, maka mengambil pengirim pesan
        who = m.sender
    }

    let users = global.db.data.users
    let jum = args[1] ? parseInt(args[1]) : 1000  // Menentukan jumlah bankKeluarga yang akan ditambah, default 1000

    // Cek apakah user yang dimaksud ada dalam database
    if (!users[who]) throw 'User tidak ditemukan dalam database!'

    // Mengambil saldo bank keluarga pasangan jika ada
    let pasangan = users[who].pasangan // Ambil pasangan dari data pengguna
    if (!pasangan) throw 'User belum memiliki pasangan!'

    let saldoBankKeluargaPasangan = global.db.data.users[pasangan].bankKeluarga || 0;

    // Menambah saldo bank keluarga pasangan
    global.db.data.users[pasangan].bankKeluarga = saldoBankKeluargaPasangan + jum;

    // Mengirimkan pesan berhasil
    conn.reply(m.chat, `Sukses menambah saldo bank keluarga sebesar ${jum} untuk pasangan @${pasangan.split('@')[0]}`, m, { mentions: [pasangan] })
}

handler.help = ['addbankkeluarga']
handler.tags = ['owner']
handler.command = /^addbankkeluarga$/i
handler.premium = false

export default handler