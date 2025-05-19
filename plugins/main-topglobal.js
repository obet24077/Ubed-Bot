function formateris(eris) {
  const suffixes = ['', 'k', 'm', 'b', 't', 'q', 'Q', 's', 'S', 'o', 'n', 'd', 'U', 'D', 'Td', 'qd', 'Qd', 'sd', 'Sd', 'od', 'nd', 'V', 'Uv', 'Dv', 'Tv', 'qv', 'Qv', 'sv', 'Sv', 'ov', 'nv', 'T', 'UT', 'DT', 'TT', 'qt', 'QT', 'st', 'ST', 'ot', 'nt'];
  if (typeof eris !== 'number' || isNaN(eris)) return '0';
  if (eris === 0) return '0';
  const suffixIndex = Math.floor(Math.log10(eris) / 3);
  const suffix = suffixes[suffixIndex] || '';
  const scaled = eris / Math.pow(10, suffixIndex * 3);
  return scaled.toFixed(2) + suffix;
}

let handler = async (m, { conn, participants }) => {
  conn.sendMessage(m.chat, {
    react: {
      text: '🕒',
      key: m.key,
    }
  });

  // Ambil dan sortir user berdasarkan eris
  let allUsers = Object.entries(global.db.data.users || {});
  let eris = allUsers
    .map(([id, data]) => ({
      id,
      eris: data?.eris || 0,
      level: data?.level || 0
    }))
    .sort((a, b) => b.eris - a.eris);

  let rankeris = eris.map(u => u.id);
  let show = Math.min(10, eris.length);

  let teks = `[ 🌐 ] *T O P - G L O B A L*\n`;
  teks += `[ 🏆 ] *Kamu:* *${rankeris.indexOf(m.sender) + 1}* dari *${rankeris.length}*\n\n`;

  teks += eris
    .slice(0, show)
    .map((user, i) =>
      `${i + 1}. @${user.id.split`@`[0]}\n` +
      `   ◦ *Money* : *${formateris(user.eris)}*\n` +
      `   ◦ *Level* : *${user.level}*`
    )
    .join('\n');

  teks += `\n\n> © Ubed Bot`;

  m.reply(teks);
};

handler.command = ["topglobal"];
handler.tags = ["main"];
handler.help = ["topglobal"];
handler.register = true;

export default handler;