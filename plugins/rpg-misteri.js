const armorNames = {
    6: "Dragonplate",
    7: "Celestial",
    8: "Stormbringer"
};

const swordNames = {
    6: "Shadowbane",
    7: "Stormbringer",
    8: "Excalibur"
};

const armorPrices = {
    6: 25000000,
    7: 30000000,
    8: 35000000
};

const swordPrices = {
    6: 30000000,
    7: 35000000,
    8: 40000000
};

const DURABILITY_VALUE = 150;

let handler = async (m, { conn, command, args, usedPrefix }) => {
    const now = new Date();
    const hour = now.getUTCHours();
    const day = now.getUTCDay();

    const isWithinTime = (day === 2 || day === 5 || day === 0) && hour >= 0 && hour < 20;

    if (!isWithinTime) {
        return conn.reply(m.chat, `⏰ Toko Misteri cuma buka jam 00:00 sampe 20:00 WIB di hari Jumat, Minggu, sama Selasa, Senpai!`, m);
    }

    const mysteryShopList = `
🎁 *Mystery Shop* 🎁
Pake perintah: \`${usedPrefix}mysteryshop <armor|sword>\` atau \`${usedPrefix}misterishop <armor|sword>\`

📌 *Contoh:* \`${usedPrefix}mysteryshop armor\`
*Catatan:* Harus punya Armor Netherite/Sword Netherite buat beli di sini!

============================

🛡️ *Armor Tersedia:*
1. ${armorNames[6]} - Rp${armorPrices[6].toLocaleString()}
2. ${armorNames[7]} - Rp${armorPrices[7].toLocaleString()}
3. ${armorNames[8]} - Rp${armorPrices[8].toLocaleString()}

============================

⚔️ *Pedang Tersedia:*
1. ${swordNames[6]} - Rp${swordPrices[6].toLocaleString()}
2. ${swordNames[7]} - Rp${swordPrices[7].toLocaleString()}
3. ${swordNames[8]} - Rp${swordPrices[8].toLocaleString()}
`.trim();

    try {
        if (!/mysteryshop|misterishop/i.test(command)) return;

        let itemType = args[0]?.toLowerCase();
        if (!itemType || (itemType !== 'armor' && itemType !== 'sword')) {
            return conn.reply(m.chat, mysteryShopList, m);
        }

        // Cek user data
        if (!global.db.data.users[m.sender]) {
            global.db.data.users[m.sender] = { eris: 0, armor: 0, sword: 0, armorDurability: 0, swordDurability: 0 };
        }

        let user = global.db.data.users[m.sender];

        if (itemType === 'armor') {
            let currentArmorLevel = user.armor || 0;

            // Cek minimal Armor Netherite (level 5)
            if (currentArmorLevel < 5) {
                return conn.reply(m.chat, `❌ Senpai harus punya Armor Netherite dulu buat beli di sini!`, m);
            }

            let nextArmorLevel = currentArmorLevel + 1;

            if (currentArmorLevel >= 8) {
                return conn.reply(m.chat, `⚠️ Senpai udah punya ${armorNames[8]}, ga bisa beli armor lagi nih!`, m);
            }

            if (!armorPrices[nextArmorLevel]) {
                return conn.reply(m.chat, `⚠️ Armor level ${nextArmorLevel} ga ada di toko, Senpai!`, m);
            }

            let buyingPrice = armorPrices[nextArmorLevel];
            if (user.eris < buyingPrice) {
                return conn.reply(m.chat, `❌ Duit Senpai kurang buat beli ${armorNames[nextArmorLevel]} (Rp${buyingPrice.toLocaleString()})!`, m);
            }

            // Proses pembelian
            user.eris -= buyingPrice;
            user.armor = nextArmorLevel;
            user.armorDurability = DURABILITY_VALUE;
            conn.reply(m.chat, `✅ Sukses beli ${armorNames[nextArmorLevel]} seharga Rp${buyingPrice.toLocaleString()}.\n🛡️ Durability: ${DURABILITY_VALUE}`, m);

        } else if (itemType === 'sword') {
            let currentSwordLevel = user.sword || 0;

            // Cek minimal Sword Netherite (level 5)
            if (currentSwordLevel < 5) {
                return conn.reply(m.chat, `❌ Senpai harus punya Sword Netherite dulu buat beli di sini!`, m);
            }

            let nextSwordLevel = currentSwordLevel + 1;

            if (currentSwordLevel >= 8) {
                return conn.reply(m.chat, `⚠️ Senpai udah punya ${swordNames[8]}, ga bisa beli pedang lagi nih!`, m);
            }

            if (!swordPrices[nextSwordLevel]) {
                return conn.reply(m.chat, `⚠️ Pedang level ${nextSwordLevel} ga ada di toko, Senpai!`, m);
            }

            let buyingPrice = swordPrices[nextSwordLevel];
            if (user.eris < buyingPrice) {
                return conn.reply(m.chat, `❌ Duit Senpai kurang buat beli ${swordNames[nextSwordLevel]} (Rp${buyingPrice.toLocaleString()})!`, m);
            }

            // Proses pembelian
            user.eris -= buyingPrice;
            user.sword = nextSwordLevel;
            user.swordDurability = DURABILITY_VALUE;
            conn.reply(m.chat, `✅ Sukses beli ${swordNames[nextSwordLevel]} seharga Rp${buyingPrice.toLocaleString()}.\n⚔️ Durability: ${DURABILITY_VALUE}`, m);
        }

    } catch (e) {
        console.error(e);
        conn.reply(m.chat, `⚠️ Ada error nih, Senpai! Coba lagi ya, atau lapor ke Ponta. Listnya: \n${mysteryShopList}`, m);
    }
};

handler.help = ['mysteryshop'];
handler.tags = ['rpg'];
handler.command = /^(mysteryshop|misterishop)$/i;
handler.limit = true;
handler.group = true;

export default handler;