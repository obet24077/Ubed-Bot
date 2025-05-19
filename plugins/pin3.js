import fetch from 'node-fetch'
const {
    proto,
    generateWAMessageFromContent,
    prepareWAMessageMedia
} = (await import('@adiwajshing/baileys')).default
import { googleImage } from '@bochilteam/scraper'

var handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Use example ${usedPrefix}${command} ponta`
    m.reply('Please wait...')

    try {
        // Fetch Google images using the input text
        const res = await googleImage(text)
        let image = res.getRandom() // Random image from the result
        let link = image

        // Prepare the buttons for the message
        const buttons = [
            { 
                buttonId: `.pin3 ${text}`, 
                buttonText: { displayText: 'Berikutnya' }, 
                type: 1 
            }
        ]

        // Construct the message
        const message = {
            image: { url: link }, // The image fetched from Google
            caption: `_Nih Kak Hasil Pencarian Dari: ${text}_`, // Caption with the search term
            footer: 'Powered by Ponta Bot', // Footer text (you can customize 'wm' here)
            buttons: buttons, // The button array with the "Berikutnya" button
            headerType: 1, // Image header
            viewOnce: true // Image will be shown only once
        }

        // Send the message to the user
        return await conn.sendMessage(m.key.remoteJid, message, { quoted: m })

    } catch (e) {
        // Handle errors by sending an audio file if something goes wrong
        conn.sendFile(m.chat, 'error.mp3', 'ponta.mp3', null, m, true, {
            type: "audioMessage",
            ptt: true,
        })
    }
}

// Define the handler properties
handler.help = ['pinterest3'] // Help command
handler.tags = ['downloader'] // Tags
handler.command = /^(pinterest3|pin3)$/i // Command regex
handler.limit = true // Command limit

export default handler