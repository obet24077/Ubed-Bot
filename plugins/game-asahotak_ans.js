import similarity from 'similarity'
const threshold = 0.72

export async function before(m) {
  let id = m.chat
  if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !m.text || !/Ketik.*ao/i.test(m.quoted.text) || /.*(ao|bantuan)/i.test(m.text)) return !0

  this.asahotak = this.asahotak || {}
  if (!(id in this.asahotak)) return m.reply('Soal itu telah berakhir')

  let soal = this.asahotak[id]
  let quotedId = m.quoted.id || m.quoted.key?.id
  let soalId = soal[0]?.id || soal[0]?.key?.id

  if (quotedId === soalId) {
    let json = soal[1]

    if (m.text.toLowerCase() === json.jawaban.toLowerCase().trim()) {
      global.db.data.users[m.sender].exp += soal[2]
      await this.sendButton(m.chat, `*Benar!*\n+${soal[2]} XP`, wm, null, [['Asah Otak', '.asahotak']], m)
      clearTimeout(soal[3])
      delete this.asahotak[id]
    } else if (similarity(m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) {
      m.reply(`*Dikit lagi!*`)
    } else {
      m.reply(`*Salah!*`)
    }
  }

  return !0
}

export const exp = 0