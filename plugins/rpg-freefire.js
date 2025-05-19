// Plugin Free Fire Duel WhatsApp Bot

let handler = async (m, { conn, args, usedPrefix, command }) => {
  global.ffRooms = global.ffRooms || {}
  let id = m.chat

  switch (command) {
    case 'ffbuat': {
      if (global.ffRooms[id]) return m.reply('Room sudah dibuat sebelumnya.')
      if (!m.mentionedJid[0]) return m.reply(`Tag seseorang untuk bermain dengannya.
Contoh: *${usedPrefix + command} @taguser*`)
      let user = m.mentionedJid[0]

      global.ffRooms[id] = {
        participants: [m.sender, user],
        senjata: {},
        started: false
      }
      conn.reply(m.chat, `Room FF berhasil dibuat!

@${m.sender.split('@')[0]} vs @${user.split('@')[0]}

Gunakan *.ffjoin @${m.sender.split('@')[0]}* untuk bergabung.`, m, {
        mentions: [m.sender, user]
      })
    }
    break

    case 'ffjoin': {
      let room = global.ffRooms[id]
      if (!room) return m.reply('Tidak ada room yang dibuat di chat ini.')
      if (room.participants.includes(m.sender)) return m.reply('Kamu sudah bergabung.')
      if (!m.mentionedJid[0] || m.mentionedJid[0] !== room.participants[0]) return m.reply('Kamu hanya bisa join jika tag orang yang membuat room.')

      room.participants[1] = m.sender
      conn.reply(m.chat, `@${m.sender.split('@')[0]} bergabung ke room!
Gunakan *.ffmulai* untuk memulai permainan.`, m, { mentions: [m.sender] })
    }
    break

    case 'ffmulai': {
      let room = global.ffRooms[id]
      if (!room) return m.reply('Belum ada room dibuat.')
      if (!room.participants.includes(m.sender)) return m.reply('Kamu bukan bagian dari room ini.')
      if (room.started) return m.reply('Permainan sudah dimulai.')
      if (!room.participants[1]) return m.reply('Menunggu pemain kedua join.')

      room.started = true
      conn.reply(m.chat, `*Permainan dimulai!*

@${room.participants[0].split('@')[0]} vs @${room.participants[1].split('@')[0]}

Gunakan perintah *.pilih [senjata]*
Contoh: *.pilih ak47*

Pilihan senjata: ak47, m4a1, awm, shotgun`, m, {
        mentions: room.participants
      })
    }
    break

    case 'pilihgun': {
      let room = global.ffRooms[id]
      if (!room || !room.started) return m.reply('Permainan belum dimulai.')
      if (!room.participants.includes(m.sender)) return m.reply('Kamu bukan bagian dari permainan ini.')
      if (!args[0]) return m.reply('Pilih senjata dengan mengetik *.pilih [senjata]*')

      let senjata = args[0].toLowerCase()
      let pilihan = ['ak47', 'm4a1', 'awm', 'shotgun']
      if (!pilihan.includes(senjata)) return m.reply(`Senjata tidak valid. Pilihan: ${pilihan.join(', ')}`)

      room.senjata[m.sender] = senjata
      conn.reply(m.chat, `@${m.sender.split('@')[0]} memilih senjata: ${senjata}`, m, { mentions: [m.sender] })
    }
    break

    case 'ffgas': {
      let room = global.ffRooms[id]
      if (!room || !room.started) return m.reply('Permainan belum dimulai.')
      if (!room.participants.includes(m.sender)) return m.reply('Kamu bukan bagian dari permainan ini.')

      let [p1, p2] = room.participants
      if (!(room.senjata[p1] && room.senjata[p2])) {
        return m.reply('Permainan belum lengkap! Pastikan kedua pemain sudah memilih senjata.')
      }

      let winner = [p1, p2][Math.floor(Math.random() * 2)]
      let loser = winner === p1 ? p2 : p1

      let ubedCoins = Math.floor(Math.random() * (250 - 10 + 1)) + 10
      let money = Math.floor(Math.random() * (100000 - 50000 + 1)) + 50000
      let exp = Math.floor(Math.random() * (4999 - 10 + 1)) + 10

      global.db.data.users[winner].balance += ubedCoins
      global.db.data.users[winner].money += money
      global.db.data.users[winner].exp += exp

      let messages = [
        `*Pertarungan Dimulai!*

@${p1.split('@')[0]} (senjata: ${room.senjata[p1]}) vs @${p2.split('@')[0]} (senjata: ${room.senjata[p2]})`,
        '... tembakan saling berbalas di medan tempur!',
        `Dan akhirnya... @${winner.split('@')[0]} menang mutlak!`,
      ]

      for (let i = 0; i < messages.length; i++) {
        setTimeout(() => {
          conn.reply(m.chat, messages[i], m, { mentions: [p1, p2] })
        }, i * 2000)
      }

      setTimeout(() => {
        conn.reply(m.chat, `*Pemenang: @${winner.split('@')[0]}*

🪙 Ubed Coins: +${ubedCoins}
💵 Money: +${money}
🎓 Exp: +${exp}`, m, { mentions: [winner] })
        delete global.ffRooms[id]
      }, messages.length * 2000 + 1000)
    }
    break
  }
}

handler.help = ['ffbuat', 'ffjoin', 'ffmulai', 'pilih', 'ffgas']
handler.tags = ['game']
handler.command = /^(ffbuat|ffjoin|ffmulai|pilihgun|ffgas)$/i

export default handler