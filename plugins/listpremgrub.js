const handler = async (m, { conn }) => {
  if (!m.isGroup) return m.reply('Fitur ini hanya bisa digunakan di grup.');

  // Memastikan bahwa data grup ada dalam database
  const groupData = global.db.data.groups[m.chat];
  
  if (!groupData) {
    // Jika data grup tidak ada, buatkan entri baru untuk grup
    global.db.data.groups[m.chat] = { users: {} };
  }

  // Memastikan bahwa grup memiliki data pengguna
  const usersData = global.db.data.groups[m.chat].users;

  if (!usersData) {
    // Jika tidak ada data pengguna, buatkan entri untuk pengguna
    global.db.data.groups[m.chat].users = {};
  }

  // Membuat daftar pengguna premium di grup
  let premiumList = Object.keys(usersData)
    .filter(jid => usersData[jid].premium)
    .map(jid => `@${jid.split('@')[0]}`);

  // Jika tidak ada pengguna premium, kirim pesan yang sesuai
  if (premiumList.length === 0) return m.reply('Tidak ada member premium di grup ini.');

  // Kirim pesan dengan daftar member premium
  await conn.sendMessage(m.chat, {
    text: `Daftar member premium di grup *${m.chat}*:\n\n` + premiumList.join('\n'),
    mentions: premiumList.map(jid => jid),
  });
};

handler.command = /^listpremgrub$/i;
handler.group = true;

export default handler;