import fs from 'fs';

const victimDatabasePath = './database/victimDatabase.json';

function loadData(filePath) {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    }
    return {};
}

function saveData(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

const getUserName = (jid) => {
    const user = global.db.data.users?.[jid] || {};
    return user.name || jid.split('@')[0];
};

let handler = async (m, { text, mentionedJid }) => {
    // fallback kalau mentionedJid tidak tersedia
    const mention = mentionedJid && mentionedJid.length ? mentionedJid : m.mentionedJid || [];

    if (!mention.length) return m.reply('Tag siapa yang mau dikurangi jumlah death-nya.');

    const args = text.trim().split(' ');
    const amount = parseInt(args[args.length - 1]);
    const target = mention[0];

    if (isNaN(amount)) return m.reply('Contoh penggunaan: .delvictim @user 5');

    let victimDatabase = loadData(victimDatabasePath);

    if (!victimDatabase[target] || !victimDatabase[target].killed) {
        return m.reply(`☠️ *${getUserName(target)}* tidak memiliki catatan death.`);
    }

    if (victimDatabase[target].killed < amount) {
        return m.reply(`☠️ Jumlah death *${getUserName(target)}* kurang dari jumlah yang ingin dikurangi.`);
    }

    victimDatabase[target].killed -= amount;
    saveData(victimDatabasePath, victimDatabase);

    m.reply(`☠️ Jumlah death untuk *${getUserName(target)}* berhasil dikurangi *${amount}x*.\nTotal sekarang: *${victimDatabase[target].killed} death*`);
};

handler.help = ['delvictim @tag jumlah'];
handler.tags = ['owner'];
handler.command = /^delvictim$/i;
handler.owner = true;

export default handler;