import fetch from "node-fetch"

let handler = async (m, { conn, isOwner, usedPrefix, command, text }) => {
    if (!text) throw 'Example: .animedif highly detailed, intricate, 4k, 8k, sharp focus, detailed hair, detailed'
    m.reply(wait)
    try {
        conn.sendFile(m.chat, await(await fetch(`https://widipe.com/dalle?text=${encodeURIComponent(text)}`)).buffer(), 'anu.jpg', `Prompt: ${text}`, m)
    } catch (e) {
        m.reply(eror)
    }
}

handler.help = ['dalle']
handler.tags = ['ai']
handler.command = /^(dalle)$/i
handler.limit = true
export default handler