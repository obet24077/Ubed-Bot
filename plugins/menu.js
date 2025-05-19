import fs from 'fs'
import fetch from 'node-fetch'
import sharp from 'sharp' // Untuk memproses gambar

const handler = async (m, { conn, args, usedPrefix }) => {
    let user = global.db.data.users[m.sender]

    if (!user?.registered) {
        return conn.sendMessage(m.chat, {
            text: `❌ Kamu belum terdaftar!\n\nKetik *${usedPrefix}daftar* untuk mendaftar atau tekan tombol Verify di bawah.`,
            footer: 'Tekan Verify untuk verifikasi otomatis:',
            buttons: [
                { buttonId: '.owner', buttonText: { displayText: '👤 Owner' }, type: 1 },
                { buttonId: '@verify', buttonText: { displayText: '✅ Verify' }, type: 1 },
            ],
            headerType: 1,
            viewOnce: true
        }, { quoted: m })
    }

    const tagArg = (args[0] || '').toLowerCase()

    const plugins = Object.entries(global.plugins)
        .filter(([filename, plugin]) =>
            plugin?.help &&
            !plugin?.disabled &&
            fs.existsSync(`./plugins/${filename}`))
        .map(([_, plugin]) => plugin)

    const fiturAll = plugins.map(p => p.help).flat()
    const tags = [...new Set(plugins.flatMap(p => p.tags || []))]

    const name = m.pushName || 'User'
    const status = global.owner.includes(m.sender)
        ? '👑 Developer'
        : global.db.data.settings[conn.user.jid]?.moderator?.includes(m.sender)
        ? '⚡ Moderator'
        : user.premium
        ? '💎 VIP'
        : '❌ Free'

    const uptime = process.uptime()
    const date = new Date()
    const formattedDate = date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    const time = date.toLocaleTimeString('id-ID')
    const islamicDate = new Intl.DateTimeFormat('id-TN-u-ca-islamic', { dateStyle: 'full' }).format(date)

    const botName = 'Ubed Bot'
    const mode = global.opts['self'] ? 'Self' : 'Public'
    const totalUser = Object.keys(global.db.data.users).length
    const userReg = Object.values(global.db.data.users).filter(u => u.registered).length

    const docPath = './ubed.mp3'

    if (tagArg && tagArg !== 'all') {
        const matchedPlugins = plugins.filter(p => (p.tags || []).includes(tagArg))
        if (!matchedPlugins.length) return m.reply(`❌ Tag *${tagArg}* tidak ditemukan!`)

        const commands = matchedPlugins.map(p => p.help).flat()
        const menuText = `*MENU ${tagArg.toUpperCase()}*\n\n` + commands.map(cmd => `₪    ${usedPrefix}${cmd}`).join('\n')

        return conn.reply(m.chat, menuText, m)
    }

    if (tagArg === 'all') {
        const allMenu = fiturAll.map(cmd => `• ${usedPrefix}${cmd}`).join('\n')
        return conn.reply(m.chat, `*MENU ALL*\n\n${allMenu}`, m)
    }

    let caption = `   *──「 D A S H B O A R D 」──*
     
   ▧    *Name:* ${name}
   ▧    *Status:* ${status}
   ▧    *Limit:* ${user.limit || 0}
   ▧    *Level:* ${user.level || 0}
   ▧    *Dompet:* ${user.money || 0}
   ▧    *Saldo Bank:* ${user.bank || 0}
   ▧    *Total Exp:* ${user.exp || 0}

     *──「 T O D A Y 」──*
   ▧    *Time:* ${time}
   ▧    *Date:* ${formattedDate}
   ▧    *Islamic :* ${islamicDate}

     *──「 S T A T S 」──*
   ▧    *Bot Name:* ${botName}
   ▧    *Mode:* ${mode}
   ▧    *Total Fitur:* ${fiturAll.length}
   ▧    *Total User:* ${totalUser}
   ▧    *Total Register:* ${userReg}
   ▧    *Platform:* Linux
   ▧    *Type:* Node.Js
   ▧    *Baileys:* Multi Device
   ▧    *Uptime:* ${Math.floor(uptime / 3600)}H ${Math.floor((uptime % 3600) / 60)}M ${Math.floor(uptime % 60)}S
`

    let menuList = tags.map(tag => ({
        header: `Menu ${tag.charAt(0).toUpperCase() + tag.slice(1)}`,
        title: `Menampilkan Menu ${tag}`,
        description: `List Menu ${tag}`,
        id: `.menu${tag}`
    }))

    let buttons = [
        { buttonId: '.allmenu', buttonText: { displayText: '📑 Semua Menu' }, type: 1 },
        { buttonId: '.owner', buttonText: { displayText: '✆ Ubed CS' }, type: 1 },
        {
            buttonId: 'action',
            buttonText: { displayText: 'Ubed Bot' },
            type: 4,
            nativeFlowInfo: {
                name: 'single_select',
                paramsJson: JSON.stringify({
                    title: 'Menu List Ubed',
                    sections: [
                        {
                            title: 'Menu Populer Ubed Bot',
                            highlight_label: '',
                            rows: menuList
                        }
                    ]
                })
            }
        }
    ]

    if (!fs.existsSync(docPath)) return m.reply("❌ File ubed.mp3 tidak ditemukan!")

    let userProfilePic
    try {
        userProfilePic = await conn.profilePictureUrl(m.sender, 'image')
    } catch {
        userProfilePic = 'https://telegra.ph/file/265c672094dfa87caea19.jpg'
    }

    const ppBuffer = await (await fetch(userProfilePic)).buffer()

    // Memproses gambar PP agar tidak transparan
    const processedPpBuffer = await sharp(ppBuffer)
        .resize(128, 128) // Mengubah ukuran gambar agar sesuai
        .toBuffer()

    // Membuat nama file sesuai dengan nama pengguna
    const fileName = `${name.replace(/\s+/g, '_').toLowerCase()}.mp3`

    await conn.sendMessage(m.chat, {
        document: fs.readFileSync(docPath),
        fileName: fileName, // Nama file berdasarkan nama pengguna
        fileLength: fs.statSync(docPath).size,
        mimetype: 'audio/mpeg',
        caption,
        jpegThumbnail: processedPpBuffer, // Gunakan gambar PP yang sudah diproses
        contextInfo: {
            externalAdReply: {
                title: `Ubed MD || Dashboard`,
                body: `By Ubed MD`,
                thumbnailUrl: 'https://files.catbox.moe/9bzxxw.jpg', // tetap pakai ini
                mediaType: 1,
                renderLargerThumbnail: true,
            },
            forwardingScore: 10,
            isForwarded: true,
            mentionedJid: [m.sender],
        },
        buttons,
        headerType: 1,
        viewOnce: true
    })
}

handler.command = ['menu']
handler.help = ['menu']
handler.tags = ['main']

export default handler