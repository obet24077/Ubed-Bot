import fs from 'fs';

const killerDatabasePath = './database/killerDatabase.json';

function loadData(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error(`Gagal memuat data dari ${filePath}:`, error);
    }
    return {};
}

function saveData(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(`Gagal menyimpan data ke ${filePath}:`, error);
    }
}

const getUserName = (jid) => {
    const user = global.db.data.users?.[jid] || {};
    return user.name || jid.split('@')[0];
};

let handler = async (m, { conn, isOwner, isAdmin }) => {
    if (!isOwner && !isAdmin) return m.reply("Fitur ini hanya untuk owner atau admin bot!");

    if (!m.mentionedJid || m.mentionedJid.length === 0) return m.reply('Tag user yang ingin dihapus cooldown-nya!');

    const target = m.mentionedJid[0];
    let killerDatabase = loadData(killerDatabasePath);

    if (!killerDatabase[target]) return m.reply("Data kill untuk user tersebut tidak ditemukan.");

    killerDatabase[target].lastKill = 0;
    saveData(killerDatabasePath, killerDatabase);

    m.reply(`✅ Cooldown kill milik *${getUserName(target)}* berhasil dihapus!`);
};

handler.help = ['delcd', 'delcooldown'];
handler.tags = ['owner', 'tools'];
handler.command = /^(delcd|delcooldown)$/i;
handler.owner = true; // hanya untuk owner, kamu bisa ganti jadi `admin: true` kalau ingin admin grup juga bisa

export default handler;