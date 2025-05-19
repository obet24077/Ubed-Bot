const handler = async (m) => {
  global.db.data.ubedFollows ??= {};
  global.db.data.ubedSessions ??= {};

  const sender = m.sender;
  const following = global.db.data.ubedFollows[sender] ?? [];

  if (following.length === 0) return m.reply('❌ Kamu belum mengikuti siapa pun.');

  const teks = following.map((jid, i) => {
    const username = global.db.data.ubedSessions[jid] || 'tidak dikenal';
    return `${i + 1}. @${username}`;
  }).join('\n');

  m.reply(`📌 *Kamu mengikuti:*\n\n${teks}`, null, {
    mentions: following
  });
};

handler.command = /^following$/i;
handler.tags = ['media'];
handler.help = ['following'];

export default handler;