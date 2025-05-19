const handler = async (m, { conn }) => {
  const now = Date.now();
  const chats = global.db.data.chats;
  const users = global.db.data.users;

  for (const chatId in chats) {
    const chat = chats[chatId];

    if (chat.isPremiumGroup && now > chat.premiumGroupExpire) {
      chat.isPremiumGroup = false;
      chat.premiumGroupExpire = 0;

      try {
        const groupMeta = await conn.groupMetadata(chatId);
        const participants = groupMeta.participants || [];

        for (const user of participants) {
          const jid = user.id;
          if (users[jid]) {
            users[jid].premium = false;
            users[jid].premiumDate = 0;
          }
        }

        await conn.sendMessage(chatId, {
          text: '⚠️ *Premium Grup sudah habis.*\nSemua member telah kembali ke status *free*.',
        });
      } catch (e) {
        console.error(`Gagal mengirim pesan ke ${chatId}:`, e);
      }
    }
  }
};

handler.command = /^cekpremgrub$/i; // bisa dipanggil manual juga
handler.tags = ['owner'];
handler.help = ['cekpremgrub'];
handler.owner = true;

export default handler;