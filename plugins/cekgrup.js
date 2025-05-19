let handler = async (m, { conn, args }) => {
  if (!args[0]) return m.reply('⚠️ Masukkan ID grup!\nContoh: .cekgrup 1203630xxxxx@g.us');
  let idGrup = args[0];

  try {
    let metadata = await conn.groupMetadata(idGrup);
    m.reply(`✅ *Nama Grup:*\n${metadata.subject}`);
  } catch (e) {
    m.reply('❌ Gagal mengambil info grup.\nPastikan bot masih menjadi member grup tersebut.');
  }
};

handler.help = ['cekgrup <idgrup>'];
handler.tags = ['tools'];
handler.command = /^cekgrup$/i;
handler.owner = true;

module.exports = handler;