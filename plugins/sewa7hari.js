import fs from 'fs'

const handler = async (m, { conn, args }) => {
    const groupId = args[0]
    if (!groupId || !groupId.endsWith('@g.us')) return m.reply('⚠️ ID grup tidak valid.')

    // Menyimpan data sewa di file
    const sewaData = {
        groupId,
        sewaDuration: '7 Hari',
        timestamp: Date.now()
    }

    fs.writeFileSync(`./data/${groupId}_sewa.json`, JSON.stringify(sewaData))

    m.reply(`✅ Grup ${groupId} telah disewa selama 7 hari.`)
}

handler.command = ['sewa7hari']
handler.owner = true

export default handler