import fs from 'fs';

const clanFile = './clan.json';

const loadClanData = () => {
  try {
    const data = fs.readFileSync(clanFile);
    return JSON.parse(data);
  } catch (error) {
    console.error('Gagal membaca file clan.json:', error);
    return { clans: {}, members: {} };
  }
};

const saveClanData = (data) => {
  try {
    fs.writeFileSync(clanFile, JSON.stringify(data, null, 2));
    console.log('Data clan berhasil disimpan.');
  } catch (error) {
    console.error('Gagal menyimpan data clan:', error);
  }
};

const logClanActivity = (clanId, message, clans, members) => {
  if (!clans[clanId]) return;
  if (!clans[clanId].activityLog) clans[clanId].activityLog = [];
  clans[clanId].activityLog.push({ message, timestamp: Date.now() });
  if (clans[clanId].activityLog.length > 100) {
    clans[clanId].activityLog.shift();
  }
  saveClanData({ clans, members });
};

async function addClanCP(clanId, sender, amount, clans, members, logActivity) {
  try {
    const clan = clans[clanId];
    if (!clan) {
      return 'Clan tidak ditemukan, Senpai!';
    }

    if (clan.owner !== sender) {
      return 'Cuma Owner yang bisa nambah CP Bank, Senpai!';
    }

    if (isNaN(amount) || amount <= 0) {
      return 'Jumlah CP yang mau ditambah harus angka positif, Senpai!';
    }

    clan.bank += amount;
    logActivity(clanId, `${global.db.data.users[sender]?.name || sender} menambahkan Cp. ${amount.toLocaleString('id-ID')} ke bank.`, clans, members);
    saveClanData({ clans, members });

    return `Berhasil menambahkan Cp. ${amount.toLocaleString('id-ID')} ke bank clan, Senpai!`;

  } catch (error) {
    console.error('Gagal menambahkan CP ke bank clan:', error);
    return 'Terjadi kesalahan saat menambahkan CP ke bank clan, Senpai!';
  }
}

let handler = async (m, { conn, text, args, usedPrefix, command, sender }) => {
  const { clans, members } = loadClanData(); // Load data clan

  try {
    await conn.sendMessage(m.chat, { react: { text: '💰', key: m.key } });

    if (!members[sender]) {
      return m.reply('Kamu belum bergabung dengan clan, Senpai!');
    }

    const clanId = members[sender];
    const amountToAdd = parseInt(args[0]); // Ambil jumlah dari argumen

    const result = await addClanCP(clanId, sender, amountToAdd, clans, members, logClanActivity);
    await m.reply(result);

  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    await m.reply(`Terjadi kesalahan saat memproses perintah ${command}.`);
  } finally {
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  }
};

handler.help = ['addcp <jumlah>'];
handler.tags = ['clan'];
handler.command = /^addcp$/i;
handler.owner = true; // Hanya owner bot yang bisa pakai
handler.group = true;
handler.register = true;

export default handler;