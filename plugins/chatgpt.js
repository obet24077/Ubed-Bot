const nomor = [{ name: "ChatGPT", jid: "18002428478@s.whatsapp.net" }]

let ponta = async (m, { conn, args }) => {

   const fverif = {
        "key": {
            "participant": '18002428478@s.whatsapp.net',
            "remoteJid": "18002428478@s.whatsapp.net",
            "fromMe": false,
            "id": "Halo",
        },
        "message": {
            "conversation": m.text
        }
    };
    
  let text
  if (args.length >= 1) {
    text = args.join(" ")
  } else if (m.quoted && m.quoted.text) {
    text = m.quoted.text
  } else throw "Input teks diperlukan."
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ""
  await m.reply(wait)
  let media = null
  if (/image\/(png|jpe?g)/.test(mime)) {
    media = await q.download()
  } else if (mime) {
    return await m.reply("Format gambar tidak didukung.")
  }
  if (media) {
    await conn.sendMessage(nomor[0].jid, { image: media, caption: text }, { quoted: fverif })
  } else {
    await conn.sendMessage(nomor[0].jid, { text: text }, { quoted: fverif })
  }
  let arifureta = () => {
    return new Promise((resolve) => {
      conn.ev.on("messages.upsert", ({ messages }) => {
        let msg = messages[0]
        if (msg.key.remoteJid === nomor[0].jid && msg.message?.conversation) {
          resolve(msg.message.conversation)
        }
      })
    })
  }
  let ans = await arifureta()
  await m.reply(ans)
}
ponta.help = ["chatgpt"]
ponta.tags = ["ai"]
ponta.command = ["chatgpt"]
ponta.limit = 1;
ponta.private = false

export default ponta