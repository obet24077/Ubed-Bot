let pasanganPending = {} // Untuk penyimpanan sementara ajakan jadian

let handler = async (m, { conn, command, args }) => {
  const user = global.db.data.users
  const id = m.sender

  switch (command) {
    case 'jadian': {
      let target = m.mentionedJid[0]
      if (!target) return m.reply('Tag orang yang mau kamu ajak jadian!\nContoh: .jadian @user')

      if (user[id]?.pasangan) return m.reply('Kamu sudah punya pasangan!')
      if (user[target]?.pasangan) return m.reply('Orang itu sudah punya pasangan!')
      if (target === id) return m.reply('Mau jadian sama diri sendiri? Ngeri!')

      pasanganPending[target] = id

      const gombalan = pickRandom([
  'Kalau jadi bunga, kamu bunga yang nggak pernah layu di hatiku.',
  'Aku bukan fotografer, tapi bisa menangkap senyumanmu di pikiranku terus.',
  'Kamu tau gak bedanya kamu sama bintang? Bintang cuma ada di langit, kalau kamu di hatiku.',
  'Setiap detak jantungku bilang namamu.',
  'Kalau cinta adalah dosa, biarkan aku jadi pendosa seumur hidup karena mencintaimu.',
  'Kopi pagi ini terasa manis karena senyumanmu masih kuingat semalam.',
  'Dulu aku pikir bidadari cuma ada di surga, ternyata kamu nyata.',
  'Bahkan wifi aja kalah cepat koneksinya dibanding aku yang langsung jatuh cinta sama kamu.',
  'Kalau kamu jadi matahari, aku rela jadi planet yang terus mengelilingimu.',
  'Kamu kayak charger, deket kamu bikin aku semangat terus.',
  'Cinta kamu itu kayak matematika, susah tapi bikin ketagihan.',
  'Kalau kamu hujan, aku rela kehujanan setiap hari.',
  'Aku gak perlu Google, semua yang aku cari udah ada di kamu.',
  'Kamu itu alasan kenapa aku suka bangun pagi, biar bisa lihat kamu di mimpi semalam.',
  'Kalau kamu senyum, dunia kayak slow motion buatku.',
  'Kalau kamu musik, aku rela jadi liriknya.',
  'Hatiku cuma bisa diakses sama kamu, yang lain 403 Forbidden.',
  'Kamu kayak notifikasi Shopee, selalu bikin deg-degan tiap muncul.',
  'Aku bukan juru masak, tapi cintaku padamu selalu matang.',
  'Kalau aku jadi pahlawan, kamu alasanku berjuang.',
  'Boleh pinjam peta? Aku sering tersesat di matamu.',
  'Kamu magnet ya? Soalnya aku selalu ketarik ke kamu.',
  'Kamu kayak AC, deket kamu bikin adem.',
  'Aku rela jadi jemuran, asal bisa dijemur di bawah senyumanmu.',
  'Cintaku padamu kayak logika matematika, gak bisa dibantah.',
  'Aku gak bisa jadi yang sempurna, tapi aku bisa jadi yang setia.',
  'Kamu bukan Google, tapi kamu semua yang aku cari.',
  'Kalau kamu sinyal, aku nggak mau kehilangan koneksi sama kamu.',
  'Kamu tahu gak kenapa langit biru? Karena warnanya berubah tiap aku liat kamu.',
  'Aku rela jadi sandal jepitmu, asal bisa nemenin kemana pun kamu pergi.',
  'Cintaku ke kamu tuh kayak kuota unlimited, gak habis-habis.',
  'Aku bukan astronot, tapi cintaku ke kamu seluas galaksi.',
  'Kalau aku jadi burung, aku mau terbang ke hatimu.',
  'Kamu seperti password wifi di cafe, semua orang pengen dapetin.',
  'Kamu bikin aku percaya kalau cinta itu nyata.',
  'Aku pernah main petak umpet sama cinta, ternyata dia sembunyi di kamu.',
  'Kalau kamu jadi tugas, aku rela ngerjain semalaman.',
  'Aku rela jadi bulu mata kamu, biar aku selalu deket dengan pandanganmu.',
  'Kamu kayak tanggal merah, selalu ditunggu-tunggu.',
  'Aku gak bisa nulis puisi, tapi senyummu udah jadi syair terindah buatku.',
  'Kamu bukan waktu, tapi kamu bikin semua terasa tepat.',
  'Kalau kamu makanan, kamu pasti manis banget sampai bikin diabetes.',
  'Aku bukan pelukis, tapi bisa menggambarkan rasa ini buat kamu.',
  'Kamu seperti hujan di musim kemarau, dinanti dan bikin bahagia.',
  'Aku rela jadi bayanganmu, selalu ada di belakangmu.',
  'Cintaku ke kamu kayak software bajakan, selalu minta update terus.',
  'Kalau kamu buku, aku rela baca dari awal sampai akhir tiap hari.',
  'Aku gak punya jam tangan mahal, tapi aku punya waktu buat kamu.',
  'Kalau kamu bulan, aku rela jadi bintang biar bisa nemenin kamu.',
  'Cintaku ke kamu itu kayak UUD, susah diganti.',
  'Kamu seperti nasi, gak bisa hidup tanpamu.'
]
)

      return conn.reply(m.chat,
        `*@${id.split('@')[0]}* ingin jadian sama *@${target.split('@')[0]}*!\n\n"${gombalan}"\n\n` +
        `@${target.split('@')[0]}, balas dengan:\n• *.jadianterima* untuk menerima\n• *.jadiantolak* untuk menolak`,
        m, { mentions: [id, target] }
      )
    }

    case 'jadianterima': {
      if (!pasanganPending[id]) return m.reply('Tidak ada yang ngajak kamu jadian.')

      let dari = pasanganPending[id]
      delete pasanganPending[id]

      if (user[id]?.pasangan || user[dari]?.pasangan) return m.reply('Salah satu dari kalian sudah punya pasangan.')

      user[id].pasangan = dari
      user[dari].pasangan = id

      return conn.reply(m.chat,
        `SELAMAT!!\n\n@${id.split('@')[0]} & @${dari.split('@')[0]} sekarang resmi berpacaran!`,
        m, { mentions: [id, dari] }
      )
    }

    case 'jadiantolak': {
      if (!pasanganPending[id]) return m.reply('Tidak ada yang ngajak kamu jadian.')

      let dari = pasanganPending[id]
      delete pasanganPending[id]

      return conn.reply(m.chat,
        `Aduh...\n\n@${id.split('@')[0]} menolak cinta dari @${dari.split('@')[0]}.`,
        m, { mentions: [id, dari] }
      )
    }

    case 'jadiancek': {
      let pasanganId = user[id]?.pasangan
      if (!pasanganId) return m.reply('Kamu belum punya pasangan.')

      let nama = await conn.getName(pasanganId)
      return m.reply(`Pasanganmu sekarang adalah @${pasanganId.split('@')[0]} (${nama})`, null, {
        mentions: [pasanganId]
      })
    }
  }
}

handler.help = ['jadian @tag', 'jadianterima', 'jadiantolak', 'jadiancek']
handler.tags = ['fun']
handler.command = /^jadian(?:terima|tolak)?$|^jadiancek$/i
handler.group = true

export default handler

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}