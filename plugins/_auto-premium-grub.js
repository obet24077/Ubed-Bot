let handler = async (m, { conn }) => {};

handler.all = async function (m) {
  try {
    // Cek apakah tipe pesan adalah saat member baru bergabung
    if (!m.messageStubType || m.messageStubType !== 27) return; // 27 = participant added
    if (!m.isGroup) return; // Pastikan hanya di grup

    const groupData = global.db.data.chats[m.chat];
    if (!groupData?.isPremiumGroup) return; // Pastikan grup ini premium

    const participant = m.messageStubParameters[0]; // ID user yang ditambahkan
    const groupName = (await conn.groupMetadata(m.chat)).subject; // Nama grup
    const now = Date.now();
    const expire = groupData.premiumGroupExpire || (now + 86400000); // Durasi premium, fallback 1 hari

    // Jika pengguna belum ada di db, buat entri baru
    if (!global.db.data.users[participant]) global.db.data.users[participant] = {};
    const user = global.db.data.users[participant];

    // Cek apakah pengguna sudah premium, jika iya pastikan hanya berlaku di grup ini
    if (user.premium) {
      if (user._fromPremGrup !== m.chat) {
        // Jika premium berasal dari grup lain, reset status premium mereka
        user.premium = false;
        user.premiumDate = 0;
        user._fromPremGrup = null;
      }
    }

    // Berikan status premium jika pengguna belum mendapatkannya dari grup ini
    if (!user.premium) {
      user.premium = true;
      user.premiumDate = expire;
      user._fromPremGrup = m.chat; // Tandai asal grup premium

      // Kirim pesan selamat datang dan informasi premium
      await conn.sendMessage(participant, {
        text: `Selamat datang di grup *${groupName}*\n\nKamu otomatis mendapatkan akses *Premium* selama masa aktif grup ini.`,
        mentions: [participant]
      });
    }
  } catch (err) {
    console.error('Error auto-premium join:', err);
  }
};

// Menangani ketika member keluar grup
handler.onExit = async function (m) {
  try {
    if (!m.isGroup) return;
    const groupData = global.db.data.chats[m.chat];
    if (!groupData?.isPremiumGroup) return;

    const participant = m.participant;
    const user = global.db.data.users[participant];

    // Jika pengguna premium dan keluar, reset status premium mereka
    if (user.premium && user._fromPremGrup === m.chat) {
      user.premium = false;
      user.premiumDate = 0;
      user._fromPremGrup = null;
    }
  } catch (err) {
    console.error('Error handling user exit from group:', err);
  }
};

// Fungsi untuk membatasi penggunaan premium di grup lain
let checkPremiumUsage = async (m, { conn }) => {
  try {
    if (!m.isGroup) return; // Pastikan hanya di grup

    const groupData = global.db.data.chats[m.chat];
    if (!groupData?.isPremiumGroup) return; // Pastikan grup ini premium

    const participant = m.participant; // ID user yang mencoba menggunakan fitur premium
    const user = global.db.data.users[participant];
    
    if (!user) return;

    // Cek apakah pengguna memiliki status premium dan apakah grup yang memberikan premium adalah grup ini
    if (user.premium && user._fromPremGrup !== m.chat) {
      // Jika premium berasal dari grup lain, kirim pemberitahuan
      await conn.sendMessage(m.chat, {
        text: `❌ Premium kamu tidak bisa dipakai di grup ini, karena kamu mendapatkan premium dari grup lain.`,
        mentions: [participant],
      });

      // Reset status premium jika tidak valid
      user.premium = false;
      user.premiumDate = 0;
      user._fromPremGrup = null;
    }

  } catch (err) {
    console.error('Error handling premium usage:', err);
  }
};

handler.checkPremiumUsage = checkPremiumUsage;

export default handler;