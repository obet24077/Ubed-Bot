import util from 'util'

let handler = async (m, { conn }) => {


  let data = global.db.data
  let output = util.inspect(data, { depth: 2 })

  // Batasi panjang agar tidak overload
  if (output.length > 5000) {
    output = output.slice(0, 5000) + '\n\n[Dipangkas karena terlalu panjang...]'
  }

  m.reply('Isi global.db.data:\n\n' + output)
}

handler.help = ['cekdb']
handler.tags = ['owner']
handler.command = /^cekdb$/i
handler.owner = true

export default handler