let handler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender];
    let bot = global.db.data.settings[conn.user.jid];

    if (!user.premiumTime || user.premiumTime < 1) throw '❌ Kamu bukan pengguna premium.';
    
    const sisaPremium = user.premiumTime - new Date() * 1;
    if (sisaPremium < 8 * 60 * 60 * 1000) throw `⏳ Premium kamu kurang dari 8 jam.\n\nSisa waktu: ${await time(sisaPremium)}\nKamu bisa menggunakan fitur ini apabila premium Kamu di atas 8 Jam`;

    if (!user.cheatTime) user.cheatTime = 0;
    if (new Date() - user.cheatTime < 86400000) throw `⏳ Tunggu dulu ya...\nGunakan lagi setelah: ${await time(user.cheatTime + 86400000 - new Date)}`;

    user.money = 999999999;
    user.limit = 999999999;
    user.exp = 999999999;
    user.cheatTime = new Date() * 1;

    m.reply(`   [ *P R E M I U M* 👑 ]\n\n*Selamat Kamu Mendapatkan:*\n*Koin:* 999999999\n*Limit:* 999999999\n*Exp:* 999999999`);
};

handler.command = /^(cheat)$/i;
handler.premium = true;
handler.cooldown = 1;
export default handler;

function time(ms) {
    let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000);
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24;
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
    return [d, ' *Hari* ', h, ' *Jam* ', m, ' *Menit* ', s, ' *Detik* '].map(v => v.toString().padStart(2, 0)).join('');
}