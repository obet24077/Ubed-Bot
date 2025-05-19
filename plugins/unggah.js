import fetch from "node-fetch"
import FormData from "form-data"

// Fungsi upload ke Catbox
async function uploadToCatbox(buffer, filename, contentType) {
  const form = new FormData()
  form.append("reqtype", "fileupload")
  form.append("fileToUpload", buffer, { filename, contentType })

  try {
    const res = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: form,
    })
    const url = await res.text()
    if (!url.startsWith("https://")) throw new Error("Upload ke Catbox gagal.")
    return url.trim()
  } catch (err) {
    console.error("Gagal mengunggah ke Catbox:", err)
    return null
  }
}

const handler = async (m, { conn }) => {
  const q = m.quoted ? m.quoted : m
  const mime = (q.msg || q).mimetype || ""

  if (!mime) return m.reply("❌ Tidak dapat mendeteksi tipe file.")

  const media = await q.download?.()
  if (!media) return m.reply("❌ Gagal mengunduh file.")

  // Deteksi ekstensi
  let ext = mime.split("/")[1] || "bin"

  // Paksa jadi mp3 jika audio
  if (mime.startsWith("audio/")) ext = "mp3"

  const filename = `file.${ext}`

  await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

  const catboxUrl = await uploadToCatbox(media, filename, mime)
  if (!catboxUrl) {
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
    return m.reply("❌ *Gagal mengunggah ke Catbox.*\nCoba lagi nanti.")
  }

  await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } })

  m.reply(
`╭━━━[ *✅ Upload Sukses!* ]━━━╮
┃ 
┃ 📁 *Nama:* ${filename}
┃ 🧾 *Mime:* ${mime}
┃ 🌐 *Link:* 
┃ ${catboxUrl}
┃ 
┃ ✨ File kamu siap dibagikan!
╰━━━━━━━━━━━━━━━━━━━━╯`
  )
}

handler.help = ["unggah (balas file apapun)"]
handler.tags = ["tools"]
handler.command = /^(unggah|tourl|upload)$/i

export default handler