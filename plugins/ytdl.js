import fs from 'fs'
import os from 'os'
import path from 'path'
import play from 'play-dl'
import { pipeline } from 'stream/promises'
import fetch from 'node-fetch'
import yts from 'yt-search'

const handler = async (m, { conn, text, args, usedPrefix, command }) => {
  if (!text) return m.reply(`Masukkan judul atau link YouTube!\nContoh: *${usedPrefix + command} kangen band*`)

  await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

  let search = await yts(text)
  let videos = search.videos.slice(0, 6)

  if (!videos.length) throw 'Video tidak ditemukan.'

  let videoUtama = videos[0]
  await downloadAndSend(m, conn, videoUtama, videos, usedPrefix, command)
}

export default handler
handler.help = ['yta <judul/link>']
handler.tags = ['downloader']
handler.command = /^yta$/i

async function downloadAndSend(m, conn, videoUtama, videos, usedPrefix, command) {
  try {
    let { title, timestamp, views, ago, url } = videoUtama
    let filename = title.replace(/[^\w\s]/gi, '').substring(0, 50)
    let tempPath = path.join(os.tmpdir(), `${filename}.mp3`)

    const stream = await play.stream(url)
    const audioStream = stream.stream
    const writableStream = fs.createWriteStream(tempPath)
    await pipeline(audioStream, writableStream)

    let caption = `🎶 *YouTube MP3 Download*\n\n📌 *Judul:* ${title}\n⏳ *Durasi:* ${timestamp}\n👁️ *Views:* ${views.toLocaleString()} views\n📆 *Upload:* ${ago}\n🔗 *Link:* ${url}`

    let buttons = [
      { buttonId: '.owner', buttonText: { displayText: '✆ owner' }, type: 1 },
      { buttonId: `.playvideo ${url}`, buttonText: { displayText: '⎚ Download Video' }, type: 1 },
      {
        buttonId: 'action',
        buttonText: { displayText: 'Pilih Video Lain' },
        type: 4,
        nativeFlowInfo: {
          name: 'single_select',
          paramsJson: JSON.stringify({
            title: '📌 Pilih Video',
            sections: [
              {
                title: 'Hasil Pencarian Lainnya',
                rows: videos.map((video, index) => ({
                  header: `🎵 Lagu #${index + 1}`,
                  title: `${video.title}`,
                  description: `⏳ ${video.timestamp} | 👁️ ${video.views.toLocaleString()} views`,
                  id: `${usedPrefix}${command} ${video.url}`,
                }))
              }
            ]
          })
        }
      }
    ]

    await conn.sendMessage(m.chat, {
      document: { url: tempPath },
      mimetype: 'audio/mpeg',
      fileName: `${filename}.mp3`,
      caption,
      footer: 'Ubed Bot',
      buttons,
      headerType: 1,
      viewOnce: true
    }, { quoted: m })

    fs.unlink(tempPath, err => {
      if (err) console.error(`Gagal hapus file: ${err}`)
    })

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
    m.reply(`❌ Gagal mendownload audio!\n\n${e.message || e}`)
  }
}