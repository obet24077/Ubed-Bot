import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const apikeyFilePath = path.join(__dirname, '..', 'apikey.json')

let handler = async (m, { text, command }) => {
  if (command !== 'cekapikey') return
  if (!text) throw 'Masukkan nama API key. Contoh: .cekapikey ubedapi'

  try {
    if (!fs.existsSync(apikeyFilePath)) throw 'Tidak ditemukan file apikey.json.'

    const content = fs.readFileSync(apikeyFilePath, 'utf8')
    const data = JSON.parse(content)
    const entry = data[text]

    if (!entry) throw `API key "${text}" tidak ditemukan.`
    const now = Date.now()

    if (entry.expiry < now) throw `API key "${text}" sudah kedaluwarsa.`

    const remaining = Math.ceil((entry.expiry - now) / (1000 * 60 * 60 * 24))
    m.reply(`✅ API key "${text}" masih aktif dan akan kedaluwarsa dalam ${remaining} hari.`)
  } catch (e) {
    m.reply(`❌ ${e}`)
  }
}

handler.command = ['cekapikey']
handler.tags = ['owner']
handler.help = ['cekapikey <namaapikey>']
handler.owner = false

export default handler