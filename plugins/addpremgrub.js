const handler = async (m, { conn, text }) => {
  if (!m.isGroup) return m.reply('Fitur ini hanya bisa digunakan di grup.');
  if (!text || isNaN(text)) return m.reply('Contoh penggunaan: *.addpremgrub 7*');

  const duration = parseInt(text) * 86400000; // hari ke ms
  const now = Date.now();
  const expireTime = now + duration;

  const groupMetadata = await conn.groupMetadata(m.chat);
  const participants = groupMetadata.participants || [];

  for (const user of participants) {
    const jid = user.id;
    if (!global.db.data.users[jid]) global.db.data.users[jid] = {};

    const userData = global.db.data.users[jid];

    // Lewati jika user premium permanen
    if (userData.premium && userData.premiumDate === Infinity) continue;

    // Lewati jika premiumDate sekarang lebih lama dari durasi grup premium
    if (userData.premium && userData.premiumDate > expireTime) continue;

    userData.premium = true;
    userData.premiumDate = expireTime;

    // Tandai bahwa dia dapat premium dari grup, untuk tracking jika nanti keluar
    userData._fromPremGrup = m.chat;
  }

  // Simpan status grup premium di db
  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {};
  global.db.data.chats[m.chat].isPremiumGroup = true;
  global.db.data.chats[m.chat].premiumGroupExpire = expireTime;

  m.reply(`✅ Berhasil mengaktifkan *Premium Grup* selama ${text} hari untuk semua member grup ini.\n\nJika anggota keluar, status premium-nya akan otomatis dihapus (jika tidak premium dari sumber lain).`);
};

handler.command = /^addpremgrub$/i;
handler.tags = ['owner'];
handler.help = ['addpremgrub <jumlah hari>'];
handler.owner = true;
handler.group = true;

export default handler;