import { createHash } from 'crypto';
import fetch from 'node-fetch';
import moment from 'moment-timezone';

let handler = async function (m, { text, usedPrefix, command }) {
    function pickRandom(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    function randomAge(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    let namanya = conn.getName(m.sender);
    let d = new Date(new Date() + 3600000);
    let locale = 'id';
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5];
    let week = d.toLocaleDateString(locale, { weekday: 'long' });
    let date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
    let wibh = moment.tz('Asia/Jakarta').format('HH');
    let wibm = moment.tz('Asia/Jakarta').format('mm');
    let wibs = moment.tz('Asia/Jakarta').format('ss');
    let wktuwib = `${wibh} H ${wibm} M ${wibs} S`;

    let user = global.db.data.users[m.sender];
    const pp = await conn.profilePictureUrl(m.sender, "image").catch((_) => "https://telegra.ph/file/ee60957d56941b8fdd221.jpg");

    if (user.registered === true) throw `Kamu sudah terdaftar\nMau daftar ulang? *${usedPrefix}unreg <nomer sn>*`;
    if (!text) throw `Ketik yang benar!\nContoh: ${usedPrefix}daftar Ponta\nContoh: ${usedPrefix}daftar Ponta.20`;

    let [name, ageText] = text.split('.');
    if (!name) throw 'Nama tidak boleh kosong';

    let age = parseInt(ageText);
    if (!age || age <= 0) age = randomAge(18, 50);

    user.name = name.trim();
    user.age = age;
    user.regTime = +new Date();
    user.registered = true;
    let sn = createHash('md5').update(m.sender).digest('hex');

    await conn.sendMessage(m.chat, {
        react: {
            text: "✅",
            key: m.key,
        }
    });

    let response = await fetch('https://files.catbox.moe/4tizh9.jpg');
    let buffer = await response.buffer();

    await conn.sendMessage(m.chat, {
        image: buffer,
        caption: `╭─「 Status 」
│◉ Status: ☑️ Successful
│◉ Nama: ${name}
│◉ Umur: ${age} tahun
╰────────────┈ ⳹
◉ Sn: ${sn}

Jangan lupa baca rules di deskripsi...
Data user yang tersimpan di database bot dijamin aman tanpa tershare 📁
*Ketuk tombol Menu untuk melihat menu*

⻝ Date: ${week} ${date}
⻝ Time: ${wktuwib}
`,
        footer: 'Selamat datang di Ubed Bot!',
        buttons: [
            {
                buttonId: '.menu',
                buttonText: { displayText: '🍏 Menu' },
                type: 1
            }
        ],
        headerType: 4
    }, { quoted: m });
};

handler.help = ['daftar'];
handler.tags = ['main', 'users'];
handler.command = /^(daftar|verify|reg(ister)?)$/i;

export default handler;