const handler = async (m, { conn, args, text, usedPrefix, command }) => {
  global.db.data.ubedAccounts ??= {};
  global.db.data.ubedSessions ??= {};

  if (!global.db.data.ubedSessions[m.sender]) return m.reply('❌ Kamu belum login ke *Ubed Media*.');

  const akun = global.db.data.ubedAccounts[m.sender] ??= {};
  const subcmd = args[0]?.toLowerCase();
  const isi = args.slice(1).join(' ');

  if (!subcmd) {
    return m.reply(`✍️ Gunakan format:\n\n${usedPrefix + command} nama <namamu>\n${usedPrefix + command} kota <kotamu>\n${usedPrefix + command} bio <biomu>\n${usedPrefix + command} foto <url gambar>`);
  }

  switch (subcmd) {
    case 'nama':
      if (!isi) return m.reply('⚠️ Masukkan nama yang valid.');
      akun.nama = isi;
      m.reply('✅ Nama berhasil diubah.');
      break;

    case 'kota':
      if (!isi) return m.reply('⚠️ Masukkan nama kota.');
      akun.kota = isi;
      m.reply('✅ Kota berhasil diubah.');
      break;

    case 'bio':
      if (!isi) return m.reply('⚠️ Masukkan bio.');
      akun.bio = isi;
      m.reply('✅ Bio berhasil diubah.');
      break;

    case 'foto':
      if (!isi || !/^https?:\/\//i.test(isi)) return m.reply('⚠️ Masukkan URL gambar yang valid.\nContoh: *.editprofil foto https://i.catbox.moe/abcxyz.jpg*');
      akun.foto = isi;
      m.reply('✅ Foto profil berhasil diperbarui.');
      break;

    default:
      m.reply('⚠️ Sub perintah tidak dikenali.');
  }
};

handler.command = /^editprofil$/i;
handler.tags = ['media'];
handler.help = ['editprofil nama|kota|bio|foto <isi>'];

export default handler;