import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'

const configPath = './config.json'
const apikeyPath = './apikey.json'

const githubUsername = 'Obet24077'
const repo = 'Baru'
const branch = 'main'
const token = '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'
const settingsUrl = `https://api.github.com/repos/${githubUsername}/${repo}/contents/src/settings.json`

async function loadSettingsJson() {
  const res = await fetch(settingsUrl, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw `Gagal memuat settings.json dari GitHub`
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

function isExpired(expiredTime) {
  return Date.now() > Number(expiredTime)
}

async function autoCleanExpiredKeys() {
  try {
    if (!fs.existsSync(configPath) || !fs.existsSync(apikeyPath)) return

    const config = JSON.parse(fs.readFileSync(configPath))
    if (!config.autoCleanEnabled) return

    const apikeys = JSON.parse(fs.readFileSync(apikeyPath))
    const expiredKeys = Object.entries(apikeys)
      .filter(([key, info]) => isExpired(info.expired))
      .map(([key]) => key)

    if (expiredKeys.length === 0) return

    // Hapus dari apikey.json
    for (const key of expiredKeys) delete apikeys[key]
    fs.writeFileSync(apikeyPath, JSON.stringify(apikeys, null, 2))

    // Hapus dari settings.json di GitHub
    const { content: settings, sha } = await loadSettingsJson()
    settings.apiSettings.apikey = settings.apiSettings.apikey.filter(k => !expiredKeys.includes(k))
    await updateSettingsJson(settings, sha, `AutoClean: ${expiredKeys.length} key expired`)

    console.log(`[AutoClean] ${expiredKeys.length} API key expired telah dihapus`)
  } catch (err) {
    console.error('[AutoClean Error]', err)
  }
}

// Jalankan interval auto clean tiap 60 detik
setInterval(autoCleanExpiredKeys, 60_000)

export default function () {} // Plugin ini tidak perlu handler