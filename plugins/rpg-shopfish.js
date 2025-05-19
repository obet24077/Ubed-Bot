const prices = {
    hiu: { buy: 1500, sell: 400 },
    ikan: { buy: 500, sell: 50 },
    dory: { buy: 800, sell: 200 },
    orca: { buy: 1500, sell: 400 },
    paus: { buy: 2000, sell: 900 },
    cumi: { buy: 1400, sell: 300 },
    gurita: { buy: 1600, sell: 500 },
    buntal: { buy: 700, sell: 100 },
    udang: { buy: 500, sell: 50 },
    lumba: { buy: 1500, sell: 400 },
    lobster: { buy: 800, sell: 200 },
    kepiting: { buy: 700, sell: 150 },
};

function formatNumber(num) {
    return num.toLocaleString('id-ID'); // Format angka dengan koma sebagai pemisah ribuan
}

let handler = async (m, { conn, command, args, usedPrefix }) => {
    let jualbeli = args[0]?.toLowerCase();
    let type = args[1]?.toLowerCase();
    let count = args[2] && args[2].toLowerCase() === 'all' ? global.db.data.users[m.sender][type] : (args[2] && args[2].length > 0 ? Math.min(99999999, Math.max(parseInt(args[2]), 1)) : 1);

    const Kaine = `Cara Buy dan Sell
.shopfish buy ikan 1
> (membeli ikan 1)
.shopfish sell hiu 3
> (menjual hiu 3)
.shopfish sell hiu all
> (menjual semua hiu)

============================

*Fishing | Harga Beli*
Hiu: ${formatNumber(prices.hiu.buy)}
Ikan: ${formatNumber(prices.ikan.buy)}
Dory: ${formatNumber(prices.dory.buy)}
Orca: ${formatNumber(prices.orca.buy)}
Paus: ${formatNumber(prices.paus.buy)}
Cumi: ${formatNumber(prices.cumi.buy)}
Gurita: ${formatNumber(prices.gurita.buy)}
Buntal: ${formatNumber(prices.buntal.buy)}
Udang: ${formatNumber(prices.udang.buy)}
Lumba²: ${formatNumber(prices.lumba.buy)}
Lobster: ${formatNumber(prices.lobster.buy)}
Kepiting: ${formatNumber(prices.kepiting.buy)}

*Fishing | Harga Jual*
Hiu: ${formatNumber(prices.hiu.sell)}
Ikan: ${formatNumber(prices.ikan.sell)}
Dory: ${formatNumber(prices.dory.sell)}
Orca: ${formatNumber(prices.orca.sell)}
Paus: ${formatNumber(prices.paus.sell)}
Cumi: ${formatNumber(prices.cumi.sell)}
Gurita: ${formatNumber(prices.gurita.sell)}
Buntal: ${formatNumber(prices.buntal.sell)}
Udang: ${formatNumber(prices.udang.sell)}
Lumba²: ${formatNumber(prices.lumba.sell)}
Lobster: ${formatNumber(prices.lobster.sell)}
Kepiting: ${formatNumber(prices.kepiting.sell)}
`.trim();

    try {
        if (/shopfish/i.test(command)) {
            switch (jualbeli) {
                case 'buy':
                    if (!(type in prices)) return conn.reply(m.chat, Kaine, m);
                    if (global.db.data.users[m.sender].eris < prices[type].buy * count)
                        return conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} ${type} dengan harga ${formatNumber(prices[type].buy * count)} Money`, m);
                    global.db.data.users[m.sender][type] += count * 1;
                    global.db.data.users[m.sender].eris -= prices[type].buy * count;
                    conn.reply(m.chat, `Sukses membeli ${count} ${type} dengan harga ${formatNumber(prices[type].buy * count)} Money`, m);
                    break;
                case 'sell':
                    if (!(type in prices)) return conn.reply(m.chat, Kaine, m);
                    if (global.db.data.users[m.sender][type] < count * 1)
                        return conn.reply(m.chat, `${type} anda tidak cukup`, m);
                    const totalSellPrice = prices[type].sell * count;
                    global.db.data.users[m.sender][type] -= count * 1;
                    global.db.data.users[m.sender].eris += totalSellPrice;
                    conn.reply(m.chat, `Sukses menjual ${count} ${type}, dan anda mendapatkan ${formatNumber(totalSellPrice)} Money`, m);
                    break;
                default:
                    return conn.reply(m.chat, Kaine, m);
            }
        }
    } catch (e) {
        conn.reply(m.chat, Kaine, m);
        console.error(e);
    }
};

handler.help = ['shopfish2'];
handler.tags = ['rpg'];
handler.command = /^(shopfish2)$/i;
handler.limit = true;
handler.group = true;
handler.register = true;

export default handler;