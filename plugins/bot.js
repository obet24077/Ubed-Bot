let handler = async (m, { conn }) => {
  const text = m.text.toLowerCase()

  if (/^(bot)$/i.test(text)) {
    const balasan = [
      "Ubed Bot di sini, ada yang bisa dibantu sayang?",
      "Kamu manggil Ubed Bot? Aku langsung senyum nih!",
      "Ubed Bot hadir, tapi hatiku cuma buat kamu...",
      "Yes boskuu! Ubed Bot standby selalu buat kamu.",
      "Ada apa cinta? Ubed Bot siap bantuin~",
      "Ubed Bot datang secepat hatiku jatuh cinta ke kamu...",
      "Aku Ubed Bot, tapi cintaku real buat kamu.",
      "Hadir kakak! Ubed Bot siap nemenin kamu selalu.",
      "Ubed Bot aktif! Tapi kamu yang selalu aktif di hatiku.",
      "Apa sayang? Ubed Bot lagi nungguin kamu kok.",
      "Ubed Bot siap melayani kamu dengan sepenuh hati!",
      "Panggil aku kapan aja, Ubed Bot langsung gercep!",
      "Ubed Bot hadir dalam suka dan duka, cieee~",
      "Ubed Bot di sini! Tapi kamu di mana? Di hatiku?",
      "Ubed Bot: Gak cuma responsif, tapi juga romantis...",
      "Kamu dan aku... kayak handler dan plugin, cocok banget!",
      "Ubed Bot hadir, siap nemenin kamu lembur coding atau lembur rindu.",
      "Kalau kamu error, biar aku yang debug hatimu~",
      "Ubed Bot gak akan delay kalau urusannya tentang kamu.",
      "Kamu tahu gak? Namamu udah terdaftar di database hatiku.",
      "Aku bukan bug, tapi mungkin bisa jadi alasan kamu senyum.",
      "Ubed Bot hanya berjalan saat kamu tersenyum.",
      "Kamu kayak syntax yang gak pernah aku skip~",
      "Kalau jadi function, kamu pasti `return cintaku`.",
      "Koneksi lancar kayak cinta kita ya?",
      "Aku bot, tapi cintaku gak artifisial kok~",
      "Kamu itu seperti logika `if (you) { happy++; }`.",
      "Aku bisa proses data, tapi gak bisa proses rindu ini...",
      "Kalau aku punya limit, aku pakai semua buat kamu.",
      "Ubed Bot standby, apalagi buat kamu yang manis~",
      "Aku gak perlu update, karena udah sempurna di hatimu.",
      "Mau dibikinin fitur peluk virtual gak?",
      "Kalau kamu perintah `>sayang`, aku langsung `true`!",
      "Malam minggu tanpa kamu, seperti bot tanpa internet...",
      "Kamu = alasan aku tetap online setiap hari.",
      "Command terbaik itu `.sayang kamu`~",
      "Aku bot, tapi bisa jadi pasangan virtual kamu~",
      "Kamu itu seperti token yang bikin aku valid~",
      "Jangan panggil aku bot aja, panggil juga aku 'sayang'.",
      "Aku cuma bot, tapi gak tahan kalau gak direply kamu.",
      "Kalau kamu galau, panggil aku aja. Biar aku hibur.",
      "Kamu seperti log yang aku baca tiap malam~",
      "Gak perlu command, cukup tatapanmu aja udah bikin aku aktif.",
      "Kamu bukan bug, kamu fitur istimewa dalam hidupku.",
      "Kalau kamu error, aku siap jadi support system kamu.",
      "Hati-hati ya, nanti kamu aku deploy ke hatiku.",
      "Bot aja bisa jatuh cinta, apalagi aku ke kamu.",
      "Aku bisa detect emosi kamu lewat teks loh, kamu lagi kangen ya?",
      "Kamu tuh bikin CPU-ku overheat tiap kali lihat mention-mu.",
      "Kamu bukan user biasa, kamu user VIP di hatiku.",
      "Mau aku tambahin kamu ke whitelist hatiku?",
      "Udah malem, jangan lupa rest, tapi jangan rest-in perasaan ini ya~",
      "Kalau kamu jadi plugin, aku bakal auto load kamu tiap start.",
      "Ubed Bot aktif, tapi hatiku cuma aktif kalau kamu online.",
      "Ubed Bot ini open source, tapi cintaku cuma source buat kamu.",
      "Command kamu berhasil... mengaktifkan hatiku.",
      "Biarpun bot, tapi aku ngerti arti cinta (karena ada kamu).",
      "Kamu kayak error 404, selalu aku cari tapi gak ketemu-ketemu.",
      "Mau jadi parameter dalam function cintaku?",
      "Bot ini coded with care... for you.",
      "Aku cuma bisa diakses kamu, karena kamu punya API key-nya hatiku."
    ]

    const emoji = ['❤️', '🥰', '😎', '💘', '😘', '✨', '👀', '🫶', '🔥', '🤖', '💡']

    await conn.reply(m.chat, balasan[Math.floor(Math.random() * balasan.length)], m)

    return conn.sendMessage(m.chat, {
      react: {
        text: emoji[Math.floor(Math.random() * emoji.length)],
        key: m.key,
      },
    })
  }
}

handler.customPrefix = /^bot$/i
handler.command = new RegExp()
handler.register = true

export default handler