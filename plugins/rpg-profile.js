import fs from 'fs';
import axios from 'axios';

const handler = async (m, { conn }) => {
    global.db.data.users = global.db.data.users || {};

    const ubed = {
        key: {
            participant: '6285147777105@s.whatsapp.net',
            remoteJid: "6285147777105@s.whatsapp.net",
            fromMe: false,
            id: "Halo",
        },
        message: {
            conversation: m.text
        }
    };

    let target;
    if (m.mentionedJid && m.mentionedJid.length > 0) {
        target = m.mentionedJid[0];
    } else if (m.quoted && m.quoted.sender) {
        target = m.quoted.sender;
    } else {
        target = m.sender;
    }

    if (!global.db.data.users[target]) {
        global.db.data.users[target] = {};
    }
    let user = global.db.data.users[target];

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
            const { data } = await axios.get(foto, { responseType: 'arraybuffer' });
            imageBuffer = Buffer.from(data);
        } else {
            try {
                const pp = await conn.profilePictureUrl(target, 'image');
                const { data } = await axios.get(pp, { responseType: 'arraybuffer' });
                imageBuffer = Buffer.from(data);
            } catch (e) {
                imageBuffer = fs.readFileSync('./media/ubedbot.jpg');
            }
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

    // Kirim sebagai image + caption + tombol edit
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
        footer: botName
    }, { quoted: m });
};

handler.command = ["profile", "me"];
handler.help = ["profile [@tag]"];
handler.tags = ["main"];

export default handler;