const handler = async (m, { conn, usedPrefix, command }) => {
  const tagName = command.replace(/^menu/i, '').toLowerCase()

  if (tagName === 'premium') {
    return m.reply('Menu premium dipindahkan ke *.fiturpremium*')
  }

  const fitur = Object.values(global.plugins)
  const filtered = fitur.filter(v => (v.tags || []).includes(tagName) && !(v.tags || []).includes('premium'))

  if (filtered.length === 0) {
    return m.reply(`Tag *${tagName}* tidak ditemukan atau isinya hanya fitur premium.\nGunakan *.menuall* untuk melihat semua kategori.`)
  }

  let caption = `╭━━━[  MENU ${tagName.toUpperCase()} ]━━━╮\n`

  const commands = []

  for (const plugin of filtered) {
    if (Array.isArray(plugin.help) && plugin.help.length > 0) {
      commands.push(...plugin.help.map(cmd => `${usedPrefix}${cmd}`))
    } else if (plugin.command) {
      const cmdArray = Array.isArray(plugin.command) ? plugin.command : [plugin.command]
      commands.push(...cmdArray.map(cmd =>
        typeof cmd === 'string' ? `${usedPrefix}${cmd}` : `${usedPrefix}${cmd.source}`
      ))
    }
  }

  caption += commands.map(cmd => `▧   ${cmd}`).join('\n')
  caption += `\n┃\n┃ 📌 Total Fitur: ${commands.length}\n╰━━━━━━━━━━━━━━━━━━╯`

  await conn.sendMessage(m.chat, {
    image: { url: 'https://files.catbox.moe/83dzbj.jpg' }, // Ganti jika perlu
    caption: caption,
    buttons: [
      { buttonId: '.menuall', buttonText: { displayText: '📚 Menu Utama' }, type: 1 }
    ],
    headerType: 4
  }, { quoted: m })
}

handler.command = /^menu(\w+)$/i
handler.tags = ['main']
handler.help = ['menu<tag>']

export default handler