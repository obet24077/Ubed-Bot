const airdrops = [
    { type: 'Common', limit: 1, eris: 50_000, potion: 5, weight: 50 },
    { type: 'Uncommon', limit: 5, eris: 100_000, potion: 10, weight: 30 },
    { type: 'Rare', limit: 15, eris: 500_000, potion: 30, weight: 15 },
    { type: 'Epic', limit: 25, eris: 1_000_000, potion: 50, weight: 4 },
    { type: 'Legendary', limit: 100, eris: 2_000_000, potion: 75, weight: 1 },
    { type: 'Special', limit: 120, eris: 3_000_000, potion: 100, weight: 0.5 },
    { type: 'Mythic', limit: 1_000, eris: 5_000_000, potion: 1_000, weight: 0.1 }
];

const millisecondsPerDay = 15 * 60 * 1000; // 15 minutes in milliseconds

let handler = async (m) => {
    try {
        let user = global.db.data.users[m.sender];

        if (!user) {
            throw 'Pengguna tidak ada di dalam database';
        }

        const currentTime = new Date().getTime();
        if (user.lastAirdrop && (currentTime - user.lastAirdrop) < millisecondsPerDay) {
            const remainingTime = millisecondsPerDay - (currentTime - user.lastAirdrop);

            // Calculate remaining hours, minutes, and seconds
            const remainingMinutes = Math.floor(remainingTime / (60 * 1000));
            const remainingSeconds = Math.floor((remainingTime % (60 * 1000)) / 1000);

            // Format remaining time as hh:mm:ss
            const formattedTime = `${String(remainingMinutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;

            return m.reply(`Kamu sudah mengambil airdrop. Tunggu ${formattedTime} lagi.`);
        }

        const airdrop = getRandomAirdrop();
        const formattedLimit = airdrop.limit.toLocaleString();
        const formattederis = airdrop.eris.toLocaleString();
        const formattedPotion = airdrop.potion.toLocaleString();

        user.limit = (user.limit || 0) + airdrop.limit;
        user.eris = (user.eris || 0) + airdrop.eris;
        user.potion = (user.potion || 0) + airdrop.potion;

        user.lastAirdrop = currentTime;
        global.db.data.users[m.sender] = user;

        const message = `*Airdrop ${airdrop.type}!* Kamu mendapatkan Kotak Airdrop *${airdrop.type}*\n\nSelamat kamu mendapatkan *Rewards*:
- *Limit:* ${formattedLimit}
- *Money:* ${formattederis}
- *Potion:* ${formattedPotion}`;

        await conn.sendMessage(m.chat, {
            text: message,
            contextInfo: {
                externalAdReply: {
                    title: "🎁 - A I R D R O P",
                    body: '',
                    thumbnailUrl: 'https://telegra.ph/file/86b8216626a3e25a8fc68.jpg',
                    sourceUrl: global.sgc,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: m });

        setTimeout(() => {
            m.reply('Waktunya ambil airdrop lagi.');
        }, millisecondsPerDay);

    } catch (error) {
        console.error(`Error in .airdrop command: ${error}`);
        m.reply('Terjadi kesalahan saat memproses perintah. Silakan coba lagi.');
    }
}

handler.help = ['airdrop'];
handler.tags = ['rpg'];
handler.command = /^airdrop$/i;
handler.register = true;
handler.group = true;

function getRandomAirdrop() {
    const totalWeight = airdrops.reduce((sum, airdrop) => sum + airdrop.weight, 0);
    let random = Math.random() * totalWeight;
    for (const airdrop of airdrops) {
        if (random < airdrop.weight) {
            return airdrop;
        }
        random -= airdrop.weight;
    }
}

export default handler;