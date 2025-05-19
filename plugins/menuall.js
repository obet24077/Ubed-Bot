import fs from 'fs'

const handler = async (m, { conn, usedPrefix }) => {
  global.db.data.users = global.db.data.users || {}

  let user = global.db.data.users[m.sender] || {
    registered: true,
    name: m.pushName || '',
    limit: 10,
    level: 1,
    money: 1000,
    bank: 0,
    exp: 0,
    premium: false,
  }

  let name = user.name

  let caption = `\`\`\`⟣───「 *All Menu* 」───⟢\`\`\`\n`

  // Ambil semua plugin dan kategori
  let fitur = Object.values(global.plugins).filter(v => Array.isArray(v.help) && v.help.length)
  let tags = [...new Set(fitur.flatMap(v => v.tags || []))]

  tags.forEach(tag => {
    let commands = fitur
      .filter(v => (v.tags || []).includes(tag))
      .flatMap(v => v.help)

    if (commands.length > 0) {
      caption += `\n⟣───「 *${tag.toUpperCase()}* 」───⟢\n`
      caption += commands.map(cmd => {
        // Menambahkan ⓟ untuk fitur premium
        let isPremium = global.plugins[cmd]?.premium ? ' ⓟ' : ''
        return ` │▧    ${usedPrefix}${cmd}${isPremium}`
      }).join('\n')
      caption += `\n⟣──────────⟢\n`
    }
  })

  // Cek dan kirim gambar
  let imagePath = './media/ubedbot.jpg'
  if (!fs.existsSync(imagePath)) return m.reply('❌ Gambar tidak ditemukan!')

  await conn.sendMessage(m.chat, {
    image: fs.readFileSync(imagePath),
    caption: caption,
    buttons: [
      { buttonId: '.menu', buttonText: { displayText: '📚 Menu Awal' }, type: 1 }
    ],
    headerType: 4
  }, { quoted: m })
}

handler.command = ['allmenu']
handler.help = ['allmenu']
handler.tags = ['main']

export default handler