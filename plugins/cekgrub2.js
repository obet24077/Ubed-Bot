const handler = async (m, { conn }) => {
  const id = m.chat;
  const setting = global.db.data.chats[id] || {};
  const isGroup = id.endsWith('@g.us');

  if (!isGroup) return m.reply('❌ Ini bukan grup!');

  const isBanned = setting.isBanned ? '✅ YA' : '❌ TIDAK';
  const isBotAdmin = (await conn.groupMetadata(id)).participants.find(p => p.id === conn.user.jid)?.admin ? '✅ YA' : '❌ TIDAK';

  let info = `
*Status Grup:*
- ID: ${id}
- Banned: ${isBanned}
- Bot Admin: ${isBotAdmin}
- Nama: ${(await conn.groupMetadata(id)).subject}

Jika status *Banned = YA*, gunakan *.bot on* untuk mengaktifkan kembali.
  `.trim();

  m.reply(info);
};

handler.help = ['cekgrup2'];
handler.tags = ['tools'];
handler.command = /^cekgrup2$/i;
handler.admin = false;
handler.group = true;

export default handler;