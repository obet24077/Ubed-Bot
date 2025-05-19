let handler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender];
    let now = new Date * 1;
    let money = user.money || 0;

    // Cek apakah pengguna sudah memiliki akses premium
    if (user.premium) {
        return conn.reply(m.chat, `❌ Kamu sudah memiliki akses premium dan tidak dapat membeli lagi.`, m);
    }

    let harga = 1000000000; // Harga untuk membeli premium selama 8 jam (1 miliar)
    let limit = 1000; // Limit yang dibutuhkan untuk membeli premium

    // Mengecek apakah user sudah memiliki cukup uang dan limit
    if (money < harga) return conn.reply(m.chat, `❌ Maaf, uangmu tidak cukup untuk membeli premium. Kamu memerlukan ${harga} money untuk membeli premium 8 jam`, m);
    if (user.limit < limit) return conn.reply(m.chat, `❌ Maaf, kamu tidak memiliki cukup limit. Kamu memerlukan ${limit} limit untuk membeli premium 8 jam`, m);

    // Mengecek cooldown pembelian premium (24 jam)
    if (now < user.lastPremiumPurchase + 86400000) {
        let timeLeft = user.lastPremiumPurchase + 86400000 - now;
        return conn.reply(m.chat, `❌ Kamu bisa membeli premium lagi setelah ${time2now(timeLeft)}.`, m);
    }

    // Mengurangi uang dan limit dari user
    user.money -= harga;
    user.limit -= limit;

    // Menentukan waktu premium selama 8 jam
    if (now < user.premiumTime) user.premiumTime += 28800000; // Menambah waktu premium 8 jam
    else user.premiumTime = now + 28800000; // Set waktu premium 8 jam

    // Menandakan bahwa user telah membeli premium
    user.premium = true;
    user.lastPremiumPurchase = now; // Set waktu pembelian terakhir

    await conn.reply(m.chat, `✔️ Pembelian Premium berhasil!
        
📛 Nama: ${user.name}
📆 Masa Aktif: 8 jam
📉 Waktu Premium: ${time2now(user.premiumTime - now)}`, m);
}

handler.help = ['buyprem']
handler.tags = ['owner']
handler.command = /^(buyprem)$/i

handler.group = false
handler.rowner = false

export default handler;

// Fungsi untuk mengonversi waktu menjadi format yang lebih mudah dibaca
function time2now(ms) {
    let seconds = ms / 1000;
    let day = parseInt(seconds / 86400);
    seconds = seconds % 86400;
    let hour = parseInt(seconds / 3600);
    seconds = seconds % 3600;
    let minutes = parseInt(seconds / 60);
    seconds = parseInt(seconds % 60);
    return `${day} hari ${hour} jam ${minutes} menit ${seconds} detik`;
}