const handler = async (m, { conn, args }) => {
  global.db.data.ubedStatus ??= [];
  global.db.data.ubedSessions ??= {};
  global.db.data.ubedLikes ??= {};

  const sender = m.sender;
  const mentioned = m.mentionedJid?.[0];

  if (!mentioned) return m.reply('Tag pengguna yang statusnya ingin kamu *unlike*.\nContoh: *.unlike @user*');

  const userData = global.db.data.ubedSessions[mentioned];
  if (!userData || !userData.username) return m.reply('❌ Pengguna tersebut belum memiliki akun Ubed Media.');

  const targetStatus = [...global.db.data.ubedStatus]
    .filter(s => s.sender === mentioned)
    .sort((a, b) => b.timestamp - a.timestamp)[0];

  if (!targetStatus) return m.reply('❌ Pengguna tersebut belum membuat status.');

  const statusId = targetStatus.id;
  global.db.data.ubedLikes[statusId] ??= [];

  if (!global.db.data.ubedLikes[statusId].includes(sender)) {
    return m.reply('❗ Kamu belum menyukai status ini.');
  }

  // Hapus ID pengirim dari array likes
  global.db.data.ubedLikes[statusId] = global.db.data.ubedLikes[statusId].filter(jid => jid !== sender);

  return m.reply(`💔 Kamu membatalkan like pada status @${userData.username}`, null, {
    mentions: [mentioned]
  });
};

handler.command = /^unlike$/i;
handler.tags = ['media'];
handler.help = ['unlike @user'];

export default handler;