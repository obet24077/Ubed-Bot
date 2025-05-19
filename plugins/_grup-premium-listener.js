let handler = async (m, { conn }) => {}

handler.all = async function (m) {
  try {
    if (!m.messageStubType || m.messageStubType !== 32) return; // 32 = participant leave
    if (!m.isGroup) return;

    const groupData = global.db.data.chats[m.chat];
    if (!groupData?.isPremiumGroup) return;

    const participant = m.messageStubParameters[0];
    const userData = global.db.data.users[participant] || {};
    const groupName = (await conn.groupMetadata(m.chat)).subject;

    // Cek apakah dia premium dan memang dapat premium dari grup ini
    if (userData.premium && userData._fromPremGrup === m.chat) {
      // Hapus premium
      userData.premium = false;
      userData.premiumDate = 0;
      delete userData._fromPremGrup;

      // Kirim ucapan selamat tinggal ke grup
      await conn.sendMessage(m.chat, {
        text: `Selamat tinggal @${participant.split('@')[0]}!\nStatus premium kamu telah *dihapus otomatis* karena keluar dari grup ini.`,
        mentions: [participant]
      });

      // Kirim notif pribadi
      await conn.sendMessage(participant, {
        text: `Hai @${participant.split('@')[0]}, status premium kamu telah dihapus karena keluar dari grup *${groupName}*.`,
        mentions: [participant]
      });
    }
  } catch (err) {
    console.error('Error di plugin goodbye auto-premium:', err);
  }
};

export default handler;