import fs from 'fs';

// Path database
const ffDatabasePath = './database/ffDatabase.json';

// Baca database langsung
let ffDatabase = fs.existsSync(ffDatabasePath) ? JSON.parse(fs.readFileSync(ffDatabasePath)) : { players: {}, lobby: [] };

// Fungsi untuk mendapatkan nama pengguna
const getUserName = (jid) => {
    const user = global.db.data.users[jid] || {};
    return user.name || jid.split('@')[0];
};

// **Daftar Senjata**
const weapons = [
    { name: 'MP40', damage: 20 },
    { name: 'AK47', damage: 30 },
    { name: 'M1014', damage: 40 },
    { name: 'AWM', damage: 50 },
    { name: 'SCAR', damage: 25 }
];

// **Daftar Item**
const items = [
    { name: 'Medkit', heal: 30 },
    { name: 'Vest Lv.3', defense: 20 },
    { name: 'Helmet Lv.3', defense: 15 }
];

let handler = async (m, { conn, args, usedPrefix }) => {
    let command = args[0] || '';

    switch (command.toLowerCase()) {
        case 'createff': // Membuat akun FF
            if (ffDatabase.players[m.sender]) return m.reply("⚠️ Kamu sudah memiliki akun Free Fire RPG!");

            ffDatabase.players[m.sender] = {
                name: getUserName(m.sender),
                health: 100,
                kills: 0,
                weapons: [],
                items: []
            };
            fs.writeFileSync(ffDatabasePath, JSON.stringify(ffDatabase, null, 2));

            m.reply(`✅ *Akun Free Fire RPG berhasil dibuat!*\n🎮 Nama: *${getUserName(m.sender)}*\n❤️ HP: 100\n🔫 Senjata: Kosong\n🎒 Item: Kosong`);
            break;

        case 'joinff': // Bergabung ke dalam permainan
            if (!ffDatabase.players[m.sender]) return m.reply(`⚠️ Kamu belum memiliki akun! Gunakan \`${usedPrefix}createff\` untuk membuat akun.`);
            if (ffDatabase.lobby.includes(m.sender)) return m.reply("⚠️ Kamu sudah berada di lobby!");
            if (ffDatabase.lobby.length >= 15) return m.reply("❌ Lobby sudah penuh (maksimal 15 pemain).");

            ffDatabase.lobby.push(m.sender);
            fs.writeFileSync(ffDatabasePath, JSON.stringify(ffDatabase, null, 2));
            m.reply(`✅ *${getUserName(m.sender)}* bergabung ke dalam lobby!\n👥 Total pemain: ${ffDatabase.lobby.length}/15`);
            break;

        case 'exitff': // Keluar dari lobby
            if (!ffDatabase.lobby.includes(m.sender)) return m.reply("⚠️ Kamu belum berada di lobby!");
            ffDatabase.lobby = ffDatabase.lobby.filter(player => player !== m.sender);
            fs.writeFileSync(ffDatabasePath, JSON.stringify(ffDatabase, null, 2));
            m.reply(`🚪 *${getUserName(m.sender)}* keluar dari lobby.\n👥 Sisa pemain: ${ffDatabase.lobby.length}`);
            break;

        case 'startff': // Memulai permainan
            if (ffDatabase.lobby.length < 2) return m.reply("⚠️ Minimal 2 pemain dibutuhkan untuk memulai permainan!");

            // Inisialisasi game
            ffDatabase.lobby.forEach(player => {
                ffDatabase.players[player].health = 100;
                ffDatabase.players[player].kills = 0;
                ffDatabase.players[player].weapons = [];
                ffDatabase.players[player].items = [];
            });

            ffDatabase.lobby = [];
            fs.writeFileSync(ffDatabasePath, JSON.stringify(ffDatabase, null, 2));
            m.reply(`🎮 *Game Free Fire RPG Dimulai!*\n🔫 Gunakan \`${usedPrefix}lootff\` untuk mencari senjata!`);
            break;

        case 'lootff': // Mencari senjata atau item
            if (!ffDatabase.players[m.sender]) return m.reply(`⚠️ Kamu belum memiliki akun! Gunakan \`${usedPrefix}createff\` untuk membuat akun.`);

            let lootChance = Math.random();
            if (lootChance < 0.5) {
                let weapon = weapons[Math.floor(Math.random() * weapons.length)];
                ffDatabase.players[m.sender].weapons.push(weapon);
                fs.writeFileSync(ffDatabasePath, JSON.stringify(ffDatabase, null, 2));
                m.reply(`🎯 Kamu menemukan senjata *${weapon.name}* (Damage: ${weapon.damage})!`);
            } else {
                let item = items[Math.floor(Math.random() * items.length)];
                ffDatabase.players[m.sender].items.push(item);
                fs.writeFileSync(ffDatabasePath, JSON.stringify(ffDatabase, null, 2));
                m.reply(`🎒 Kamu mendapatkan *${item.name}*!`);
            }
            break;

        case 'attackff': // Menyerang pemain lain
            if (!ffDatabase.players[m.sender]) return m.reply(`⚠️ Kamu belum memiliki akun! Gunakan \`${usedPrefix}createff\` untuk membuat akun.`);
            if (!m.mentionedJid || m.mentionedJid.length === 0) return m.reply('Tag lawan yang ingin kamu serang!');

            const target = m.mentionedJid[0];
            if (!ffDatabase.players[target]) return m.reply("⚠️ Target belum masuk ke dalam permainan!");

            let attackerWeapon = ffDatabase.players[m.sender].weapons.length > 0
                ? ffDatabase.players[m.sender].weapons[Math.floor(Math.random() * ffDatabase.players[m.sender].weapons.length)]
                : { name: 'Tangan Kosong', damage: 5 };

            ffDatabase.players[target].health -= attackerWeapon.damage;

            if (ffDatabase.players[target].health <= 0) {
                ffDatabase.players[m.sender].kills += 1;
                delete ffDatabase.players[target];
                fs.writeFileSync(ffDatabasePath, JSON.stringify(ffDatabase, null, 2));

                return m.reply(`💥 *${getUserName(target)} telah mati!*\n🔥 *${getUserName(m.sender)}* berhasil membunuh dengan *${attackerWeapon.name}*!\n🏆 Total Kill: ${ffDatabase.players[m.sender].kills}`);
            }

            fs.writeFileSync(ffDatabasePath, JSON.stringify(ffDatabase, null, 2));
            m.reply(`🔫 *${getUserName(m.sender)}* menyerang *${getUserName(target)}* dengan *${attackerWeapon.name}*! 🎯\n(Sisa HP *${getUserName(target)}*: ${ffDatabase.players[target].health})`);
            break;

        case 'profilff':
            if (!ffDatabase.players[m.sender]) return m.reply(`⚠️ Kamu belum memiliki akun! Gunakan \`${usedPrefix}createff\` untuk membuat akun.`);
            let userProfile = ffDatabase.players[m.sender];
            m.reply(`📜 *Profil Free Fire RPG*\n💀 Kill: ${userProfile.kills}\n❤️ HP: ${userProfile.health}\n🔫 Senjata: ${userProfile.weapons.map(w => w.name).join(', ') || 'Kosong'}\n🎒 Item: ${userProfile.items.map(i => i.name).join(', ') || 'Kosong'}`);
            break;

        case 'booyah': // Memenangkan permainan jika hanya tersisa satu pemain
            if (!ffDatabase.players[m.sender]) return m.reply(`⚠️ Kamu belum memiliki akun! Gunakan \`${usedPrefix}createff\` untuk membuat akun.`);
            if (Object.keys(ffDatabase.players).length > 1) return m.reply("⚠️ Masih ada pemain lain di dalam game! Habisi mereka dulu!");

            m.reply(`🎉💥 *BOOYAH!* 🎉💥\n🔥 *${getUserName(m.sender)}* berdiri sebagai **RAJA MEDAN PERANG**!\n💀 Total Kill: ${ffDatabase.players[m.sender].kills}\n🏆 Kamu mendapatkan hadiah spesial!`);
            delete ffDatabase.players[m.sender]; 
            fs.writeFileSync(ffDatabasePath, JSON.stringify(ffDatabase, null, 2));
            break;
    }
};

handler.command = /^(createff|joinff|exitff|startff|lootff|attackff|profilff|booyahff)$/i;
export default handler;