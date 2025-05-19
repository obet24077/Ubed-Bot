const handler = async (m, { conn, args }) => {
    const groupId = args[0]
    if (!groupId || !groupId.endsWith('@g.us')) return m.reply('⚠️ ID grup tidak valid.')

    try {
        // Menonaktifkan notifikasi grup
        await conn.groupSettingUpdate(groupId, 'announcement')
        m.reply(`✅ Grup ${groupId} telah dimute.`)
    } catch (err) {
        m.reply('❌ Gagal mute grup.')
    }
}

handler.command = ['mutegrup']
handler.owner = true

export default handler