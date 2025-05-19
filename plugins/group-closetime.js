let handler = async (m, { conn, text, args, command, usedPrefix }) => {
  switch (command) {
    case 'closetime':
      if (!m.isGroup) return m.reply('Perintah ini hanya bisa digunakan di grup.');
      
      const closeMessage = '📢 *Grup telah ditutup, hanya admin yang dapat mengirim pesan di grup.*';
      conn.groupSettingUpdate(m.chat, 'announcement');
      m.reply(closeMessage);
      break;

    case 'opentime':
      if (!m.isGroup) return m.reply('Perintah ini hanya bisa digunakan di grup.');
      
      const openMessage = '📢 *Grup telah dibuka, semua peserta dapat mengirim pesan di grup.*';
      conn.groupSettingUpdate(m.chat, 'not_announcement');
      m.reply(openMessage);
      break;
  }
}

handler.help = handler.command = ["closetime", "opentime"];
handler.tags = ['group'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;