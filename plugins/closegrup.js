const handler = async (m, { conn, args }) => {
    const groupId = args[0]
    if (!groupId || !groupId.endsWith('@g.us')) return m.reply('⚠️ ID grup tidak valid.')

    try {
        // Mengubah pengaturan grup menjadi hanya admin yang bisa mengirim pesan
        await conn.groupSettingUpdate(groupId, 'announcement')
        m.reply(`✅ Grup ${groupId} telah ditutup, hanya admin yang bisa mengirim pesan.`)
    } catch (err) {
        m.reply('❌ Gagal menutup grup.')
    }
}

handler.command = ['closegrup']
handler.owner = true

export default handler