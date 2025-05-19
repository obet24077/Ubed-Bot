import axios from 'axios'
import FormData from 'form-data'
import { fileTypeFromBuffer } from 'file-type'
const baileys = (await import('@adiwajshing/baileys')).default // Sesuaikan Dengan Baileys Kalian
 
async function uploadUguu(buffer) {
  let { ext } = await fileTypeFromBuffer(buffer)
  let filename = `upload.${ext}`
  let form = new FormData()
  form.append('files[]', buffer, { filename })
 
  let { data } = await axios.post('https://uguu.se/upload.php', form, {
    headers: form.getHeaders()
  })
 
  if (!data.files || !data.files[0]) throw 'Upload ke Uguu gagal'
  return data.files[0].url
}
 
async function mentionStatus(jids, content) {
  let colors = ['#7ACAA7', '#6E257E', '#5796FF', '#7E90A4', '#736769', '#57C9FF', '#25C3DC', '#FF7B6C', '#55C265', '#FF898B', '#8C6991', '#C69FCC', '#B8B226', '#EFB32F', '#AD8774', '#792139', '#C1A03F', '#8FA842', '#A52C71', '#8394CA', '#243640']
  let fonts = [0, 1, 2, 6, 7, 8, 9, 10]
  let users = []
 
  for (let id of jids) {
    let data = await conn.groupMetadata(id)
    users.push(...data.participants.map(u => conn.decodeJid(u.id)))
  }
 
  let message = await conn.sendMessage('status@broadcast', content, {
    backgroundColor: colors[Math.floor(Math.random() * colors.length)],
    font: fonts[Math.floor(Math.random() * fonts.length)],
    statusJidList: users,
    additionalNodes: [
      {
        tag: 'meta',
        attrs: {},
        content: [
          {
            tag: 'mentioned_users',
            attrs: {},
            content: jids.map(jid => ({
              tag: 'to',
              attrs: { jid },
              content: undefined
            }))
          }
        ]
      }
    ]
  })
 
  jids.forEach(id => {
    conn.relayMessage(id, {
      groupStatusMentionMessage: {
        message: {
          protocolMessage: {
            key: message.key,
            type: 25
          }
        }
      }
    }, {
      userJid: conn.user.jid,
      additionalNodes: [
        {
          tag: 'meta',
          attrs: { is_status_mention: 'true' },
          content: undefined
        }
      ]
    })
  })
}
 
let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text && command !== 'upsw') throw 'Silakan masukkan teks atau balas media'
 
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  let media, link
  if (mime) {
    media = await q.download()
    link = await uploadUguu(media)
  }
 
  let content = {}
 
  if (command === 'upswimage' && mime.startsWith('image/')) {
    content = { image: { url: link }, caption: text || '' }
  } else if (command === 'upswvideo' && mime.startsWith('video/')) {
    content = { video: { url: link }, caption: text || '' }
  } else if (command === 'upswaudio' && mime.startsWith('audio/')) {
    content = { audio: { url: link } }
  } else if (command === 'upswtext') {
    content = { text: text }
  } else if (command === 'upsw') {
    return m.reply(`MAU YANG MANA?
 
.upswimage <caption>  untuk gambar
.upswvideo <caption>  untuk video
.upswaudio             untuk audio
.upswtext <text>       untuk teks`)
  } else {
    throw 'Jenis file atau perintah tidak didukung'
  }
 
  await mentionStatus([m.chat], content)
}
 
handler.help = ['upswimage', 'upswvideo', 'upswtext', 'upswaudio', 'upsw']
handler.tags = ['owner']
handler.command = /^(upswimage|upswvideo|upswtext|upswaudio|upsw)$/i
handler.owner = false
 
export default handler