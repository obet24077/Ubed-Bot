const handler = async (m, { conn, args }) => {
  global.db.data.ubedStatus ??= [];
  global.db.data.ubedNotif ??= {};

  const sender = m.sender;
  const mentioned = m.mentionedJid?.[0];
  if (!mentioned) return m.reply('Tag pengguna yang statusnya ingin kamu komentari.\nContoh: *.komentar @user isi komentar*');

  const isiKomentar = args.slice(1).join(" ");
  if (!isiKomentar) return m.reply('Ketik isi komentar kamu setelah tag.\nContoh: *.komentar @user Wah status kamu keren banget!*');

  const statusList = global.db.data.ubedStatus.filter(s => s.sender === mentioned);
  if (statusList.length === 0) return m.reply('❌ Pengguna tersebut belum membuat status.');

  const lastStatus = statusList.sort((a, b) => b.timestamp - a.timestamp)[0];

  lastStatus.komentar = lastStatus.komentar || [];

  lastStatus.komentar.push({
    sender,
    text: isiKomentar,
    timestamp: Date.now()
  });

  // Notifikasi komentar
  global.db.data.ubedNotif[mentioned] ??= [];
  global.db.data.ubedNotif[mentioned].push({
    type: 'komentar',
    sender,
    text: isiKomentar,
    timestamp: Date.now()
  });

  return m.reply(`💬 Komentarmu berhasil dikirim ke status terakhir dari @${lastStatus.username}`, null, {
    mentions: [mentioned]
  });
};

handler.command = /^komentar$/i;
handler.tags = ['media'];
handler.help = ['komentar @user isi komentar'];

export default handler;