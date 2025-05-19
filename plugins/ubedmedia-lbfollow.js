const handler = async (m, { conn }) => {
  if (!global.db.data.ubedAccounts) global.db.data.ubedAccounts = {};

  const akun = Object.entries(global.db.data.ubedAccounts)
    .map(([jid, data]) => ({
      jid,
      followers: data.followers?.length || 0,
      verified: data.verified || false
    }))
    .filter(user => user.followers > 0)
    .sort((a, b) => b.followers - a.followers)
    .slice(0, 10);

  if (akun.length === 0) return m.reply('Belum ada yang punya follower.');

  let teks = '🏆 *Leaderboard Follower Terbanyak Ubed Media*\n\n';
  const medali = ['🥇', '🥈', '🥉'];

  for (let i = 0; i < akun.length; i++) {
    let user = akun[i];
    const nama = await conn.getName(user.jid); // Ambil nama dari WA
    const medal = medali[i] || `${i + 1}.`;
    const verif = user.verified ? ' 🅥' : '';
    teks += `${medal} *${nama}*${verif}\n   👥 ${user.followers} follower\n\n`;
  }

  m.reply(teks.trim());
};

handler.command = /^lb(aderboard)?(ubed)?follow$/i;
handler.tags = ['info'];
handler.help = ['lbubedfollow', 'lb follow'];

export default handler;