let handler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender];
    if (!user) return m.reply('Kamu belum terdaftar di database.');

    const maxLevel = 25;

    if (!user.atm) user.atm = 0;
    if (!user.money) user.money = 0;

    if (user.atm >= maxLevel) return m.reply(`💳 ATM kamu sudah mencapai level maksimum (${maxLevel}).`);

    // Hitung biaya upgrade berdasarkan level saat ini
    let biaya = 0;
    if (user.atm < 10) {
        biaya = 5_000_000;
    } else if (user.atm < 15) {
        biaya = 20_000_000;
    } else if (user.atm < 20) {
        biaya = 50_000_000;
    } else {
        biaya = 100_000_000;
    }

    if (user.money < biaya) return m.reply(`❌ Uang kamu tidak cukup untuk upgrade.\n💸 Butuh: Rp${biaya.toLocaleString('id-ID')}`);

    user.money -= biaya;
    user.atm += 1;

    m.reply(`✅ Berhasil upgrade ATM ke level ${user.atm}!\n💸 -Rp${biaya.toLocaleString('id-ID')}`);
};

handler.help = ['atmupgrade'];
handler.tags = ['rpg'];
handler.command = /^atmupgrade$/i;

export default handler;