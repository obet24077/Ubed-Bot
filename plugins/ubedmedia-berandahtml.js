import { writeFileSync } from 'fs';
import path from 'path';

const handler = async (m, { conn }) => {
  if (!global.db.data.ubedStatus) global.db.data.ubedStatus = [];
  if (!global.db.data.ubedAccounts) global.db.data.ubedAccounts = {};
  if (!global.db.data.ubedLikes) global.db.data.ubedLikes = {};
  if (!global.db.data.ubedNotif) global.db.data.ubedNotif = {};

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

    if (day > 0) return `${day} hari lalu`;
    if (hour > 0) return `${hour} jam lalu`;
    if (min > 0) return `${min} menit lalu`;
    return `${sec} detik lalu`;
  }

  const sorted = [...statusList].sort((a, b) => b.timestamp - a.timestamp);
  let html = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Beranda Ubed Media</title>
  <style>
    body { font-family: sans-serif; background: #f4f4f4; padding: 20px; }
    .status { background: #fff; padding: 15px; margin-bottom: 15px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
    .header { font-weight: bold; margin-bottom: 5px; }
    .timestamp { font-size: 0.9em; color: #666; margin-bottom: 10px; }
    .text { margin-bottom: 10px; }
    .footer { font-size: 0.9em; color: #333; }
  </style>
</head>
<body>
  <h2>Beranda Ubed Media</h2>
`;

  for (const s of sorted.slice(0, 10)) {
    const waktu = timeAgo(s.timestamp);
    const statusId = s.id;
    const likeCount = likeList[statusId]?.length || 0;
    const komenCount = s.komentar?.length || 0;

    const akun = akunList[s.sender] || {};
    const verified = akun.verified ? ' 🅥' : '';
    const tampilNama = akun.nama || s.username || 'Pengguna';

    html += `
  <div class="status">
    <div class="header">${tampilNama}${verified}</div>
    <div class="timestamp">${waktu}</div>
    <div class="text">${s.text.replace(/\n/g, '<br>')}</div>
    <div class="footer">♥️ ${likeCount} suka   🗨️ ${komenCount} komentar</div>
  </div>`;
  }

  html += `</body></html>`;

  const filename = path.join('./tmp', 'beranda.html');
  writeFileSync(filename, html);

  await conn.sendMessage(m.chat, {
    document: { url: filename },
    fileName: 'beranda.html',
    mimetype: 'text/html'
  }, { quoted: m });
};

handler.help = ['berandahtml'];
handler.tags = ['media'];
handler.command = /^berandahtml$/i;

export default handler;