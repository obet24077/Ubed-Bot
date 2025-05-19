import crypto from 'crypto'
import PhoneNumber from 'awesome-phonenumber'
import { generateWAMessageFromContent, proto } from '@adiwajshing/baileys'

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!conn.registrasi) conn.registrasi = {}
  if (conn.registrasi[m.chat] && conn.registrasi[m.chat][m.sender]) return m.reply('You are requesting verification!')
  const user = global.db.data.users[m.sender]
  const indraa = await conn.getName(m.sender)
  if (user.registered) return conn.reply(m.chat, '```✅ Nomor Kamu Udah Terverifikasi```', m)

  const sn = crypto.createHash('md5').update(m.sender).digest('hex')
  const newCaptcha = captcha()
  const image = Buffer.from(newCaptcha.image.split(',')[1], 'base64')

  const confirm = "Silahkan Copy Kode Kamu Dengan Mengklik Tombol Salin Di Bawah Ini Lalu Kirim Ke Dalam Chat Ini"
  const msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({ text: confirm }),
          footer: proto.Message.InteractiveMessage.Footer.create({ text: "" }),
          header: proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: false }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [{
              name: "cta_copy",
              buttonParamsJson: JSON.stringify({
                display_text: "Salin Kodemu",
                id: "123456789",
                copy_code: newCaptcha.value
              })
            }]
          })
        })
      }
    }
  }, { quoted: m })

  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

  if (!conn.registrasi[m.chat]) conn.registrasi[m.chat] = {}
  conn.registrasi[m.chat][m.sender] = {
    message: m,
    sender: m.sender,
    otp: newCaptcha.value,
    user,
    key: msg.key,
    timeout: setTimeout(() => {
      conn.sendMessage(m.chat, { delete: msg.key })
      delete conn.registrasi[m.chat][m.sender]
    }, 60000)
  }
}

handler.before = async (m, { conn }) => {
  if (!conn.registrasi) conn.registrasi = {}
  if (m.isBaileys || !conn.registrasi[m.chat] || !conn.registrasi[m.chat][m.sender]) return
  if (!m.text) return

  const { timeout, otp, message, sender, user, key } = conn.registrasi[m.chat][m.sender]
  if (m.id === message.id || m.id === key.id) return

  if (m.text === otp) {
    clearTimeout(timeout)
    delete conn.registrasi[m.chat][m.sender]

    const v2 = {
      key: { participant: '0@s.whatsapp.net', remoteJid: "0@s.whatsapp.net" },
      message: { conversation: "REGISTER (2/3)" }
    }

    const name = await conn.sendInputMessage(m.chat, { text: "Masukan Nama Anda:" }, m.sender, 120000, v2)

    const v3 = {
      key: { participant: '0@s.whatsapp.net', remoteJid: "0@s.whatsapp.net" },
      message: { conversation: "REGISTER (3/3)" }
    }

    let age
    while (isNaN(age)) {
      age = parseInt(await conn.sendInputMessage(m.chat, { text: "Masukan Umur Anda:" }, m.sender, 120000, v3))
    }

    user.name = name.trim()
    user.age = age
    user.regTime = +new Date
    user.registered = true

    const indraa = '0@s.whatsapp.net'
    const v4 = {
      key: { participant: '0@s.whatsapp.net', remoteJid: "0@s.whatsapp.net" },
      message: { conversation: "REGISTER SUCCES" }
    }

    const today = new Date()
    const tanggal = today.toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })

    const ppUrl = await conn.profilePictureUrl(m.sender, 'image').catch(_ => "https://telegra.ph/file/1dff1788814dd281170f8.jpg")

    let tteks = 'Success Verifed\n\n'
    tteks += '```Name:``` ' + name + '\n'
    tteks += '```Age:``` ' + age + '\n'
    tteks += '```Number:``` ' + PhoneNumber('+' + m.sender.split('@')[0]).getNumber('international') + '\n'
    tteks += '```Date:``` ' + tanggal + '\n'
    tteks += 'Thank You\n\n'
    tteks += `> Powered By _@${indraa.replace(/@.+/g, '')}_`

    await conn.sendMessage(m.chat, {
      text: tteks,
      contextInfo: {
        mentionedJid: [indraa],
        externalAdReply: {
          showAdAttribution: true,
          title: global.namebot || "Bot",
          body: 'Version: 3.0.1',
          thumbnailUrl: ppUrl,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: v4 })

    const notif = '```Registers Notifications```\n\n'
      + `\`\`\`- Name: ${name}\`\`\`\n`
      + `\`\`\`- Age: ${age}\`\`\`\n`
      + `\`\`\`- Tags: @${m.sender.replace(/@.+/g, '')}\`\`\``

    await conn.notify(notif)
  } else {
    await m.reply('🚫 Your verification code is wrong.')
    clearTimeout(timeout)
    await conn.sendMessage(m.chat, { delete: key })
    delete conn.registrasi[m.chat][m.sender]
  }
}

handler.help = ["register", "daftar"]
handler.tags = ["start"]
handler.command = /^(rg)$/i

export default handler