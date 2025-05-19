import fs from 'fs'

const handler = async (m, { conn, args }) => {
    const groupId = args[0]
    if (!groupId || !groupId.endsWith('@g.us')) return m.reply('⚠️ ID grup tidak valid.')

    // Mengambil metadata grup
    const groupMetadata = await conn.groupMetadata(groupId).catch(() => null)
    if (!groupMetadata) return m.reply('⚠️ Gagal mengambil metadata grup.')

    // Menambahkan caption
    const caption = `📋 *Menu Peraturan Grup:* ${groupMetadata.subject}\n\nPilih peraturan yang ingin diterapkan pada grup ini.`

    // Daftar peraturan yang ingin dibuat tombol secara otomatis
    const actions = [
        'Leave Grup', 
        'Sewa 1 Hari', 
        'Sewa 5 Hari', 
        'Sewa 7 Hari', 
        'Sewa 2 Minggu', 
        'Sewa 1 Bulan', 
        'Sewa 2 Bulan', 
        'Mute Grup', 
        'Get Link Grup', 
        'Close Grup', 
        'Open Grup'
    ]

    // Membuat tombol secara dinamis dari daftar peraturan
    const menuItems = actions.map(action => {
        const command = action.toLowerCase().replace(/\s+/g, '') // Membuat nama command yang bersih (tanpa spasi)
        return { 
            buttonId: `.${command} ${groupId}`, 
            buttonText: { displayText: `➕ ${action}` }
        }
    })

    // Fungsi untuk mengirimkan tombol dalam beberapa batch
    const sendButtonsInBatches = async (buttons) => {
        const batchSize = 3; // Set jumlah tombol per batch
        for (let i = 0; i < buttons.length; i += batchSize) {
            const batch = buttons.slice(i, i + batchSize);
            await conn.sendMessage(m.chat, {
                image: fs.existsSync('./media/ubedbot.jpg') ? fs.readFileSync('./media/ubedbot.jpg') : null,
                caption: caption,
                buttons: batch,
                headerType: 4
            }, { quoted: m });
            // Delay antar pengiriman tombol agar tidak terlalu cepat
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    // Mengirimkan tombol dalam batch
    sendButtonsInBatches(menuItems);
}

handler.command = ['peraturan']
handler.owner = true

export default handler