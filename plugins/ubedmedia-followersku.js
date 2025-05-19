const followersHandler = async (m, { conn }) => {
  global.db.data.ubedAccounts ??= {};
  global.db.data.ubedSessions ??= {};

  if (!global.db.data.ubedSessions[m.sender]) return m.reply('❌ Kamu belum login ke *Ubed Media*.');

  const akun = global.db.data.ubedAccounts[m.sender];
  if (!akun) return m.reply('❌ Akun tidak ditemukan.');

  const followerCount = akun.followers?.length || 0;

  m.reply(`📊 Jumlah Followers kamu: ${followerCount}`);
};

followersHandler.command = /^followersubed$/i;
followersHandler.tags = ['media'];
followersHandler.help = ['followersubed'];

export default;