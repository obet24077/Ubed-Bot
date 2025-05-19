export const handler = async (m, { conn, command, args }) => {
    const jualbeli = (args[0] || '').toLowerCase();
    const Kchat = `⛊━─┈────────┈─━⛊
*💲 Harga Beli*
🐃 Banteng:      20,000
🐅 Harimau:      24,000
🐘 Gajah:           30,000
🐐 Kambing:     16,000
🐼 Panda:         40,000
🐊 Buaya:         36,000
🐃 Kerbau:        18,000
🐂 Sapi:            22,000
🐒 Monyet:       14,000
🐗 Babi Hutan: 17,000
🐖 Babi:             16,000
🐔 Ayam:           10,000
⛊━─┈────────┈─━⛊
*🌱 Harga Jual*:
🐃 Banteng:      10,000
🐅 Harimau:      12,000
🐘 Gajah:           15,000
🐐 Kambing:     8,000
🐼 Panda:         20,000
🐊 Buaya:         18,000
🐃 Kerbau:        9,000
🐂 Sapi:            11,000
🐒 Monyet:       7,000
🐗 Babi Hutan: 8,500
🐖 Babi:             8,000
🐔 Ayam:           5,000
⛊━─┈────────┈─━⛊
Contoh
.shophewan buy ayam 3
> (untuk membeli ayam jumlah 3)
.shophewan sell sapi 3
> (untuk menjual sapi jumlah 3)
.shophewan sell sapi all
> (untuk menjual sapi semua yang dimiliki)`.trim();

    try {
        switch (jualbeli) {
            case '':
            case 'shophewan':
                conn.reply(m.chat, Kchat, m);
                break;

            case 'sell':
                const sellType = (args[1] || '').toLowerCase();
                const sellCount = args[2] === 'all' ? (global.db.data.users[m.sender][sellType] || 0) : Math.max(1, parseInt(args[2]) || 1);

                const sellPrices = {
                    banteng: 10000,
                    harimau: 12000,
                    gajah: 15000,
                    kambing: 8000,
                    panda: 20000,
                    buaya: 18000,
                    kerbau: 9000,
                    sapi: 11000,
                    monyet: 7000,
                    babihutan: 8500,
                    babi: 8000,
                    ayam: 5000
                };

                if (!sellPrices[sellType]) {
                    conn.reply(m.chat, `Hewan ${sellType} tidak ditemukan.`, m);
                    break;
                }

                if (global.db.data.users[m.sender][sellType] >= sellCount) {
                    const totalSellPrice = sellPrices[sellType] * sellCount;
                    global.db.data.users[m.sender].eris += totalSellPrice;
                    global.db.data.users[m.sender][sellType] -= sellCount;

                    conn.reply(
                        m.chat,
                        `Sukses menjual ${sellCount.toLocaleString()} ${sellType} dengan harga ${totalSellPrice.toLocaleString()} Money.`,
                        m
                    );
                } else {
                    conn.reply(m.chat, `${sellType.charAt(0).toUpperCase() + sellType.slice(1)} kamu tidak cukup untuk dijual.`, m);
                }
                break;

            case 'buy':
                const buyType = (args[1] || '').toLowerCase();
                const buyCount = args[2] === 'all' ? Math.floor(global.db.data.users[m.sender].eris / (buyPrices[buyType] || Infinity)) : Math.max(1, parseInt(args[2]) || 1);

                const sellToBuyMultiplier = 2;
                const buyPrices = {
                    banteng: 10000 * sellToBuyMultiplier,
                    harimau: 12000 * sellToBuyMultiplier,
                    gajah: 15000 * sellToBuyMultiplier,
                    kambing: 8000 * sellToBuyMultiplier,
                    panda: 20000 * sellToBuyMultiplier,
                    buaya: 18000 * sellToBuyMultiplier,
                    kerbau: 9000 * sellToBuyMultiplier,
                    sapi: 11000 * sellToBuyMultiplier,
                    monyet: 7000 * sellToBuyMultiplier,
                    babihutan: 8500 * sellToBuyMultiplier,
                    babi: 8000 * sellToBuyMultiplier,
                    ayam: 5000 * sellToBuyMultiplier
                };

                if (!buyPrices[buyType]) {
                    conn.reply(m.chat, `Hewan ${buyType} tidak ditemukan.`, m);
                    break;
                }

                const totalBuyPrice = buyPrices[buyType] * buyCount;

                if (global.db.data.users[m.sender].eris >= totalBuyPrice) {
                    global.db.data.users[m.sender].eris -= totalBuyPrice;
                    global.db.data.users[m.sender][buyType] = (global.db.data.users[m.sender][buyType] || 0) + buyCount;

                    conn.reply(
                        m.chat,
                        `Sukses membeli ${buyCount.toLocaleString()} ${buyType} dengan harga ${totalBuyPrice.toLocaleString()} Money.`,
                        m
                    );
                } else {
                    conn.reply(
                        m.chat,
                        `Uang kamu tidak cukup untuk membeli ${buyCount.toLocaleString()} ${buyType}. Harga total adalah ${totalBuyPrice.toLocaleString()} Money.`,
                        m
                    );
                }
                break;

            default:
                conn.reply(m.chat, Kchat, m);
                break;
        }
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, 'Terjadi kesalahan. Silakan coba lagi nanti.', m);
    }
};

handler.help = ['shophewan'];
handler.tags = ['rpg'];
handler.command = /^shophewan$/i;
handler.limit = 2;
handler.group = true;
handler.register = true;

export default handler;