import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command, participants }) => {
  const fkontak = {
    key: {
      participants: '6285147777105@s.whatsapp.net',
      remoteJid: 'status@broadcast',
      fromMe: true,
      id: 'Halo'
    },
    message: {
      contactMessage: {
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Bot;;;\nFN:Bot\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Mobile\nEND:VCARD`
      }
    },
    participant: '6285147777105@s.whatsapp.net'
  }

  const teks = args.join(" ") || m.text || ''
  const mentions = participants.map(a => a.id)

  // Jika membalas media (image)
  if (m.quoted && m.quoted.mtype === 'imageMessage') {
    let img = await m.quoted.download()
    await conn.sendMessage(m.chat, {
      image: img,
      caption: teks,
      mentions
    }, { quoted: fkontak })
  } else if (m.mtype === 'imageMessage') {
    // Jika user langsung mengirim gambar dengan command
    let img = await m.download()
    await conn.sendMessage(m.chat, {
      image: img,
      caption: teks,
      mentions
    }, { quoted: fkontak })
  } else {
    // Jika hanya teks
    await conn.sendMessage(m.chat, {
      text: teks,
      mentions
    }, { quoted: fkontak })
  }
}

handler.help = ['hidetag']
handler.tags = ['group']
handler.command = /^(hidetag|ht)$/i

handler.group = true
handler.admin = true

export default handler