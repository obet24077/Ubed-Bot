const handler = async (m, { text, conn }) => {
  if (!text) return m.reply('Masukkan teks statusmu!\nContoh: .statusubed Hidup ini keras, aku lebih keras');
  if (text.length > 2000) return m.reply('⚠️ Maksimal 2000 karakter untuk status.');

  const user = m.sender;
  const name = await conn.getName(user);
  const now = Date.now();
  global.db.data.ubedStatus ??= [];
  const statusList = global.db.data.ubedStatus;

  // Cek cooldown
  const last = statusList.find(s => s.user === user);
  if (last && now - last.timestamp < 3600000) {
    const wait = ((3600000 - (now - last.timestamp)) / 60000).toFixed(1);
    return m.reply(`⚠️ Kamu hanya bisa update status setiap 1 jam sekali.\nTunggu ${wait} menit lagi.`);
  }

  // Update jika sudah pernah, atau push jika belum
  if (last) {
    last.text = text;
    last.timestamp = now;
  } else {
    statusList.push({
      user,
      username: name,
      text,
      timestamp: now,
      comments: []
    });
  }

  m.reply(`✅ Status berhasil diperbarui!`);
};

handler.help = ['statusubed <teks>'];
handler.tags = ['media'];
handler.command = /^statusubed$/i;

export default handler;