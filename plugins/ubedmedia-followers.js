const handler = async (m) => {
  global.db.data.ubedFollows ??= {};
  global.db.data.ubedSessions ??= {};

  const sender = m.sender;
  const followers = Object.entries(global.db.data.ubedFollows)
    .filter(([_, list]) => list.includes(sender))
    .map(([id]) => id);

  if (followers.length === 0) return m.reply('👤 Belum ada yang mengikuti kamu.');

  const teks = followers.map((jid, i) => {
    const username = global.db.data.ubedSessions[jid] || 'tidak dikenal';
    return `${i + 1}. @${username}`;
  }).join('\n');

  m.reply(`👥 *Followers kamu:*\n\n${teks}`, null, {
    mentions: followers
  });
};

handler.command = /^followers$/i;
handler.tags = ['media'];
handler.help = ['followers'];

export default handler;