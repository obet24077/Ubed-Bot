import { randomInt } from 'crypto';

const cooldownTime = 25 * 60 * 1000; // 25 menit
let isExplorationInProgress = {}; // Melacak status eksplorasi pengguna

let handler = async (m, { conn }) => {
    global.db = global.db || {};
    global.db.data = global.db.data || {};
    global.db.data.users = global.db.data.users || {};

    let user = global.db.data.users[m.sender] = global.db.data.users[m.sender] || {};
    let lastAstronot = user.lastAstronot || 0;

    // Cek apakah eksplorasi sebelumnya belum selesai
    if (isExplorationInProgress[m.sender]) {
        return m.reply('🚀 Kamu belum selesai menjelajah luar angkasa. Tunggu hingga hasil eksplorasi dikirim!');
    }

    // Cek cooldown
    if (Date.now() - lastAstronot < cooldownTime) {
        let remaining = Math.floor((cooldownTime - (Date.now() - lastAstronot)) / 60000);
        return m.reply(`⏳ Tunggu ${remaining} menit sebelum perjalanan berikutnya.`);
    }

    if (user.aerozine < 20) {
        return m.reply('⛽ Kamu butuh minimal 20 Aerozine untuk memulai perjalanan.\n🛒 Beli terlebih dahulu dengan cara *.shop buy aerozine 20*');
    }

    m.reply('🚀 Perjalanan kamu dimulai!');
    isExplorationInProgress[m.sender] = true; // Tandai eksplorasi sedang berlangsung

    setTimeout(async () => {
        let chance = Math.random(); // Kemungkinan menemukan benda luar angkasa
        if (chance <= 0.45) {
            m.reply('⛔ Kamu menemukan benda luar angkasa!\nSegera ketik "tembak" dalam 1 menit atau kamu akan menabrak!');
            
            setTimeout(() => {
                if (isExplorationInProgress[m.sender]) {
                    m.reply('💥 Kamu menabrak benda luar angkasa! Hadiahmu dikurangi sebagai penalti.');
                    calculateReward(user, m, conn, true); // Penalti
                    delete isExplorationInProgress[m.sender]; // Reset status eksplorasi
                }
            }, 60000); // 1 menit timeout
        } else {
            calculateReward(user, m, conn, false); // Tidak menemukan, lanjutkan perjalanan biasa
            delete isExplorationInProgress[m.sender]; // Tandai eksplorasi selesai
        }
    }, 3000);
};

// Fungsi untuk menghitung hadiah eksplorasi
function calculateReward(user, m, conn, crashed) {
    let planets = [
        'Mars', 'Bulan', 'Neptunus', 'Jupiter', 'Saturnus', 'Venus', 'Merkurius', 'Uranus', 'Pluto', 'Europa', 'Titan',
        'Ganymede', 'Callisto', 'Io', 'Rhea', 'Enceladus', 'Mimas', 'Dione', 'Iapetus', 'Oberon', 'Miranda', 'Triton',
        'Proteus', 'Nereid', 'Charon', 'Makemake', 'Haumea', 'Eris', 'Sedna', 'Ceres', 'Vesta', 'Pallas', 'Hygeia'
    ];
    let exploredPlanets = planets.sort(() => 0.5 - Math.random()).slice(0, 3);

    let randomMoney = randomInt(100000, 2000000); // Pendapatan antara 100k - 2 juta
    let randomExp = randomInt(1000, 100000);
    let randomPotion = randomInt(5, 15);
    let randomCoal = randomInt(10, 300);
    let randomIron = randomInt(10, 150);
    let randomAerozine = randomInt(1, 20); // Pengurangan bahan bakar antara 1 - 20

    if (crashed) {
        randomMoney = 100000; // Penalti
        randomPotion = 1;
        randomCoal = 1; 
        randomIron = 1;
    }

    user.eris = (user.eris || 0) + randomMoney;
    user.exp = (user.exp || 0) + randomExp;
    user.potion = (user.potion || 0) + randomPotion;
    user.coal = (user.coal || 0) + randomCoal;
    user.iron = (user.iron || 0) + randomIron;
    user.aerozine = (user.aerozine || 0) - randomAerozine;

    let resultMessage = `
🚀 @${m.sender.split('@')[0]} telah menjelajahi luar angkasa:

🌎 Planet yang dieksplorasi:
- ${exploredPlanets.join('\n- ')}

🛍 Hasil eksplorasi:
- Money:   Rp.${randomMoney.toLocaleString()}
- Exp:   ${randomExp.toLocaleString()}
- Potion:   ${randomPotion}
- Coal:   ${randomCoal}
- Iron:   ${randomIron}

⛽ Aerozine yang digunakan:   ${randomAerozine}
    `.trim();

    conn.reply(m.chat, resultMessage, floc);
    user.lastAstronot = Date.now();
    delete isExplorationInProgress[m.sender]; // Tandai eksplorasi selesai

    setTimeout(() => {
        conn.reply(m.chat, `✨ Ayo @${m.sender.split('@')[0]} menjelajahi planet-planet lagi!`, m);
    }, 1500000);
}

handler.help = ['astronot'];
handler.tags = ['rpg'];
handler.command = /^(astronot)$/i;
handler.limit = 5;
handler.register = true;
handler.group = true;

export default handler;