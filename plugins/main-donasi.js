import fetch from "node-fetch"
import { generateWAMessageFromContent } from "@adiwajshing/baileys"
let handler = async (m, { conn }) => {
let pp = 'https://telegra.ph/file/e6cd40fbc23607baa5c4c.jpg'
try {
    pp = await conn.profilePictureUrl(m.sender, 'image')
  } catch (e) {
  }

let msg = await generateWAMessageFromContent(m.chat, { locationMessage: {
  degreesLatitude: 0,
  degreesLongitude: 0,
  name: `ᴘᴇɴᴄᴇᴛ ᴛᴜʟɪsᴀɴ ɪɴɪ`,
  address: `🎋 ᴅᴏɴᴀᴛᴇ 🎋`,
  url: 'https://saweria.co/nanaobot',
  isLive: true,
  accuracyInMeters: 0,
  speedInMps: 0,
  degreesClockwiseFromMagneticNorth: 2,
  comment: ``,
  jpegThumbnail: await( await fetch(pp)).buffer()
}}, { quoted: m })

return conn.relayMessage(m.chat, msg.message, {})
}
handler.help = ['donasi']
handler.tags = ['main']
handler.command = /^(donasi|donate)$/i

export default handler