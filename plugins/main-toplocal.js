let handler = async (m, { conn, participants }) => {
  // Kirim reaksi loading
  conn.sendMessage(m.chat, {
    react: {
      text: '🕒',
      key: m.key,
    }
  });

  // Ambil ID semua member grup
  let member = participants.map(u => u.id);
  let kontol = {};

  for (let i = 0; i < member.length; i++) {
    let user = global.db.data.users[member[i]];
    if (typeof user !== 'undefined' && member[i] !== conn.user.jid && member[i] !== conn.user.jid.split('@')[0] + '@s.whatsapp.net') {
      kontol[member[i]] = {
        eris: user.eris || 0,
        level: user.level || 0,
        limit: user.limit || 0
      };
    }
  }

  // Urutkan berdasarkan eris dan limit
  let eris = Object.entries(kontol).sort((a, b) => b[1].eris - a[1].eris);
  let limit = Object.entries(kontol).sort((a, b) => b[1].limit - a[1].limit);

  // Ambil ranking
  let rankeris = eris.map(v => v[0]);
  let rankLimit = limit.map(v => v[0]);

  // Jumlah yang akan ditampilkan
  let iseris = Math.min(10, eris.length);
  let teks = `*[ 🚩 ] T O P - L O K A L*\n`;
  teks += `*[ 🏆 ] Kamu : ${rankeris.indexOf(m.sender) + 1}* dari *${member.length}*\n`;
  teks += `*[ 🔥 ] Grup :* ${await conn.getName(m.chat)}\n\n`;

  // Tambahkan daftar top eris
  teks += eris.slice(0, iseris).map(([user, data], i) =>
    `${i + 1}. @${user.split`@`[0]}\n   ◦  *Money:* ${formatNumber(data.eris)}\n   ◦  *Level:* ${data.level}`
  ).join('\n');

  teks += `\n\n> © Ubed Bot`;

  m.reply(teks);
};

handler.command = /^toplokal|toplocal$/i;
handler.tags = ["main"];
handler.help = ["toplocal"];
handler.register = true;
handler.group = true;

export default handler;

// Fungsi format angka biar ada titik ribuan
function formatNumber(num) {
  if (typeof num !== 'number') return '0';
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}