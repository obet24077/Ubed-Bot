const handler = async (m, { conn }) => {
  global.db.data.ubedStatus ??= [];
  global.db.data.ubedAccounts ??= {};
  global.db.data.ubedLikes ??= {};
  global.db.data.ubedNotif ??= {};

  const sender = m.sender;
  const mentioned = m.mentionedJid?.[0];

  if (!mentioned) return m.reply('Tag pengguna yang statusnya ingin kamu like.\nContoh: *.like @user*');

  // DEBUG
  console.log('Mentioned:', mentioned);
  console.log('Akun:', global.db.data.ubedAccounts[mentioned]);

  const akun = global.db.data.ubedAccounts[mentioned];
  if (!akun || !akun.username) return m.reply('❌ Pengguna tersebut belum memiliki akun Ubed Media.');

  const targetStatus = [...global.db.data.ubedStatus]
    .filter(s => s.sender === mentioned)
    .sort((a, b) => b.timestamp - a.timestamp)[0];

  if (!targetStatus) return m.reply('❌ Pengguna tersebut belum membuat status.');

  const statusId = targetStatus.id;
  global.db.data.ubedLikes[statusId] ??= [];

  if (global.db.data.ubedLikes[statusId].includes(sender)) {
    return m.reply('❗ Kamu sudah menyukai status ini sebelumnya.');
  }

  global.db.data.ubedLikes[statusId].push(sender);

  global.db.data.ubedNotif[mentioned] ??= [];
  global.db.data.ubedNotif[mentioned].push({
    type: 'like',
    sender,
    timestamp: Date.now()
  });

  return m.reply(`❤️ Kamu menyukai status terakhir dari @${akun.username}`, null, {
    mentions: [mentioned]
  });
};

handler.command = /^like$/i;
handler.tags = ['media'];
handler.help = ['like @user'];

export default handler;