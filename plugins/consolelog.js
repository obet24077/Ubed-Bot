import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'

let logProcess
let handler = async (m, { conn, text, args }) => {
  if (!global.db.data) global.db.data = {}

  const isStop = text.trim().toLowerCase() === 'stop'
  if (isStop) {
    if (logProcess) {
      logProcess.kill()
      logProcess = null
      return m.reply('Console log dihentikan.')
    } else {
      return m.reply('Tidak ada log console yang berjalan.')
    }
  }

  if (logProcess) return m.reply('Log console sedang berjalan, ketik *.consolelog stop* untuk hentikan.')

  m.reply('Mengirim log console secara real-time...\nKetik *.consolelog stop* untuk hentikan.')

  logProcess = spawn('tail', ['-f', 'logs/console.log'])

  logProcess.stdout.on('data', (data) => {
    conn.sendMessage(m.chat, { text: data.toString() }, { quoted: m })
  })

  logProcess.stderr.on('data', (data) => {
    conn.sendMessage(m.chat, { text: `ERROR: ${data.toString()}` }, { quoted: m })
  })

  logProcess.on('close', (code) => {
    conn.sendMessage(m.chat, { text: `Log console dihentikan (code ${code})` }, { quoted: m })
  })
}

handler.help = ['consolelog [stop]']
handler.tags = ['owner', 'tools']
handler.command = /^consolelog$/i
handler.owner = true

export default handler