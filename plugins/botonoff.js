const handler = async (m, { conn, args, usedPrefix, command, isBotAdmin, isAdmin, isOwner }) => {
  const isGroup = m.chat.endsWith('@g.us');
  const setting = global.db.data.chats[m.chat] || {};

  if (!isGroup) return m.reply('❌ Perintah ini hanya bisa digunakan di dalam grup!');
  if (!(isAdmin || isOwner)) return m.reply('❌ Hanya admin grup atau owner yang bisa mengatur bot!');

  if (args[0] === 'on') {
    setting.isBanned = false;
    m.reply('✅ Bot *diaktifkan* dan akan merespon perintah di grup ini.');
  } else if (args[0] === 'off') {
    setting.isBanned = true;
    m.reply('❌ Bot *dinonaktifkan* dan tidak akan merespon perintah di grup ini.');
  } else {
    m.reply(`⚙️ *Penggunaan:*\n\n${usedPrefix + command} on\n${usedPrefix + command} off`);
  }
};

handler.help = ['bot on', 'bot off'];
handler.tags = ['group', 'admin'];
handler.command = /^bot$/i;

export default handler;