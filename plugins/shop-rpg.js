let handler = async (m, { command, args }) => {
  const shopItems = {
    '🍌 Pisang': 1000,
    '🥭 Mangga': 1500,
    '🍊 Jeruk': 1200,
    '🍇 Anggur': 2000,
    '🍎 Apel': 1300,
    '🌱🍌 Bibit Pisang': 1000,
    '🌱🥭 Bibit Mangga': 1500,
    '🌱🍊 Bibit Jeruk': 1200,
    '🌱🍇 Bibit Anggur': 2000,
    '🌱🍎 Bibit Apel': 1300,
    '🧪 Potion': 5000,
    '💎 Diamond': 10000,
    '📦 Common Box': 7000,
    '🎁 Uncommon Box': 10000,
    '⚗️ Mythic Box': 20000,
    '🏆 Legendary Box': 30000,
    '⭐ Exp': 2000,
    '🪵 Kayu': 500,
    '🪨 Batu': 500,
    '⛓️ Iron': 2000,
    '🧵 String': 1000,
    '💧 Aqua': 700,
    '🟡 Emas Batang': 5000,
    '🪙 Emas Biasa': 3000,
    '🔷 Berlian': 10000,
    '🗑️ Sampah': 100,
    '🍾 Botol': 150,
    '🥫 Kaleng': 150,
    '📦 Kardus': 200,
    '🔥🐦 Phonix': 100000,
    '🦅🦁 Griffin': 100000,
    '🦊✨ Kyubi': 100000,
    '🐉 Naga': 100000,
    '🐎🏹 Centaur': 100000,
    '🐎 Kuda': 50000,
    '🦊 Rubah': 50000,
    '🐱 Kucing': 50000,
    '🐺 Serigala': 50000,
    '🐾 Pet Biasa': 30000,
    '🍖 Makanan Pet': 2000,
    '🔥🍗 Makanan Phonix': 5000,
    '🦅🍗 Makanan Griffin': 5000,
    '🐉🍖 Makanan Naga': 5000,
    '🦊🍖 Makanan Kyubi': 5000,
    '🏹🍗 Makanan Centaur': 5000,
    '🗡️ Sword': 10000,
    '🎣 Pancingan': 10000,
    '⛽ Bensin': 5000,
    '🔫 Senjata': 15000,
    '🔧 Stok Senjata': 10000,
    '🏞️ Kolam': 20000,
    '🎫 Tiket Coin': 7000,
    '🪙✨ Koin EXP G': 8000,
    '🪴 Garden Boxs': 12000,
    '🍄 Ketake': 2500,
    '⚗️ Eleksir B': 3000,
    '💊 Obat': 1000,
    '📈 nStock': 2000,
    '🪱 Umpan': 1000,
    '❤️‍🩹 Healt Monster': 4000,
    '🦈 Hiu': 50000,
    '🐟 Ikan': 10000,
    '🐠 Dory': 25000,
    '🐋 Orca': 100000,
    '🐳 Paus': 80000,
    '🦑 Cumi': 20000,
    '🐙 Gurita': 30000,
    '🐡 Buntal': 15000,
    '🦐 Udang': 5000,
    '🐬 Lumba²': 10000,
    '🦞 Lobster': 20000,
    '🦀 Kepiting': 15000
  };

  // Menampilkan toko item
  if (command === 'shop' || command === 'toko') {
    let shop = `
    ╭───〔  *TOKO ITEM RPG*  〕───⬣

🍎 *Buahan*
🍌 Pisang       | 1.000
🥭 Mangga       | 1.500
🍊 Jeruk        | 1.200
🍇 Anggur       | 2.000
🍎 Apel         | 1.300

🌱 *Bibit*
🌱🍌 Bibit Pisang     | 1.000
🌱🥭 Bibit Mangga     | 1.500
🌱🍊 Bibit Jeruk      | 1.200
🌱🍇 Bibit Anggur     | 2.000
🌱🍎 Bibit Apel       | 1.300

🧃 *Item RPG*
🧪 Potion       | 5.000
💎 Diamond      | 10.000
📦 Common Box   | 7.000
🎁 Uncommon Box | 10.000
⚗️ Mythic Box   | 20.000
🏆 Legendary Box| 30.000
⭐ Exp          | 2.000

⚙️ *Material*
🪵 Kayu         | 500
🪨 Batu         | 500
⛓️ Iron         | 2.000
🧵 String       | 1.000
💧 Aqua         | 700
🟡 Emas Batang  | 5.000
🪙 Emas Biasa   | 3.000
🔷 Berlian      | 10.000

♻️ *Sampah*
🗑️ Sampah       | 100
🍾 Botol        | 150
🥫 Kaleng       | 150
📦 Kardus       | 200

🐾 *Pet*
🔥🐦 Phonix      | 100.000
🦅🦁 Griffin     | 100.000
🦊✨ Kyubi       | 100.000
🐉 Naga         | 100.000
🐎🏹 Centaur     | 100.000
🐎 Kuda         | 50.000
🦊 Rubah        | 50.000
🐱 Kucing       | 50.000
🐺 Serigala     | 50.000
🐾 Pet Biasa    | 30.000

🍖 *Makanan Pet*
🍖 Makanan Pet         | 2.000
🔥🍗 Makanan Phonix     | 5.000
🦅🍗 Makanan Griffin    | 5.000
🐉🍖 Makanan Naga       | 5.000
🦊🍖 Makanan Kyubi      | 5.000
🏹🍗 Makanan Centaur    | 5.000

⚒️ *Peralatan*
🗡️ Sword        | 10.000
🎣 Pancingan    | 10.000
⛽ Bensin       | 5.000
🔫 Senjata      | 15.000
🔧 Stok Senjata | 10.000
🏞️ Kolam        | 20.000

🎟️ *Tiket & Khusus*
🎫 Tiket Coin   | 7.000
🪙✨ Koin EXP G | 8.000
🪴 Garden Boxs  | 12.000
🍄 Ketake       | 2.500
⚗️ Eleksir B    | 3.000
💊 Obat         | 1.000
📈 nStock       | 2.000

🪱 *Pancing*
🪱 Umpan        | 1.000

❤️ *Lainnya*
❤️‍🩹 Healt Monster | 4.000

🐟 *Ikan Kolam*
🦈 Hiu        | 50.000
🐟 Ikan       | 10.000
🐠 Dory       | 25.000
🐋 Orca       | 100.000
🐳 Paus       | 80.000
🦑 Cumi       | 20.000
🐙 Gurita     | 30.000
🐡 Buntal     | 15.000
🦐 Udang      | 5.000
🐬 Lumba²     | 10.000
🦞 Lobster    | 20.000
🦀 Kepiting   | 15.000

╰── Ketik *.shop buy item jumlah* untuk membeli
    `.trim();
    m.reply(shop);
  }

  // Membeli item
  if (command === 'buy' && args.length === 2) {
    let itemName = args[0]; // Nama item
    let quantity = parseInt(args[1]); // Jumlah yang ingin dibeli

    // Memeriksa apakah item ada dalam toko
    if (!shopItems[itemName]) {
      return m.reply('Item tidak ditemukan di toko.');
    }

    // Harga item
    let price = shopItems[itemName];

    // Total harga untuk jumlah yang dibeli
    let totalPrice = price * quantity;

    // Cek saldo pengguna (misalnya di database)
    let userMoney = 1000000; // Contoh: saldo pengguna

    // Jika saldo cukup
    if (userMoney >= totalPrice) {
      // Lakukan transaksi (misalnya mengurangi saldo dan menambahkan item ke inventaris)
      userMoney -= totalPrice;
      // Tambahkan item ke inventaris pengguna (logika ini tergantung implementasi)
      
      m.reply(`Berhasil membeli ${quantity} ${itemName} dengan total harga ${totalPrice} money.`);
    } else {
      m.reply('Uangmu tidak cukup untuk membeli item ini.');
    }
  }
};

handler.help = ['shop', 'toko'];
handler.tags = ['rpg'];
handler.command = ['shop', 'toko'];
handler.register = true;

export default handler;