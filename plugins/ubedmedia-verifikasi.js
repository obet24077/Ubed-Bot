const handler = async (m, { conn, args, isOwner }) => {
  global.db.data.ubedAccounts ??= {};
  global.db.data.ubedSessions ??= {};

  if (!isOwner) return m.reply('❌ Hanya owner yang dapat memverifikasi akun.');

  const mentioned = m.mentionedJid?.[0];
  const nomor = args[0]?.replace(/\D/g, '') + '@s.whatsapp.net';
  const target = mentioned || nomor;

  if (!target || !global.db.data.ubedAccounts[target]) {
    return m.reply('❌ Pengguna belum memiliki akun Ubed Media atau format input salah.\n\nGunakan:\n• *.verifikasi @user*\n• *.verifikasi 628xxxxxx*');
  }

  const akun = global.db.data.ubedAccounts[target];
  const username = global.db.data.ubedSessions[target] || 'tidak dikenal';

  if (akun.verified) return m.reply(`✅ Akun @${username} sudah terverifikasi sebelumnya.`);

  akun.verified = true;

  return m.reply(`✅ Berhasil memverifikasi akun @${username}.\nSekarang mereka mendapatkan lencana 🅥`, null, {
    mentions: [target]
  });
};

handler.command = /^verifikasi$/i;
handler.tags = ['media'];
handler.help = ['verifikasi @user / nomor'];
handler.owner = true;

export default handler;