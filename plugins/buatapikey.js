import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import { fileURLToPath } from 'url'

// Untuk mendapatkan __dirname di ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const apikeyFilePath = path.join(__dirname, '..', 'apikey.json') // Sesuaikan path jika perlu

let handler = async (m, { text, usedPrefix, command }) => {
  if (command !== 'buatapikey') return

  const parts = text.split('|').map(v => v.trim()).filter(Boolean)
  const apiKeyName = parts[0]
  const expiryDaysStr = parts[1]

  console.log('Input Text:', text)
  console.log('Parts:', parts)
  console.log('apiKeyName:', apiKeyName)
  console.log('expiryDaysStr:', expiryDaysStr)

  if (!apiKeyName || !expiryDaysStr) {
    throw `Contoh penggunaan: ${usedPrefix}${command} ubedapi | 30`
  }

  const expiryDays = parseInt(expiryDaysStr)
  if (isNaN(expiryDays) || expiryDays <= 0) {
    throw 'Batas waktu kedaluwarsa harus berupa angka positif (dalam hari).'
  }

  const now = new Date()
  const expiryDate = new Date(now.setDate(now.getDate() + expiryDays))
  const expiryTimestamp = expiryDate.getTime()

  const githubUsername = 'Obet24077'
  const repo = 'Baru'
  const token = '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'
  const branch = 'main'
  const settingsApiUrl = `https://api.github.com/repos/${githubUsername}/${repo}/contents/src/settings.json`

  try {
    // 1. Ambil settings.json
    const resSettings = await fetch(settingsApiUrl, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const jsonSettings = await resSettings.json()
    const shaSettings = jsonSettings.sha
    const settings = JSON.parse(Buffer.from(jsonSettings.content, 'base64').toString())

    // 2. Tambahkan API key ke settings
    if (!Array.isArray(settings.apiSettings.apikey)) {
      settings.apiSettings.apikey = []
    }

    // Cek apakah sudah ada
    if (settings.apiSettings.apikey.includes(apiKeyName)) {
      throw `API key "${apiKeyName}" sudah ada. Gunakan nama lain.`
    }

    settings.apiSettings.apikey.push(apiKeyName)

    // 3. Upload ulang ke GitHub
    const encodedSettings = Buffer.from(JSON.stringify(settings, null, 2)).toString('base64')
    await fetch(settingsApiUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json'
      },
      body: JSON.stringify({
        message: `Automated update: Add API key "${apiKeyName}" with expiry tracked locally`,
        content: encodedSettings,
        branch,
        sha: shaSettings
      })
    })

    // 4. Simpan ke apikey.json lokal
    let apikeysData = {}
    try {
      const fileContent = fs.readFileSync(apikeyFilePath, 'utf8')
      apikeysData = JSON.parse(fileContent)
    } catch (e) {
      // Lewatkan jika file belum ada
    }

    apikeysData[apiKeyName] = { expiry: expiryTimestamp }

    fs.writeFileSync(apikeyFilePath, JSON.stringify(apikeysData, null, 2), 'utf8')
    console.log(`API key "${apiKeyName}" disimpan dengan kedaluwarsa ${new Date(expiryTimestamp).toISOString()}`)

    // 5. Respon ke pengguna
    m.reply(`✅ API key "${apiKeyName}" berhasil dibuat dan akan kedaluwarsa pada: \`${new Date(expiryTimestamp).toISOString()}\` (berlaku ${expiryDays} hari). Disimpan di \`apikey.json\` server.`)

  } catch (error) {
    console.error('Gagal membuat API key:', error)
    m.reply('❌ Gagal menambahkan API key. Terjadi kesalahan.')
  }
}

handler.command = ['buatapikey']
handler.tags = ['owner']
handler.help = ['buatapikey <nama_api_key> | <masa_berlaku_hari>']
handler.owner = true

export default handler