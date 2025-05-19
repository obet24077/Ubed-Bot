function formatRupiah(amount) {
    if (typeof amount !== 'number') return '[ 0 (0) ]';

    let formatted = new Intl.NumberFormat('id-ID').format(amount);
    let suffix = '';

    if (amount >= 1e12) {
        suffix = `${(amount / 1e12).toFixed(amount % 1e12 === 0 ? 0 : 1)}T`;
    } else if (amount >= 1e9) {
        suffix = `${(amount / 1e9).toFixed(amount % 1e9 === 0 ? 0 : 1)}M`;
    } else if (amount >= 1e6) {
        suffix = `${(amount / 1e6).toFixed(amount % 1e6 === 0 ? 0 : 1)}JT`;
    } else if (amount >= 1e3) {
        suffix = `${(amount / 1e3).toFixed(amount % 1e3 === 0 ? 0 : 1)}K`;
    } else {
        suffix = amount.toString();
    }

    return `[ ${formatted} (${suffix}) ]`;
}

let handler = async (m, { conn }) => {
    let target = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;
    let user = global.db.data.users[target];

    if (!user) return m.reply('Pengguna tidak ditemukan dalam database.');

    // Tentukan batas saldo berdasarkan level ATM
    let maxSaldo = 25_000_000_000; // default
    if (user.atm >= 25) {
        maxSaldo = 100_000_000_000;
    } else if (user.atm >= 15) {
        maxSaldo = 50_000_000_000;
    }

    // Pastikan saldo tidak melebihi batas maksimal
    user.money = Math.min(user.money || 0, maxSaldo);
    user.bank = Math.min(user.bank || 0, maxSaldo);

    let saldoBankKeluarga = 0;
    if (user.isMarried && user.pasangan) {
        let pasanganData = global.db.data.users[user.pasangan];
        if (pasanganData) {
            pasanganData.bankKeluarga = Math.min(pasanganData.bankKeluarga || 0, maxSaldo);
            saldoBankKeluarga = pasanganData.bankKeluarga;
        }
    }

    let saldoPribadiFormatted = formatRupiah(user.money);
    let saldoBankFormatted = formatRupiah(user.bank);
    let bankKeluargaFormatted = formatRupiah(saldoBankKeluarga);
    let displayName = user.registered ? user.name : await conn.getName(target);

    let caption = `
🌸 𓆩 𝗕𝗔𝗡𝗞 𓆪 🌸

📝 𝗡𝗮𝗺𝗮 : ${displayName}
💳 𝗔𝗧𝗠 : ${user.atm > 0 ? 'Level ' + user.atm : 'Tidak Punya'}
🏛️ 𝗕𝗮𝗻𝗸 : ${saldoBankFormatted}
💵 𝗦𝗮𝗹𝗱𝗼 𝗣𝗿𝗶𝗯𝗮𝗱𝗶 : ${saldoPribadiFormatted}
${user.isMarried ? `👨‍👩‍👧‍👦 𝗕𝗮𝗻𝗸 𝗞𝗲𝗹𝘂𝗮𝗿𝗴𝗮 : ${bankKeluargaFormatted}\n` : ''}
📊 𝗦𝘁𝗮𝘁𝘂𝘀 : ${user.premiumTime > 0 ? '√' : '×'}
🌟 𝗥𝗲𝗴𝗶𝘀𝘁𝗲𝗿𝗲𝗱 : ${user.registered ? '√' : '×'}
`.trim();

    return m.reply(caption);
};

handler.help = ['bank [@user]'];
handler.tags = ['rpg'];
handler.command = /^(bank)$/i;

export default handler;