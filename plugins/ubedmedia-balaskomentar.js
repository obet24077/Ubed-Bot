const handler = async (m, { conn, args, text }) => {
    global.db.data.ubedKomentarThread ??= {}

    const mentioned = m.mentionedJid?.[0]
    if (!mentioned) return m.reply('Tag user yang komentarnya ingin kamu balas.\nContoh: *.balaskomen @user Terima kasih ya!*')

    if (!text) return m.reply('Tulis isi balasan kamu.\nContoh: *.balaskomen @user Terima kasih!*')

    if (!global.db.data.ubedKomentarThread[mentioned]) global.db.data.ubedKomentarThread[mentioned] = []

    global.db.data.ubedKomentarThread[mentioned].push({
        from: m.sender,
        text,
        waktu: Date.now()
    })

    // Kirim notifikasi ke pemilik komentar
    await conn.sendMessage(mentioned, {
        text: `↩️ *${await conn.getName(m.sender)} membalas komentarmu:*\n\n"${text}"`,
        mentions: [m.sender]
    })

    m.reply('✅ Balasan terkirim.')
}

handler.help = ['balaskomen @user <komentar>']
handler.tags = ['media']
handler.command = /^balaskomen$/i

export default handler