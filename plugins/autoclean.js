import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const configPath = path.join(__dirname, '../config.json')
const apikeyPath = path.join(__dirname, '../apikey.json')

// Auto-create config.json and apikey.json if missing
function ensureFilesExist() {
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify({ autoCleanEnabled: false }, null, 2))
  }
  if (!fs.existsSync(apikeyPath)) {
    fs.writeFileSync(apikeyPath, JSON.stringify({}, null, 2))
  }
}
ensureFilesExist()

// GitHub repo details
const githubUsername = 'Obet24077'
const repo = 'Baru'
const branch = 'main'
const token = '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'
const settingsUrl = `https://api.github.com/repos/${githubUsername}/${repo}/contents/src/settings.json`

async function loadSettingsJson() {
  const res = await fetch(settingsUrl, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw `Gagal memuat settings.json dari GitHub.`
  const json = await res.json()
  return {
    sha: json.sha,
    content: JSON.parse(Buffer.from(json.content, 'base64').toString())
  }
}

async function updateSettingsJson(content, sha, message) {
  const encoded = Buffer.from(JSON.stringify(content, null, 2)).toString('base64')
  await fetch(settingsUrl, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json'
    },
    body: JSON.stringify({ message, content: encoded, branch, sha })
  })
}

async function deleteApiKeyManually(key) {
  let data = JSON.parse(fs.readFileSync(apikeyPath))
  if (!(key in data)) throw `API key *${key}* tidak ditemukan.`

  delete data[key]
  fs.writeFileSync(apikeyPath, JSON.stringify(data, null, 2))

  let { content: settings, sha } = await loadSettingsJson()
  settings.apiSettings.apikey = settings.apiSettings.apikey.filter(k => k !== key)
  await updateSettingsJson(settings, sha, `Manual delete API key: ${key}`)
}

function setAutoClean(status) {
  let config = JSON.parse(fs.readFileSync(configPath))
  config.autoCleanEnabled = status
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
}

let handler = async (m, { args, command }) => {
  if (command === 'autoclean') {
    if (!args[0] || !['on', 'off'].includes(args[0].toLowerCase()))
      throw `Contoh: .autoclean on | .autoclean off`

    let status = args[0].toLowerCase() === 'on'
    setAutoClean(status)
    m.reply(`Fitur auto-clean sekarang *${status ? 'AKTIF' : 'NONAKTIF'}*`)
  }

  if (command === 'delkey') {
    if (!args[0]) throw `Contoh: .delkey <apikey>`
    try {
      await deleteApiKeyManually(args[0])
      m.reply(`API key *${args[0]}* berhasil dihapus.`)
    } catch (e) {
      m.reply(String(e))
    }
  }
}

handler.command = ['autoclean', 'delkey']
handler.tags = ['owner']
handler.help = ['autoclean on/off', 'delkey <apikey>']
handler.owner = true

export default handler