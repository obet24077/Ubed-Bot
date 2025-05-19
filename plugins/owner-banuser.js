let handler = async (m, { conn, text, args }) => {
    if (!text) throw 'Siapa yang ingin di-ban? Tag orangnya atau masukkan nomor ID (contoh: 628xxx)!\n\n# Untuk banned permanen\n- contoh: .ban @tag\n\nUntuk banned sementata\n- contoh: .ban @tag 1'

    let who
    if (m.isGroup) {
        who = m.mentionedJid[0] || (text.includes('@') ? text.replace(/[@\s]/g, '') + '@s.whatsapp.net' : text.replace(/\D/g, '') + '@s.whatsapp.net')
    } else {
        who = text.includes('@') ? text.replace(/[@\s]/g, '') + '@s.whatsapp.net' : text.replace(/\D/g, '') + '@s.whatsapp.net'
    }

    if (!who) throw 'Nomor / ID atau tag tidak valid!'

    let users = global.db.data.users
    if (!users[who]) throw 'User tidak ditemukan dalam database!'

    // Cek apakah ada angka dan satuan waktu
    let time = args.slice(1).join(' ').toLowerCase()
    let duration
    if (time) {
        let match = time.match(/(\d+)\s*(jam|hari|minggu|bulan|tahun)/)
        if (!match) throw 'Gunakan format: <angka> jam/hari/minggu/bulan/tahun.\n- contoh: .ban @tag 30 tahun'

        let value = parseInt(match[1])
        let unit = match[2]

        switch (unit) {
            case 'jam':
                duration = value * 60 * 60 * 1000 // Jam ke milidetik
                break
            case 'hari':
                duration = value * 24 * 60 * 60 * 1000 // Hari ke milidetik
                break
            case 'minggu':
                duration = value * 7 * 24 * 60 * 60 * 1000 // Minggu ke milidetik
                break
            case 'bulan':
                duration = value * 30 * 24 * 60 * 60 * 1000 // Bulan ke milidetik (diasumsikan 30 hari)
                break
            case 'tahun':
                duration = value * 365 * 24 * 60 * 60 * 1000 // Tahun ke milidetik
                break
        }

        users[who].banned = true
        users[who].banExpires = Date.now() + duration
        conn.reply(m.chat, `User @${who.split('@')[0]} telah di-ban selama ${value} ${unit}!`, m, {
            mentions: [who]
        })
    } else {
        // Ban permanen jika tidak ada angka
        users[who].banned = true
        users[who].banExpires = null
        conn.reply(m.chat, `User @${who.split('@')[0]} telah di-ban secara permanen!`, m, {
            mentions: [who]
        })
    }
}

handler.help = ['ban']
handler.tags = ['owner']
handler.command = /^ban(user)?$/i
handler.owner = true

export default handler