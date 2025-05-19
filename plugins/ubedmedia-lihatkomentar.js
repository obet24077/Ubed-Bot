const handler = async (m, { conn, args }) => {
  global.db.data.ubedStatus ??= [];

  const mentioned = m.mentionedJid?.[0];
  if (!mentioned) return m.reply('Tag pengguna yang ingin kamu lihat komentarnya.\nContoh: *.lihatkomentar @user*');

  const statusList = global.db.data.ubedStatus.filter(s => s.sender === mentioned);
  if (statusList.length === 0) return m.reply('❌ Pengguna tersebut belum membuat status.');

  const status = statusList.sort((a, b) => b.timestamp - a.timestamp)[0];

  if (!status.komentar || status.komentar.length === 0) {
    return m.reply('Status ini belum memiliki komentar.');
  }

  const komentarList = status.komentar
    .slice(-5) // tampilkan 5 komentar terakhir
    .reverse()
    .map((k, i) => {
      const waktu = new Date(k.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      return `*${i + 1}.* @${k.sender.split("@")[0]}: ${k.text} (_${waktu}_)`;
    }).join("\n\n");

  return conn.sendMessage(m.chat, {
    text: `💬 *Komentar pada status @${status.username}:*\n\n${komentarList}`,
    mentions: status.komentar.map(k => k.sender)
  }, { quoted: m });
};

handler.help = ['lihatkomentar @user'];
handler.tags = ['media'];
handler.command = /^lihatkomentar$/i;

export default handler;