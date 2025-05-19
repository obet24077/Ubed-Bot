const handler = async (m, { conn, args, usedPrefix, command }) => {
  const id = args[0] || m.chat;

  try {
    const chats = conn.chats[id];
    const isGroup = id.endsWith('@g.us');
    if (!isGroup) return m.reply('⚠️ Hanya bisa dipakai untuk grup! Contoh: .cekgrub 628xxxx@g.us');

    const data = global.db.data.chats[id] || {};

    let teks = `*Status Bot di Grup Ini:*\n\n`;
    teks += `• ID Grup: ${id}\n`;
    teks += `• Nama Grup: ${(await conn.groupMetadata(id)).subject}\n`;
    teks += `• Bot Aktif: ${!data.isBanned ? '✅ Ya' : '❌ Tidak'}\n`;
    teks += `• Mode Hanya Admin: ${data.modeAdmin ? '✅ Ya' : '❌ Tidak'}\n`;
    teks += `• Mode Hanya Premium: ${data.premiumOnly ? '✅ Ya' : '❌ Tidak'}\n`;
    teks += `• Mode Khusus Owner: ${data.privilegeOnly ? '✅ Ya' : '❌ Tidak'}\n`;

    if (data.isBanned) teks += `\n⚠️ *Bot tidak akan merespon karena grup ini dibanned.*`;
    if (data.modeAdmin) teks += `\n⚠️ *Bot hanya akan merespon admin grup.*`;
    if (data.premiumOnly) teks += `\n⚠️ *Fitur bot hanya untuk member premium.*`;

    return m.reply(teks);
  } catch (e) {
    console.error(e);
    return m.reply('❌ Gagal cek status grup. Pastikan ID grup valid atau bot masih ada di grup itu.');
  }
};

handler.help = ['cekgrub [id_grup]'];
handler.tags = ['owner', 'tools'];
handler.command = /^cekgrub$/i;
handler.owner = true; // hanya owner yang bisa pakai

export default handler;