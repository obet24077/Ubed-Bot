import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) throw `Contoh: ${usedPrefix + command} sticker-dino/sticker`

  let [filenameRaw, categoryRaw, manualPath] = text.split('/')
  if (!filenameRaw.endsWith('.js')) filenameRaw += '.js'
  const filename = filenameRaw.trim()
  const categoryName = categoryRaw?.trim()
  const customPath = manualPath?.trim() || '';  // Path manual yang dimasukkan pengguna
  if (!categoryName) throw 'Tentukan nama kategori.'

  const q = m.quoted || m.reply_message
  if (!q) throw 'Balas file atau teks plugin .js'

  let pluginCode
  if (q.mtype === 'documentMessage') {
    const buffer = await q.download()
    pluginCode = buffer.toString()
  } else if (q.text && q.text.includes('module.exports')) {
    pluginCode = q.text
  } else {
    throw 'Plugin harus berupa file JS atau teks valid.'
  }

  const githubUsername = 'Obet24077'
  const repo = 'Baru'
  const token = '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'
  const branch = 'main'

  const githubApiPlugin = `https://api.github.com/repos/${githubUsername}/${repo}/contents/src/api/${categoryName}/${filename}`
  const encodedPlugin = Buffer.from(pluginCode).toString('base64')

  // Upload plugin file ke GitHub
  let shaPlugin = null
  try {
    const res = await fetch(githubApiPlugin, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.ok) {
      const json = await res.json()
      shaPlugin = json.sha
    }
  } catch {}

  await fetch(githubApiPlugin, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json'
    },
    body: JSON.stringify({
      message: `Update plugin ${filename}`,
      content: encodedPlugin,
      branch,
      ...(shaPlugin ? { sha: shaPlugin } : {})
    })
  })

  // Deteksi parameter dari plugin
  const queryParams = [...pluginCode.matchAll(/req\.query\.(\w+)/g)].map(m => m[1])
  const paramList = ['apikey', ...queryParams.filter(p => p !== 'apikey')]
  const endpointPath = `/${categoryName}/${filename.replace('.js', '')}?` + paramList.map(p => `${p}=`).join('&') + customPath; // Menambahkan path manual di sini

  // Fetch settings.json
  const settingsApiUrl = `https://api.github.com/repos/${githubUsername}/${repo}/contents/src/settings.json`
  const resSettings = await fetch(settingsApiUrl, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const jsonSettings = await resSettings.json()
  const shaSettings = jsonSettings.sha
  const settings = JSON.parse(Buffer.from(jsonSettings.content, 'base64').toString())

  // Modifikasi settings.json
  if (!Array.isArray(settings.categories)) settings.categories = []

  let category = settings.categories.find(c => c.name.toLowerCase() === categoryName.toLowerCase())
  if (!category) {
    category = { name: categoryName, items: [] }
    settings.categories.push(category)
  }

  const exists = category.items.find(i => i.path === endpointPath)
  if (!exists) {
    category.items.push({
      name: filename.replace('.js', ''),
      desc: 'Ubed Api',
      path: endpointPath,
      status: 'ready',
      params: Object.fromEntries(paramList.map(p => [p, '']))
    })
  }

  // Upload settings.json ke GitHub
  const encodedSettings = Buffer.from(JSON.stringify(settings, null, 2)).toString('base64')
  await fetch(settingsApiUrl, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json'
    },
    body: JSON.stringify({
      message: `Update settings.json: add ${endpointPath}`,
      content: encodedSettings,
      branch,
      sha: shaSettings
    })
  })

  m.reply(`✅ Plugin *${filename}* berhasil diunggah dan disimpan ke kategori *${categoryName}*!\nPath: \`${endpointPath}\``)
}

handler.command = ['spg']
handler.tags = ['tools']
handler.help = ['spg <namafile>/<kategori> (balas plugin .js atau teks)']
handler.owner = true

export default handler