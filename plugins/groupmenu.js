import fs from 'fs'

const handler = async (m, { conn, args }) => {
    const groupId = args[0]
    if (!groupId || !groupId.endsWith('@g.us')) return m.reply('⚠️ ID grup tidak valid.')

    const groupMetadata = await conn.groupMetadata(groupId).catch(() => null)
    if (!groupMetadata) return m.reply('⚠️ Gagal mengambil metadata grup.')

    const caption = `📋 *Menu Peraturan Grup:* ${groupMetadata.subject}\n\nPilih peraturan yang ingin diterapkan pada grup ini.`

    const buttons = [
        {
            buttonId: `.leave ${groupId}`,
            buttonText: { displayText: '🚪 Leave Grup' },
            type: 1
        },
        {
            buttonId: `.sewa ${groupId} 1d`,
            buttonText: { displayText: '➕ Sewa 1 Hari' },
            type: 1
        },
        {
            buttonId: `.sewa ${groupId} 5d`,
            buttonText: { displayText: '➕ Sewa 5 Hari' },
            type: 1
        },
        {
            buttonId: `.sewa ${groupId} 7d`,
            buttonText: { displayText: '➕ Sewa 7 Hari' },
            type: 1
        },
        {
            buttonId: `.sewa ${groupId} 2w`,
            buttonText: { displayText: '➕ Sewa 2 Minggu' },
            type: 1
        },
        {
            buttonId: `.sewa ${groupId} 1m`,
            buttonText: { displayText: '➕ Sewa 1 Bulan' },
            type: 1
        },
        {
            buttonId: `.sewa ${groupId} 2m`,
            buttonText: { displayText: '➕ Sewa 2 Bulan' },
            type: 1
        },
        {
            buttonId: `.mute ${groupId}`,
            buttonText: { displayText: '🔇 Mute Grup' },
            type: 1
        },
        {
            buttonId: `.link ${groupId}`,
            buttonText: { displayText: '🔗 Get Link Grup' },
            type: 1
        },
        {
            buttonId: `.close ${groupId}`,
            buttonText: { displayText: '🔒 Close Grup' },
            type: 1
        },
        {
            buttonId: `.open ${groupId}`,
            buttonText: { displayText: '🔓 Open Grup' },
            type: 1
        }
    ]

    const imgPath = './media/ubedbot.jpg'
    if (!fs.existsSync(imgPath)) return m.reply('❌ Gambar tidak ditemukan.')

    await conn.sendMessage(m.chat, {
        image: fs.readFileSync(imgPath),
        caption,
        buttons,
        headerType: 4
    }, { quoted: m })
}

handler.command = ['infogrup']
handler.owner = true

export default handler