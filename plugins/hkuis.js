let handler = async (m, { conn }) => {
  let id = m.chat
  global.kuis = global.kuis || {}

  if (!(id in global.kuis))
    return conn.reply(m.chat, '❌ Tidak ada kuis yang sedang berlangsung!', m)

  let jawaban = global.kuis[id].jawaban
  let hint = jawaban[0] + '*'.repeat(jawaban.length - 1) // contoh: "M****"

  conn.reply(m.chat, `💡 *Hint:* ${hint}\n❗ *Limit -1* telah dikurangi.`, m)
  global.db.data.users[m.sender].limit -= 1
}

handler.help = ['hkuis']
handler.tags = ['game']
handler.command = /^hkuis$/i
handler.limit = false
export default handler