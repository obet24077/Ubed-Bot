const handler = async (m, { conn }) => {
  global.db.data.ubedAccounts ??= {};
  global.db.data.ubedSessions ??= {};

  if (!global.db.data.ubedSessions[m.sender]) return m.reply('❌ Kamu belum login ke *Ubed Media*.');

  const akun = global.db.data.ubedAccounts[m.sender];
  if (!akun) return m.reply('❌ Akun tidak ditemukan.');

  const nama = akun.nama || '—';
  const kota = akun.kota || '—';
  const bio = akun.bio || '—';
  const username = akun.username || '—';
  const verified = akun.verified ? '🅥' : '';
  const foto = akun.foto || null;

  const followerCount = akun.followers?.length || 0;

  const teks = `
👤 *Profil Ubed Media*
• Username: *${username}* ${verified}
• Nama: ${nama}
• Kota: ${kota}
• Bio: ${bio}
• Status: ${akun.verified ? '🅥 Terverifikasi' : 'Belum diverifikasi'}
• Followers: ${followerCount}
  `.trim();

  if (foto) {
    await conn.sendFile(m.chat, foto, 'profile.jpg', teks, m);
  } else {
    m.reply(teks);
  }
};

handler.command = /^profilubed$/i;
handler.tags = ['media'];
handler.help = ['profilubed'];

export default handler;