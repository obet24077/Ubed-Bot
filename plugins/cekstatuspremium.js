// Cek apakah pengguna memiliki status premium yang valid untuk grup ini
const checkPremiumStatus = (m, user) => {
  // Jika user tidak premium atau premium-nya berasal dari grup lain
  if (!user.premium || user._fromPremGrup !== m.chat) {
    return false;
  }
  return true;
};

let handler = async (m, { conn }) => {
  try {
    // Contoh menggunakan premium (misalnya untuk fitur tertentu)
    if (m.isGroup) {
      const user = global.db.data.users[m.sender];
      if (!checkPremiumStatus(m, user)) {
        return conn.reply(m.chat, 'Kamu tidak memiliki akses premium di grup ini.', m);
      }

      // Lakukan aksi premium di sini, jika premium valid
      conn.reply(m.chat, 'Fitur premium berhasil digunakan!', m);
    }
  } catch (e) {
    console.error('Error dalam menggunakan premium:', e);
  }
};

export default handler;