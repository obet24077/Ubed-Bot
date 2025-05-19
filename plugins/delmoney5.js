let handler = async (m, { conn, args }) => {
    if (args.length < 1) {
        return m.reply(`
*Format Salah!*
Contoh: .delmoney @user

Fungsi: Menghapus saldo money (user.eris)
`.trim())
    }

    let target

    if (m.mentionedJid?.[0]) {
        target = m.mentionedJid[0]
    } else if (args[0]) {
        target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    }

    if (!target) return m.reply('Tag pengguna atau masukkan nomornya!')

    let user = global.db.data.users[target]
    if (!user) return m.reply('User tidak ditemukan di database.')

    user.eris = 0

    m.reply(`✅ Berhasil menghapus *Money (eris)* milik @${target.split('@')[0]}`, null, {
        mentions: [target]
    })
}

handler.help = ['delmoney <@tag|nomor>']
handler.tags = ['rpg']
handler.command = /^delmoney5$/i
handler.owner = true;

export default handler