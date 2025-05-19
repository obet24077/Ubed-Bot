import fs from 'fs';
import axios from 'axios';

const handler = async (m, { conn, args }) => {
    global.db.data.users = global.db.data.users || {};

    // Tentukan target, kalau tidak ada mention atau quoted, gunakan pengirim
    let target = m.sender;

    let user = global.db.data.users[target] || {};

    user.name = user.name || conn.getName(target) || "User";
    user.umur = user.umur || "-";
    user.ttl = user.ttl || "-";
    user.foto = user.foto || null;
    user.jk = user.jk || "-";
    user.agama = user.agama || "-";
    user.hobi = user.hobi || "-";
    user.kota = user.kota || "-";
    user.negara = user.negara || "-";
    user.level = user.level || 1;
    user.money = user.money || 0;
    user.bank = user.bank || 0;
    user.exp = user.exp || 0;
    user.premium = user.premium || false;
    user.limit = user.limit || 10;
    user.pacar = user.pacar || "-";
    user.pernikahan = user.pernikahan || "Tidak Menikah";
    user.jumlahAnak = user.jumlahAnak || 0;
    user.sahabat = user.sahabat || "-";
    user.channel = user.channel || "-";
    user.facebook = user.facebook || "-";
    user.instagram = user.instagram || "-";
    user.tiktok = user.tiktok || "-";

    let {
        name, umur, ttl, foto, jk, agama, hobi, kota, negara,
        level, money, bank, exp, premium, pacar, pernikahan,
        jumlahAnak, sahabat, channel, facebook, instagram, tiktok
    } = user;
    let limit = premium ? "♾️ Unlimited" : user.limit;

    let botName = global.info?.namebot || "© Ubed Bot 2025";
    let mode = global.opts?.self ? "🔒 Self" : "🌍 Public";

    let uptime = process.uptime();
    let d = new Date();
    let date = d.toLocaleDateString("id-ID", {
        weekday: "long", year: "numeric", month: "long", day: "numeric"
    });
    let time = d.toLocaleTimeString("id-ID");

    let imageBuffer;
    try {
        if (foto) {
            let { data } = await axios.get(foto, { responseType: 'arraybuffer' });
            imageBuffer = data;
        } else {
            let pp = await conn.profilePictureUrl(target, 'image');
            let { data } = await axios.get(pp, { responseType: 'arraybuffer' });
            imageBuffer = data;
        }
    } catch (e) {
        imageBuffer = fs.readFileSync('./media/ubedbot.jpg');
    }

    let caption = `*──「 👤 PROFILE 」──*\n\n`;
    caption += `📝 *Nama:* ${name}\n`;
    caption += `🎂 *Umur:* ${umur}\n`;
    caption += `📅 *Tanggal Lahir:* ${ttl}\n`;
    caption += `⚧️ *Jenis Kelamin:* ${jk}\n`;
    caption += `🛐 *Agama:* ${agama}\n`;
    caption += `🎨 *Hobi:* ${hobi}\n`;
    caption += `🌆 *Kota:* ${kota}\n`;
    caption += `🌍 *Negara:* ${negara}\n`;
    caption += `⭐ *Level:* ${level}\n`;
    caption += `🎯 *Limit:* ${limit}\n`;
    caption += `💸 *Saldo:* Rp ${money.toLocaleString('id-ID')}\n`;
    caption += `🏦 *Bank:* Rp ${bank.toLocaleString('id-ID')}\n`;
    caption += `⚡ *Exp:* ${exp}\n`;
    caption += `🎫 *Premium:* ${premium ? '✅ Ya' : '❌ Tidak'}\n`;
    caption += `💑 *Pacar:* ${pacar}\n`;
    caption += `💍 *Status Pernikahan:* ${pernikahan}\n`;
    caption += `👶 *Jumlah Anak:* ${jumlahAnak}\n`;
    caption += `👯‍♂️ *Sahabat:* ${sahabat}\n`;
    caption += `📺 *Channel:* ${channel}\n`;
    caption += `📱 *Facebook:* ${facebook}\n`;
    caption += `📸 *Instagram:* ${instagram}\n`;
    caption += `🎵 *TikTok:* ${tiktok}\n\n`;

    caption += `*──「 📊 BOT STATS 」──*\n`;
    caption += `🤖 *Bot:* ${botName}\n`;
    caption += `🛠️ *Mode:* ${mode}\n`;
    caption += `⏱️ *Uptime:* ${Math.floor(uptime / 3600)}J ${Math.floor((uptime % 3600) / 60)}M ${Math.floor(uptime % 60)}D\n`;
    caption += `📆 *Tanggal:* ${date}\n`;
    caption += `⏰ *Waktu:* ${time}\n`;

    // Kirim sebagai image + caption + tombol edit (tanpa reply atau mention)
    await conn.sendMessage(m.chat, {
        image: imageBuffer,
        caption: caption,
        buttons: [
            {
                buttonId: '.editprofile',
                buttonText: { displayText: '✏️ Edit Profile' },
                type: 1
            }
        ],
        footer: botName,
        contextInfo: {
            mentionedJid: []  // Pastikan tidak ada mention
        }
    }, { quoted: m });
};

handler.command = ["aku", "saya"];
handler.help = ["aku [@tag]"];
handler.tags = ["main"];

export default handler;