import fs from "fs"
import { execSync } from "child_process"

let handler = async (m, { conn }) => {
  try {
    const tempDir = "./tmp"
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true })
    let files = fs.readdirSync(tempDir)
    if (files.length > 0) {
      for (let file of files) {
        fs.unlinkSync(`${tempDir}/${file}`)
      }
    }
    await m.reply("*🍏 Wait proses backup.....*")
    const backupName = "Ubed-V2"
    const backupPath = `${tempDir}/${backupName}.zip`
    const ls = (await execSync("ls"))
      .toString()
      .split("\n")
      .filter(
        (pe) =>
          pe !== "node_modules" &&
          pe !== "sessions" &&
          pe !== "package-lock.json" &&
          pe !== "yarn.lock" &&
          pe !== ""
      )
    await execSync(`zip -r ${backupPath} ${ls.join(" ")}`)
    
    // Debugging: log jika backup berhasil dibuat
    console.log(`Backup berhasil dibuat: ${backupPath}`)
    
    // Kirimkan file backup ke private chat
    await conn.sendMessage(m.sender, {
      document: await fs.readFileSync(backupPath),
      fileName: `${backupName}.zip`,
      mimetype: "application/zip"
    }, { quoted: m })
    
    // Debugging: log pengiriman pesan
    console.log(`Pesan berhasil dikirim ke: ${m.sender}`)

    fs.unlinkSync(backupPath)
    m.reply("*Script bot berhasil dikirim ke private chat!*")
  } catch (e) {
    console.error("Error terjadi:", e)
    m.reply("❌ *Gagal membuat backup script!*")
  }
}

handler.help = ["backup"]
handler.tags = ["owner"]
handler.command = /^(backup|bk)$/i
handler.mods = true

export default handler