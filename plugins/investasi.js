import fs from "fs";
import { createCanvas } from "canvas";

const filePath = "./database/investasi.json";

// Jika file tidak ada, buat file default
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({ harga: [100000], investor: {}, dividen: 0 }, null, 2));
}

// Baca data investasi
let data = JSON.parse(fs.readFileSync(filePath, "utf8"));

// ** Fungsi Simpan Data **
function saveData() {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ** Fungsi Update Harga Investasi dengan Fluktuasi Drastis **
function updateHarga() {
    let lastPrice = data.harga[data.harga.length - 1];
    let change = Math.floor((Math.random() * 5000) - 2500); // Naik turun max 2500 IDR
    let newPrice = Math.max(50000, lastPrice + change); // Harga minimal 50K

    // Tambahkan harga baru ke daftar harga
    data.harga.push(newPrice);

    // Simpan hanya 1 hari data (288 iterasi per 24 jam dengan interval 5 menit)
    if (data.harga.length > 288) data.harga.shift();

    // Simpan perubahan data
    saveData();
}
setInterval(updateHarga, 60000); // Update tiap 1 menit

// ** Fungsi Dividen (Penghasilan Pasif) **
function bagiDividen() {
    let totalInvestasi = Object.values(data.investor).reduce((a, b) => a + b, 0);
    if (totalInvestasi === 0) return;

    let dividenPerSaham = Math.floor(data.harga[data.harga.length - 1] * 0.002); // 0.2% dari harga saham
    Object.keys(data.investor).forEach(user => {
        let sahamUser = data.investor[user];
        let keuntungan = sahamUser * dividenPerSaham;
        global.db.data.users[user].money += keuntungan;
    });

    saveData();
}
setInterval(bagiDividen, 3600000); // Dividen tiap 1 jam

// ** Fungsi Buat Grafik Harga yang Diperbaiki dengan Desain Lebih Menarik **
function generateChart() {
    const width = 600, height = 400;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Background gradasi
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#f0f0f0");
    gradient.addColorStop(1, "#ffffff");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Grid (garis bantu) untuk sumbu Y dan X
    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 10; i++) {
        ctx.beginPath();
        ctx.moveTo(40, (i * height) / 10);
        ctx.lineTo(width - 10, (i * height) / 10);
        ctx.stroke();
    }

    // Garis sumbu
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, 10); // Sumbu Y
    ctx.lineTo(40, height - 30);
    ctx.lineTo(width - 10, height - 30); // Sumbu X
    ctx.stroke();

    // Data harga investasi (ambil 50 data terakhir)
    let prices = data.harga.slice(-50);
    let minPrice = Math.min(...prices);
    let maxPrice = Math.max(...prices);

    // Normalisasi harga agar sesuai dengan tinggi grafik
    let normalize = (price) => ((price - minPrice) / (maxPrice - minPrice)) * (height - 50);

    // Gradasi warna untuk garis grafik
    const lineGradient = ctx.createLinearGradient(0, 0, width, 0);
    lineGradient.addColorStop(0, "#4caf50");
    lineGradient.addColorStop(1, "#2196f3");

    // Gambar grafik harga dengan gradasi warna
    ctx.strokeStyle = lineGradient;
    ctx.lineWidth = 2;
    ctx.beginPath();
    prices.forEach((price, i) => {
        let x = (i / (prices.length - 1)) * (width - 50) + 40;
        let y = height - 30 - normalize(price);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Menambahkan titik di setiap harga
    ctx.fillStyle = "#ff4081";
    prices.forEach((price, i) => {
        let x = (i / (prices.length - 1)) * (width - 50) + 40;
        let y = height - 30 - normalize(price);
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
    });

    // Menambahkan label harga pada grafik
    ctx.fillStyle = "#333";
    ctx.font = "12px Arial";
    prices.forEach((price, i) => {
        let x = (i / (prices.length - 1)) * (width - 50) + 40;
        let y = height - 30 - normalize(price);
        ctx.fillText(price.toLocaleString(), x - 15, y - 10);
    });

    // Label sumbu X dan Y
    ctx.fillStyle = "#333";
    ctx.font = "14px Arial";
    ctx.fillText("Harga", 5, 20); // Label sumbu Y
    ctx.fillText("Waktu", width / 2, height - 5); // Label sumbu X

    // Menambahkan label harga maksimum dan minimum
    ctx.fillText(maxPrice.toLocaleString(), 5, 30);
    ctx.fillText(minPrice.toLocaleString(), 5, height - 40);

    return canvas.toBuffer();
}

const handler = async (m, { conn, command, args }) => {
    let sender = m.sender;
    let user = global.db.data.users[sender];

    if (!user) return m.reply("⚠️ Data pengguna tidak ditemukan!");

    if (command === "investasi") {
        let currentPrice = data.harga[data.harga.length - 1];
        let imgBuffer = generateChart();

        await conn.sendMessage(m.chat, {
            image: imgBuffer,
            caption: `📈 **Harga Saham Saat Ini:** ${currentPrice.toLocaleString()} IDR\n\n💰 *Perintah:*\n- *.beliinvest <jumlah>* (Beli saham)\n- *.jualinvest <jumlah>* (Jual saham)\n- *.ambilinvest* (Tarik keuntungan)\n- *.historyinvest* (Lihat histori harga)`,
        });
    }

    if (command === "beliinvest") {
        let jumlah = parseInt(args[0]);
        if (isNaN(jumlah) || jumlah <= 0) return m.reply("⚠️ Masukkan jumlah saham yang ingin dibeli!");

        let currentPrice = data.harga[data.harga.length - 1];
        let totalHarga = jumlah * currentPrice;

        if (totalHarga > 10000000) return m.reply(`❌ Maksimal pembelian hanya 10.000.000 IDR per transaksi!`);
        if (user.money < totalHarga) return m.reply(`❌ Uang kamu kurang! (Dibutuhkan: ${totalHarga.toLocaleString()} IDR)`);

        user.money -= totalHarga;
        data.investor[sender] = (data.investor[sender] || 0) + jumlah;
        
        // Simpan waktu pembelian investasi untuk cooldown
        user.investCooldown = Date.now() + 10 * 60 * 1000; // 10 menit ke depan
        saveData();

        m.reply(`✅ Kamu telah membeli ${jumlah} saham dengan harga ${currentPrice.toLocaleString()} IDR per saham!\n⏳ Kamu harus menunggu **10 menit** sebelum bisa mengambil keuntungan.`);
    }

    if (command === "jualinvest") {
        let jumlah = parseInt(args[0]);
        if (isNaN(jumlah) || jumlah <= 0) return m.reply("⚠️ Masukkan jumlah saham yang ingin dijual!");

        let sahamUser = data.investor[sender] || 0;
        if (jumlah > sahamUser) return m.reply("❌ Kamu tidak memiliki saham sebanyak itu!");

        let currentPrice = data.harga[data.harga.length - 1];
        let totalJual = jumlah * currentPrice;

        if (totalJual > 10000000) return m.reply(`❌ Maksimal penjualan hanya 10.000.000 IDR per transaksi!`);

        user.money += totalJual;
        data.investor[sender] -= jumlah;
        if (data.investor[sender] <= 0) delete data.investor[sender];
        saveData();

        m.reply(`✅ Kamu telah menjual ${jumlah} saham dengan harga ${currentPrice.toLocaleString()} IDR per saham!`);
    }

    if (command === "ambilinvest") {
        let now = Date.now();
        
        // Cek cooldown
        if (user.investCooldown && now < user.investCooldown) {
            let remaining = Math.ceil((user.investCooldown - now) / 60000);
            return m.reply(`⏳ Kamu harus menunggu **${remaining} menit** lagi sebelum bisa mengambil keuntungan.`);
        }

        let keuntungan = data.investor[sender] ? data.investor[sender] * 500 : 0;
        if (keuntungan === 0) return m.reply("⚠️ Kamu tidak memiliki keuntungan yang bisa ditarik!");

        user.money += keuntungan;
        let totalMoney = user.money.toLocaleString(); // Total uang setelah menarik keuntungan
        data.investor[sender] = 0;
        
        saveData();

        m.reply(`✅ Kamu telah menarik keuntungan sebesar ${keuntungan.toLocaleString()} IDR!\n💰 **Total Uang Sekarang:** ${totalMoney} IDR`);
    }
};

handler.command = /^(investasi|beliinvest|jualinvest|ambilinvest|historyinvest)$/i;
handler.tags = ["rpg"];
handler.help = ["investasi", "beliinvest <jumlah>", "jualinvest <jumlah>", "ambilinvest", "historyinvest"];

export default handler;