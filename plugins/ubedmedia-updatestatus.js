const handler = async (m, { text, conn }) => {
  global.db.data.ubedStatus ??= [];
  global.db.data.ubedAccounts ??= {};
  global.db.data.ubedSessions ??= {};
  global.db.data.ubedCooldownStatus ??= {};
  global.db.data.ubedNotif ??= {};

  const sender = m.sender;
  const sessions = global.db.data.ubedSessions;
  const accounts = global.db.data.ubedAccounts;

  if (!sessions[sender]) return m.reply('❌ Kamu belum login ke *Ubed Media*. Silakan login terlebih dahulu dengan *.loginubed*!');

  const username = sessions[sender];
  const lastUpdate = global.db.data.ubedCooldownStatus[sender] || 0;

  if (Date.now() - lastUpdate < 3600000) {
    const sisa = Math.ceil((3600000 - (Date.now() - lastUpdate)) / 60000);
    return m.reply(`⏳ Kamu baru saja update status.\nTunggu *${sisa} menit lagi* untuk update berikutnya.`);
  }

  if (!text || text.length > 2000) return m.reply('✍️ Masukkan status maksimal 2000 karakter!\nContoh: *.updatestatus Aku bahagia hari ini!*');

  const status = {
    id: `${sender}-${Date.now()}`,
    sender,
    username,
    text,
    timestamp: Date.now(),
    likes: [],
    comments: []
  };

  global.db.data.ubedStatus.push(status);
  global.db.data.ubedCooldownStatus[sender] = Date.now();

  // Kirim notifikasi ke user lain
  for (const user in global.db.data.ubedSessions) {
    if (user !== sender) {
      global.db.data.ubedNotif[user] ??= [];
      global.db.data.ubedNotif[user].push({
        type: 'status',
        sender,
        text,
        timestamp: Date.now()
      });
    }
  }

  return m.reply('✅ Status berhasil diperbarui di *Ubed Media*!');
};

handler.command = /^updatestatus$/i;
handler.tags = ['media'];
handler.help = ['updatestatus <teks>'];

export default handler;