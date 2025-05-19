let handler = async (m, { conn, args }) => {
    let item = (args[0] || '').toLowerCase();
    let count = parseInt(args[1]);
    let user = global.db.data.users[m.sender];

    // Daftar harga item yang dijual (tanpa limit)
    const itemPrices = {
        potion: 20000, diamond: 100000, common: 100000, 
        uncommon: 100000, mythic: 100000, legendary: 200000, sampah: 120,
        kayu: 1000, botol: 300, kaleng: 400, kardus: 400, pisang: 5500, 
        mangga: 4600, jeruk: 6000, anggur: 5500, apel: 5500, bibitpisang: 550, 
        bibitmangga: 550, bibitjeruk: 550, bibitanggur: 550, bibitapel: 550, 
        gardenboxs: 65000, berlian: 150000, emasbatang: 250000, emasbiasa: 150000, 
        phonix: 1000000000, griffin: 100000000, kyubi: 100000000, naga: 100000000, 
        centaur: 100000000, kuda: 50000000, rubah: 100000000, kucing: 5000000, 
        serigala: 50000000, makananpet: 50000, makananphonix: 80000, makanangriffin: 80000, 
        makanannaga: 150000, makanankyubi: 150000, makanancentaur: 150000, 
        healtmonster: 20000, pet: 150000, exp: 550, aqua: 5000, iron: 20000, 
        string: 50000, sword: 150000, umpan: 1500, pancingan: 5000000, bensin: 20000, 
        weap: 150000, batu: 500, ketake: 15, tiketcoin: 500, koinexpg: 500000, 
        obat: 15000, eleksirb: 500, nStock: 9999, weapStock: 50
    };

    if (!item) {
        let itemList = Object.keys(itemPrices).map(i => `• *${i}* - 💰 Rp${itemPrices[i].toLocaleString()}`).join('\n');
        return conn.reply(m.chat, `🛒 *Daftar Item yang Dijual:*\n\n${itemList}\n\n📌 *Cara beli:* .beli <item> <jumlah>\n📌 *Contoh:* .beli potion 1`, m);
    }

    if (!args[1] || isNaN(count) || count < 1) {
        throw '*Contoh*: .beli potion 10';
    }

    if (!(item in itemPrices)) {
        return m.reply(`❌ *Item tidak ditemukan!*\nKetik *.beli* untuk melihat daftar item yang tersedia.`);
    }

    if ((user[item] || 0) + count > 9999) {
        return m.reply(`⚠️ Kamu tidak bisa memiliki lebih dari *9.999 ${item}*!`);
    }

    let price = itemPrices[item] * count;

    if (user.money < price) {
        throw `💰 Uang kamu tidak cukup untuk membeli ${count} ${item}.\n💵 Harga 1 ${item}: ${itemPrices[item].toLocaleString()} money.\n💳 Saldo kamu: ${user.money.toLocaleString()} money.`;
    }

    conn.sendMessage(m.chat, { react: { text: '🛒', key: m.key } });

    user.money -= price;
    user[item] = (user[item] || 0) + count;

    conn.reply(m.chat, `✅ *Berhasil!*\nKamu telah membeli ${count} ${item} dengan harga ${price.toLocaleString()} money.`, m);
};

handler.help = ['beli'];
handler.tags = ['rpg'];
handler.command = /^beli$/i;
handler.register = true;
handler.limit = false;

export default handler;