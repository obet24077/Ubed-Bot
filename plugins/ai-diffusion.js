import fetch from "node-fetch"


let handler = async (m, { conn, isOwner, usedPrefix, command, text }) => {
if (!text) throw 'Example: .diffusion highly detailed, intricate, 4k, 8k, sharp focus, detailed hair, detailed'
m.reply(wait)
try {
conn.sendFile(m.chat, await(await fetch(`https://skizo.tech/api/3dr?apikey=Ponta-XD&prompt=`)).buffer(), 'anu.jpg', `Prompt: ${text}`, m)
} catch (e) {
m.reply(eror)
}
    
}
handler.help = ['diffusion']
handler.tags = ['ai']
handler.command = /^(stabledif|diffusion)$/i
handler.limit = true
export default handler