import fs from 'fs'
import path from 'path'

let handler = async (m, { text, conn, usedPrefix, command }) => {
  if (!text) throw `Contoh: ${usedPrefix + command} sabar ya Senpai`

  const folderPath = './plugins'
  let files = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'))
  let results = []

  for (let file of files) {
    let content = fs.readFileSync(path.join(folderPath, file), 'utf8')
    if (content.toLowerCase().includes(text.toLowerCase())) {
      results.push(file)
    }
  }

  if (results.length === 0) throw 'Nggak ada file yang mengandung teks itu!'
  m.reply(`Ditemukan teks dalam file:\n\n${results.map(f => '- ' + f).join('\n')}`)
}

handler.help = ['cekpesan <teks>']
handler.tags = ['tools']
handler.command = /^cekpesan$/i

export default handler