let handler = async (m, { conn, command }) => {
  try {
    // Membuat perintah baru dengan reply pesan
    if (command === 'cmd' && m.quoted) {
      const replyMessage = m.quoted.text || m.quoted.caption || m.quoted.contentText; // Mendapatkan pesan yang di-reply
      const cmdName = m.text.split(" ")[1]; // Nama perintah setelah .cmd

      if (!cmdName) {
        return m.reply("❌ *Nama perintah tidak ditemukan.*");
      }

      // Menyimpan pesan yang di-reply ke dalam global.cmds
      global.cmds = global.cmds || {};
      global.cmds[cmdName] = replyMessage;

      // Menambahkan handler baru untuk perintah yang baru dibuat
      if (!handler.command.some(r => r.toString() === `/${cmdName}/i`.toString())) {
        handler.command.push(new RegExp(`^${cmdName}$`, 'i'), async (m, { conn }) => {
          if (global.cmds[cmdName]) {
            return m.reply(global.cmds[cmdName]); // Mengirimkan pesan yang telah diset sebelumnya
          } else {
            return m.reply(`❌ *Perintah .${cmdName} tidak ditemukan.*`);
          }
        });
      }

      return m.reply(`✅ *Perintah .${cmdName} berhasil dibuat!*`);
    }

    // Menjalankan perintah yang sudah dibuat, misalnya .kangen
    if (global.cmds && global.cmds[command]) {
      return m.reply(global.cmds[command]); // Mengirimkan pesan yang telah diset sebelumnya
    }

    // Jika perintah tidak ditemukan
    m.reply(`❌ *Perintah .${command} belum dibuat atau tidak ditemukan.*`);
  } catch (e) {
    console.error("Error detail:", e); // Menambahkan log error lebih rinci
    m.reply("❌ *Terjadi kesalahan saat menjalankan perintah.*");
  }
}

handler.help = ['cmd <perintah>']
handler.tags = ['owner']
handler.command = /^cmd$/i
handler.owner = true

export default handler