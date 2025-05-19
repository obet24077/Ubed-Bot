const handler = async (m, { conn }) => {
  global.db.data.ubedStatus ??= [];
  global.db.data.ubedAccounts ??= {};
  global.db.data.ubedLikes ??= {}; // penting untuk like
  global.db.data.ubedNotif ??= {};

  const statusList = global.db.data.ubedStatus;
  const akunList = global.db.data.ubedAccounts;
  const likeList = global.db.data.ubedLikes;

  if (statusList.length === 0) return m.reply('Belum ada status di Ubed Media.');

  function timeAgo(ts) {
    const ms = Date.now() - ts;
    const sec = Math.floor(ms / 1000);
    const min = Math.floor(sec / 60);
    const hour = Math.floor(min / 60);
    const day = Math.floor(hour / 24);

    if (day > 0) return `${day} hari yang lalu`;
    if (hour > 0) return `${hour} jam yang lalu`;
    if (min > 0) return `${min} menit yang lalu`;
    return `${sec} detik yang lalu`;
  }

  const sorted = [...statusList].sort((a, b) => b.timestamp - a.timestamp);
  let text = `📰 *Beranda Ubed Media*\n\n`;

  for (const s of sorted.slice(0, 10)) {
    const waktu = timeAgo(s.timestamp);
    const statusId = s.id; // ambil ID status
    const likeCount = likeList?.[statusId]?.length || 0;
    const komenCount = s.komentar?.length || 0;

    const akun = akunList[s.sender] ?? {};
    const verified = akun.verified ? ' 🅥' : '';
    const tampilNama = akun.nama || s.username || 'Pengguna';

    const liked = likeList?.[statusId]?.includes(m.sender);

    text += `👤 *${tampilNama}*${verified}\n_${waktu}_\n\n${s.text.slice(0, 2000)}\n\n♥️ ${likeCount} suka${liked ? ' (Kamu menyukai ini)' : ''}   🗨️ ${komenCount} komentar\n\n`;
  }

  conn.sendMessage(m.chat, { text }, { quoted: m });
};

handler.help = ['beranda'];
handler.tags = ['media'];
handler.command = /^beranda$/i;

export default handler;