import { join } from 'path'
import { unlinkSync, existsSync } from 'fs'

let handler = async (m, { conn, args, __dirname, usedPrefix, command }) => {
  let ar = Object.keys(plugins)
  let ar1 = ar.map(v => v.replace('.js', ''))

  if (!args[0]) {
    throw `Uhm.. mana nama pluginnya?\n\nContoh:\n${usedPrefix + command} info`
  }

  if (!ar1.includes(args[0])) {
    return m.reply(`*Plugin tidak ditemukan:*\n\n${ar1.map(v => ' ' + v).join('\n')}`)
  }

  const file = join(__dirname, '../plugins/' + args[0] + '.js')

  if (!existsSync(file)) {
    return m.reply(`File tidak ditemukan: plugins/${args[0]}.js`)
  }

  try {
    unlinkSync(file)
    conn.reply(m.chat, `✅ Berhasil menghapus *plugins/${args[0]}.js*`, m)
  } catch (err) {
    console.error(err)
    conn.reply(m.chat, `❌ Gagal menghapus file: *${args[0]}.js*\n\nError: ${err.message}`, m)
  }
}

handler.help = ['df']
handler.tags = ['owner']
handler.command = /^(df)$/i
handler.mods = true

export default handler