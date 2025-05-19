let handler = m => m;

handler.before = m => {
  const tag = '@' + m.sender.split('@')[0]; // Split lebih simpel pake '@'
  let user = global.db.data.users[m.sender];

  // Cek user balik dari AFK
  if (user.afk > -1) {
    const duration = Math.floor((Date.now() - user.afk) / 1000); // Langsung floor biar cepet
    const [hours, minutes, seconds] = [
      Math.floor(duration / 3600),
      Math.floor((duration % 3600) / 60),
      duration % 60
    ];

    conn.reply(m.chat, `👤 Yo ${tag}!\n📊 Status: _Udah balik dari AFK_\n📑 Alasan: _${user.afkReason || "Gatau, kabur aja"}_\n⏰ Durasi: _${hours}j ${minutes}m ${seconds}d_`, floc);
    user.afk = -1;
    user.afkReason = '';
  }

  // Ambil JID yang di-mention atau di-quote, pake Set biar unik
  const jids = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])];

  // Loop cek AFK orang yang di-tag
  for (const jid of jids) {
    const mentionedUser = global.db.data.users[jid];
    if (!mentionedUser || mentionedUser.afk < 0) continue;

    const duration = Math.floor((Date.now() - mentionedUser.afk) / 1000);
    const [hours, minutes, seconds] = [
      Math.floor(duration / 3600),
      Math.floor((duration % 3600) / 60),
      duration % 60
    ];

    conn.reply(m.chat, `Oi ${tag}, jangan ganggu!\nDia lagi AFK ${mentionedUser.afkReason ? `karena "${mentionedUser.afkReason}"` : "tanpa alasan, misterius banget"}\nUdah ${hours}j ${minutes}m ${seconds}d`, floc);
  }
  return true;
};

export default handler;