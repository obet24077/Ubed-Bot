import fetch from 'node-fetch'

let handler = async (m, { text }) => {
  if (!text) throw 'Masukkan teks untuk berbicara dengan Simi!'

  let response = await fetch('https://api.simsimi.vn/v1/simtalk', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: text,
      lc: 'id'
    })
  })

  let json = await response.json()

  if (json.success) {
    m.reply(json.success)
  } else {
    m.reply('Simi tidak mengerti.')
  }
}

handler.command = ['simi2']
handler.tags = ['fun']
handler.help = ['simi <teks>']
handler.limit = true

export default handler