let handler = async (m, { conn, args, participants, isPrems }) => {
  if (!m.isGroup) throw 'Fitur ini hanya bisa digunakan di grup!'
  if (!args[0] || isNaN(args[0])) throw 'Masukkan jumlah limit yang valid\nContoh: .addlimitgrub 5'

  let jumlah = parseInt(args[0])
  if (jumlah < 1) throw 'Minimal 1 limit'

  let users = global.db.data.users

  for (let user of participants) {
    let id = user.id

    if (!users[id]) {
      users[id] = {
        limit: 0,
        money: 0,
        exp: 0,
        level: 0,
        role: '',
        registered: false
        // tambahkan properti lain jika bot kamu menggunakannya
      }
    }

    users[id].limit += jumlah
  }

  m.reply(`Berhasil menambahkan *+${jumlah} limit* ke semua member grup (${participants.length} orang)!`)
}

handler.help = ['addlimitgrub <jumlah>']
handler.tags = ['owner']
handler.command = /^addlimitgrub$/i
handler.owner = true

export default handler