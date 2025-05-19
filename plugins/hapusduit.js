let handler = async (m, { conn, args, command }) => {
    if (args.length < 2) {
        return m.reply(`
*Format Salah!*
Contoh: .hapusmoney money @user

*Opsi yang bisa dihapus:*
• money
• bank
• balance
`.trim())
    }

    let type = args[0].toLowerCase()
    let target

    if (m.mentionedJid?.[0]) {
        target = m.mentionedJid[0]
    } else if (args[1]) {
        target = args[1].replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    }

    if (!target) return m.reply('Tag pengguna atau masukkan nomornya!')

    let user = global.db.data.users[target]
    if (!user) return m.reply('User tidak ditemukan di database.')

    switch (type) {
        case 'money':
        case 'bank':
        case 'balance':
            user[type] = 0
            m.reply(`✅ Berhasil menghapus *${type}* dari @${target.split('@')[0]}`, null, {
                mentions: [target]
            })
            break
        default:
            m.reply(`Jenis saldo tidak dikenali. Gunakan: money, bank, atau balance.`)
    }
}

handler.help = ['hapusmoney <money|bank|balance> <@tag|nomor>']
handler.tags = ['rpg']
handler.command = /^hapusmoney$/i
handler.owner = true;

export default handler