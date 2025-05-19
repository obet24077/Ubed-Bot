import fs from 'fs'

const handler = async (m, { conn, usedPrefix }) => {
  const premiumPlugins = Object.values(global.plugins).filter(
    v => v.premium === true
  )

  if (!premiumPlugins.length) {
    return m.reply('_Tidak ada fitur premium yang tersedia._')
  }

  let caption = `   *──「 MENU PREMIUM 」──*\n\n`
  const commands = []

  for (const plugin of premiumPlugins) {
    if (Array.isArray(plugin.help) && plugin.help.length > 0) {
      commands.push(...plugin.help.map(cmd => `${usedPrefix}${cmd}`))
    } else if (plugin.command) {
      const cmdArray = Array.isArray(plugin.command) ? plugin.command : [plugin.command]
      commands.push(...cmdArray.map(cmd =>
        typeof cmd === 'string' ? `${usedPrefix}${cmd}` : `${usedPrefix}${cmd.source}`
      ))
    }
  }

  caption += commands.map(cmd => `   ▧     ${cmd}`).join('\n')
  caption += `\n\nTotal fitur premium: ${commands.length}`

  const docPath = './ubed.mp3'
  if (!fs.existsSync(docPath)) {
    return conn.sendMessage(m.chat, { text: '❌ File ubed.mp3 tidak ditemukan!' }, { quoted: m })
  }

  await conn.sendMessage(m.chat, {
    document: fs.readFileSync(docPath),
    fileName: 'ubed.mp3',
    fileLength: fs.statSync(docPath).size,
    mimetype: 'audio/mpeg',
    caption,
    contextInfo: {
      externalAdReply: {
        title: 'Ubed MD || Premium Menu',
        body: 'By Ubed MD',
        thumbnailUrl: 'https://files.catbox.moe/pm5w5o.jpg',
        mediaType: 1,
        renderLargerThumbnail: true,
      },
      forwardingScore: 10,
      isForwarded: true,
      mentionedJid: [m.sender],
    },
    buttons: [
      { buttonId: '.menuall', buttonText: { displayText: 'Menu Utama' }, type: 1 }
    ],
    headerType: 1,
    viewOnce: true
  })
}

handler.help = ['fiturpremium']
handler.tags = ['main']
handler.command = /^fiturpremium$/i

export default handler