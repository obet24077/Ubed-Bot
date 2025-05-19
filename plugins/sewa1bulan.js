import fs from 'fs'

const handler = async (m, { conn, args }) => {
    const groupId = args[0]
    if (!groupId || !groupId.endsWith('@g.us')) return m.reply('⚠️ ID grup tidak valid.')

    // Menyimpan data sewa di file
    const sewaData = {
        groupId,
        sewaDuration: '1 Bulan',
        timestamp: Date.now()
    }

    fs.writeFileSync(`./data/${groupId}_sewa.json`, JSON.stringify(sewaData))

    m.reply(`✅ Grup ${groupId} telah disewa selama 1 bulan.`)
}

handler.command = ['sewa1bulan']
handler.owner = true

export default handler