const handler = async (m, { conn, args }) => {
  global.db.data.ubedFollows ??= {};
  global.db.data.ubedSessions ??= {};
  global.db.data.ubedAccounts ??= {};

  const sender = m.sender;
  const mentioned = m.mentionedJid?.[0];

  if (!mentioned) return m.reply('Tag pengguna yang ingin kamu unfollow.\nContoh: *.unfollow @user*');
  if (mentioned === sender) return m.reply('❌ Kamu tidak bisa unfollow diri sendiri.');

  const akunTarget = global.db.data.ubedAccounts[mentioned];
  if (!akunTarget) return m.reply('❌ Pengguna tersebut belum memiliki akun.');

  const usernameTarget = global.db.data.ubedSessions[mentioned] || 'tidak dikenal';
  const usernameSender = global.db.data.ubedSessions[sender] || 'pengguna';

  global.db.data.ubedFollows[sender] ??= [];

  if (!global.db.data.ubedFollows[sender].includes(mentioned)) {
    return m.reply(`❗ Kamu belum mengikuti @${usernameTarget}`, null, {
      mentions: [mentioned]
    });
  }

  // Hapus dari daftar following
  global.db.data.ubedFollows[sender] = global.db.data.ubedFollows[sender].filter(jid => jid !== mentioned);

  // Kirim notifikasi ke user yang di-unfollow
  await conn.sendMessage(mentioned, {
    text: `⚠️ @${usernameSender} berhenti mengikuti kamu di *Ubed Media*.`,
    mentions: [sender]
  });

  return m.reply(`✅ Kamu telah berhenti mengikuti @${usernameTarget}`, null, {
    mentions: [mentioned]
  });
};

handler.command = /^unfollow$/i;
handler.tags = ['media'];
handler.help = ['unfollow @user'];

export default handler;