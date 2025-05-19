const handler = async (m, { conn }) => {
  const user = global.db.data.users[m.sender];
  global.db.data.ubedStatus ??= [];
  global.db.data.ubedCooldown ??= {};
  global.db.data.ubedLikes ??= {};
  global.db.data.ubedKomentar ??= {};

  const statusList = global.db.data.ubedStatus;
  const userStatusIndex = statusList.findIndex(s => s.sender === m.sender);

  if (userStatusIndex === -1) return m.reply('⚠️ Kamu belum membuat status di Ubed Media.');

  // Ambil status ID untuk hapus komentar & like
  const deletedStatus = statusList[userStatusIndex];
  const statusId = deletedStatus.id;

  // Hapus dari status list
  statusList.splice(userStatusIndex, 1);

  // Hapus komentar dan likes yang terkait
  delete global.db.data.ubedKomentar[statusId];
  delete global.db.data.ubedLikes[statusId];

  // Hapus cooldown biar bisa update status lagi
  delete global.db.data.ubedCooldown[m.sender];

  m.reply('✅ Status kamu berhasil dihapus. Kamu sekarang bisa update status lagi tanpa menunggu cooldown 1 jam.');
};

handler.help = ['hapusstatus'];
handler.tags = ['media'];
handler.command = /^hapusstatus$/i;

export default handler;