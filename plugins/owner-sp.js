import fs from 'fs'
import syntaxError from 'syntax-error'
import path from 'path'
import util from 'util'

const _fs = fs.promises

let handler = async (m, { text, usedPrefix, command, __dirname }) => {
    if (!text) throw `
Penggunaan: ${usedPrefix}${command} <name file>
Contoh: ${usedPrefix}savefile main.js
        ${usedPrefix}saveplugin owner
`.trim()
    if (!m.quoted) throw `Reply Kodenya`
    if (/p(lugin)?/i.test(command)) {
        let filename = text.replace(/plugin(s)\//i, '') + (/\.js$/i.test(text) ? '' : '.js')
        const error = syntaxError(m.quoted.text, filename, {
            sourceType: 'module',
            allowReturnOutsideFunction: true,
            allowAwaitOutsideFunction: true
        })
        if (error) throw error
    let path = `plugins/${text}.js`; // Modifikasi path untuk menyimpan ke direktori 'plugins' dengan ekstensi file '.js'

  await fs.writeFileSync(path, m.quoted.text);
        m.reply(`
Sukses Menyimpan Di *${filename}*


`.trim())
    } else {
        const isJavascript = m.quoted.text && !m.quoted.mediaMessage && /\.js/.test(text)
        if (isJavascript) {
            const error = syntaxError(m.quoted.text, text, {
                sourceType: 'module',
                allowReturnOutsideFunction: true,
                allowAwaitOutsideFunction: true
            })
            if (error) throw error
            await _fs.writeFile(text, m.quoted.text)
            m.reply(`
Sukses Menyimpan Di *${text}*

`.trim())
        } else if (m.quoted.mediaMessage) {
            const media = await m.quoted.download()
            await _fs.writeFile(text, media)
            m.reply(`
Sukses Menyimpan Di *${text}*
`.trim())
        } else {
            throw 'Tidak Support!!'
        }
    }
}
handler.command = /^(sp)$/i

handler.rowner = true

export default handler