const handler = async (m, { conn }) => {
  global.db.data.ubedNotif ??= {};
  global.db.data.ubedSessions ??= {};
  const sender = m.sender;

  if (!global.db.data.ubedSessions[sender]) {
    return m.reply('❌ Kamu belum login ke *Ubed Media*. Silakan login terlebih dahulu dengan *.loginubed*');
  }

  const notifs = global.db.data.ubedNotif[sender] || [];

  if (notifs.length === 0) return m.reply('📭 Tidak ada notifikasi baru.');

  const timeAgo = (ts) => {
    const ms = Date.now() - ts;
    const sec = Math.floor(ms / 1000);
    const min = Math.floor(sec / 60);
    const hour = Math.floor(min / 60);
    const day = Math.floor(hour / 24);
    if (day > 0) return `${day} hari yang lalu`;
    if (hour > 0) return `${hour} jam yang lalu`;
    if (min > 0) return `${min} menit yang lalu`;
    return `${sec} detik yang lalu`;
  };

  let teks = `🔔 *Notifikasi Ubed Media*\n\n`;

  for (const n of notifs.slice().reverse().slice(0, 15)) {
    let jenis = '';
    if (n.type === 'like') {
      jenis = `♥️ @${n.username || conn.getName(n.sender)} menyukai statusmu`;
    } else if (n.type === 'komentar') {
      jenis = `💬 @${n.username || conn.getName(n.sender)} mengomentari statusmu:\n"${n.text}"`;
    } else if (n.type === 'status') {
      jenis = `🆕 @${n.username || conn.getName(n.sender)} membuat status baru`;
    }
    teks += `• ${jenis}  \n_${timeAgo(n.timestamp)}_\n\n`;
  }

  m.reply(teks, null, {
    mentions: notifs.map(n => n.sender)
  });

  // Kosongkan notifikasi setelah dilihat
  global.db.data.ubedNotif[sender] = [];
};

handler.command = /^notifikasi$/i;
handler.tags = ['media'];
handler.help = ['notifikasi'];

export default handler;