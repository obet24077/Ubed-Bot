const handler = async (m, { conn }) => {
  global.db.data.ubedStatus ??= [];

  const statusList = global.db.data.ubedStatus.filter(s => s.sender === m.sender);
  if (statusList.length === 0) return m.reply('❌ Kamu belum membuat status.');

  let result = `💬 *Komentar pada status-status milikmu:*\n\n`;
  let komentarFound = false;
  let allMentions = new Set();

  for (let i = 0; i < statusList.length; i++) {
    const status = statusList[i];
    if (!status.komentar || status.komentar.length === 0) continue;

    komentarFound = true;
    result += `📝 *Status #${i + 1}:*\n${status.text.slice(0, 150)}\n`;

    for (let j = 0; j < status.komentar.length; j++) {
      const k = status.komentar[j];
      const waktu = new Date(k.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      result += `   ${j + 1}. @${k.sender.split('@')[0]}: ${k.text} (_${waktu}_)\n`;
      allMentions.add(k.sender);
    }

    result += `\n`;
  }

  if (!komentarFound) return m.reply('Status kamu belum memiliki komentar.');

  return conn.sendMessage(m.chat, {
    text: result.trim(),
    mentions: [...allMentions]
  }, { quoted: m });
};

handler.help = ['komentarku'];
handler.tags = ['media'];
handler.command = /^komentarku$/i;

export default handler;