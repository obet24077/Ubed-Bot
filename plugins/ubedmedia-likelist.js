const handler = async (m, { conn, args }) => {
  global.db.data.ubedStatus ??= [];
  global.db.data.ubedSessions ??= {};

  const mentioned = m.mentionedJid?.[0];
  if (!mentioned) return m.reply('Tag pengguna untuk melihat siapa saja yang menyukai statusnya.\nContoh: *.likelist @user*');

  const username = global.db.data.ubedSessions[mentioned];
  if (!username) return m.reply('❌ Pengguna tersebut belum memiliki akun Ubed Media.');

  const status = [...global.db.data.ubedStatus].filter(s => s.sender === mentioned).sort((a, b) => b.timestamp - a.timestamp)[0];
  if (!status) return m.reply('❌ Pengguna tersebut belum membuat status.');

  const likeList = status.likes || [];
  if (likeList.length === 0) return m.reply(`Status terakhir @${username} belum memiliki suka.`, null, {
    mentions: [mentioned]
  });

  const daftarLike = likeList.map((jid, i) => {
    const name = conn.getName(jid) || jid;
    return `${i + 1}. ${name}`;
  }).join('\n');

  return conn.sendMessage(m.chat, {
    text: `❤️ *Daftar penyuka status terakhir @${username}*:\n\n${daftarLike}`,
    mentions: [mentioned, ...likeList]
  }, { quoted: m });
};

handler.command = /^likelist$/i;
handler.tags = ['media'];
handler.help = ['likelist @user'];

export default handler;