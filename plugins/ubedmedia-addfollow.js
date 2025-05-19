const handler = async (m, { conn, args, isOwner }) => {
  if (!isOwner) return m.reply('❌ Fitur khusus Owner.');

  global.db.data.ubedAccounts ??= {};

  const jumlah = parseInt(args[0]);
  if (isNaN(jumlah) || jumlah <= 0) return m.reply('Masukkan jumlah followers yang valid!');

  const akun = global.db.data.ubedAccounts[m.sender] ??= {
    nama: await conn.getName(m.sender),
    followers: [],
    following: [],
    verified: false
  };

  // Generate follower palsu pakai ID acak
  for (let i = 0; i < jumlah; i++) {
    const fakeJid = `fake${Date.now()}${i}@s.whatsapp.net`;
    if (!akun.followers.includes(fakeJid)) {
      akun.followers.push(fakeJid);
    }
  }

  m.reply(`✅ Berhasil menambahkan *${jumlah}* follower palsu ke akunmu.`);
};

handler.command = /^addfollowubed$/i;
handler.tags = ['media'];
handler.help = ['addfollowubed <jumlah>'];
handler.owner = true;

export default handler;