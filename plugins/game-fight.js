let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender];
  let opponent = m.mentionedJid && m.mentionedJid[0];

  if (!opponent || !global.db.data.users[opponent]) {
    return m.reply('*Contoh:* .fight @user');
  }

  if (m.sender === opponent) return m.reply('Lu ngaca, ngapain lawan diri sendiri?');

  // Kirim video dulu
  await conn.sendMessage(m.chat, {
    video: { url: 'https://files.catbox.moe/5vvj5b.mp4' },
    gifPlayback: true,
    caption: 'Pertarungan dimulai! ⚔️',
    ptv: true
  }, { quoted: m });

  // Cek uang & cooldown
  let betAmount = Math.floor(Math.random() * (10000000 - 10000 + 1)) + 10000;
  if (user.money < betAmount) return m.reply('Uang Anda tidak cukup untuk taruhan.');
  if (user.lastWar && (new Date - user.lastWar) < 10000) {
    let remaining = Math.ceil((10000 - (new Date() - user.lastWar)) / 1000);
    return m.reply(`Tunggu ${remaining} detik sebelum bertarung lagi.`);
  }

  conn.sendMessage(m.chat, {
    react: { text: '🗡️', key: m.key }
  });

  m.reply('Mempersiapkan arena...');
  setTimeout(() => {
    m.reply('Mendapatkan lawan...');
    setTimeout(() => {
      m.reply('Bertarung...');
      setTimeout(async () => {
        let result = Math.random() >= 0.5;
        let wonAmount = result ? betAmount : -betAmount;

        user.money += wonAmount;
        global.db.data.users[opponent].money -= wonAmount;
        user.lastWar = new Date();

        let opponentName = await conn.getName(opponent);
        let caption = `❏  *F I G H T*\n\n`;
        caption += `Lawan Anda: ${opponentName}\nLevel: [${user.level || 1}]\n\n`;

        if (result) {
          caption += `*Menang!* ${pickRandom(menang)}, +${betAmount} Money\n`;
          caption += `Uang saat ini: ${user.money}`;
          conn.sendFile(m.chat, 'https://telegra.ph/file/e3d5059b970d60bc438ac.jpg', 'win.jpg', caption, m);
        } else {
          caption += `*Kalah!* ${pickRandom(kalah)}, -${betAmount} Money\n`;
          caption += `Uang saat ini: ${user.money}`;
          conn.sendFile(m.chat, 'https://telegra.ph/file/86b2dc906fb444b8bb6f7.jpg', 'lose.jpg', caption, m);
        }

        setTimeout(() => {
          m.reply('Kamu bisa bertarung lagi setelah 5 detik.');
        }, 5000);
      }, 2000);
    }, 2000);
  }, 2000);
};

const kalah = [
  'bodoh gitu doang aja kalah tolol lu di denda',
  'lemah lu kontol mending lu di rumah aja dah lu di denda dek',
  'Jangan berantem kalo cupu dek wkwkwk kamu di denda',
  'Dasar tolol lawan itu doang aja ga bisa lu di denda',
  'Hadehh sono lu mending di rumah aja deh lu di denda'
];

const menang = [
  'kamu berhasil menggunakan kekuatan elemental untuk menghancurkan pertahanan lawan dan mendapatkan',
  'kamu berhasil melancarkan serangan mematikan dengan gerakan akrobatik yang membingungkan lawan, dan mendapatkan',
  'kamu berhasil menang karena baru selesai coli dan mendapatkan',
  'kamu berhasil menang karena menyogok lawan dan mendapatkan',
  'kamu berhasil menang karena bot merasa kasihan sama kamu dan mendapatkan',
  'kamu berhasil menang karena kamu melawan orang cupu dan mendapatkan'
];

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

handler.help = ['fight @user'];
handler.tags = ['game'];
handler.command = /^(fight|bertarung)$/i;

export default handler;