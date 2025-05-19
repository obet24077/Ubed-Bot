let handler = async (m, { conn }) => {
  try {
    if (!m.isGroup) return; // Pastikan hanya di grup

    const groupData = global.db.data.chats[m.chat];
    if (!groupData?.isPremiumGroup) return; // Pastikan grup ini premium

    const participant = m.participant; // ID user yang mencoba menggunakan fitur premium
    const user = global.db.data.users[participant];
    
    if (!user) return;

    // Cek apakah pengguna memiliki status premium, dan apakah grup yang memberikan premium adalah grup ini
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

export default handler;