import fs from "fs";

const filePath = "./database/investasi.json";

// Pastikan file database ada
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({ harga: [100000], investor: {}, dividen: 0 }, null, 2));
}

// Baca data investasi
let data = JSON.parse(fs.readFileSync(filePath, "utf8"));

const handler = async (m, { conn }) => {
    let sender = m.sender;
    
    // Cek apakah user punya saham money
    if (!data.investor[sender] || data.investor[sender] <= 0) {
        return m.reply("❌ Anda belum memiliki saham **money**. Gunakan `.beliinvest <jumlah>` untuk membeli saham.");
    }

    let sahamUser = data.investor[sender];
    let currentPrice = data.harga[data.harga.length - 1]; // Harga terakhir
    let totalValue = sahamUser * currentPrice;

    let message = `📊 **Saham Money Anda**\n\n` +
        `📈 **Jumlah Saham:** ${sahamUser.toLocaleString()}\n` +
        `💰 **Harga Saat Ini:** ${currentPrice.toLocaleString()} IDR\n` +
        `💎 **Total Nilai:** ${totalValue.toLocaleString()} IDR\n\n` +
        `⚡ Gunakan \`.ambilinvest\` untuk mencairkan keuntungan Anda.`;

    return m.reply(message);
};

handler.command = ["sahamku"];
handler.tags = ["rpg"];
handler.help = ["sahamku"];

export default handler;