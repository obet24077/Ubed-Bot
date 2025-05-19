import { createHash } from 'crypto';
import fetch from 'node-fetch';
import moment from 'moment-timezone';
import { createCanvas } from 'canvas';
import fs from 'fs';

let handler = async function (m, { text, usedPrefix, command }) {
    function pickRandom(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    function randomAge(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function generateVerificationCode() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += characters[Math.floor(Math.random() * characters.length)];
        }
        return code;
    }

    async function drawVerificationCode(code) {
        const canvas = createCanvas(200, 80);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = '30px Arial';
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(code, canvas.width / 2, canvas.height / 2);
        return canvas.toBuffer();
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
    if (!text) throw `Ketik yang benar!\nContoh: ${usedPrefix}daftar2 Ponta\nContoh: ${usedPrefix}daftar2 Ponta.20`;

    let [name, ageText] = text.split('.');
    if (!name) throw 'Nama tidak boleh kosong';

    let age = parseInt(ageText);
    if (!age || age <= 0) age = randomAge(18, 50);

    const verificationCode = generateVerificationCode();
    const verificationImage = await drawVerificationCode(verificationCode);

    global.verification = global.verification || {};
    global.verification[m.sender] = {
        code: verificationCode,
        name: name.trim(),
        age: age,
        time: +new Date(),
        attempts: 0,
    };

    await conn.sendMessage(m.chat, {
        image: verificationImage,
        caption: `Silakan balas (reply) gambar ini dengan kode verifikasi yang sesuai.\nKode berlaku selama 5 menit.`,
    }, { quoted: m });
};

handler.help = ['daftar2'];
handler.tags = ['main', 'users'];
handler.command = /^(daftar2|registrasi2)$/i;

export default handler;

handler.before = async (m, { usedPrefix, command }) => {
    if (m.isBaileys) return;
    if (!m.quoted || !m.quoted.fileSha256) return false;

    let user = global.db.data.users[m.sender];
    if (user.registered === true) return false;

    if (m.quoted) {
        let q = m.quoted;
        let mime = (q.msg || q).mimetype || '';
        if (!/image\/(jpe?g|png)/.test(mime)) return false;
        if (!q.fromMe) return false;
        if (!m.text) return false;
        if (!global.verification || !global.verification[m.sender]) {
            m.reply('Sesi pendaftaran Anda telah kadaluarsa. Silakan daftar ulang.');
            return true;
        }

        const { code, name, age, time, attempts } = global.verification[m.sender];
        const inputCode = m.text.trim();

        if (new Date() - time > 300000) {
            delete global.verification[m.sender];
            m.reply('Kode verifikasi telah kadaluarsa. Silakan daftar ulang.');
            return true;
        }

        if (inputCode !== code) {
            global.verification[m.sender].attempts++;
            if (global.verification[m.sender].attempts >= 3) {
                delete global.verification[m.sender];
                m.reply('Anda telah gagal 3 kali. Pendaftaran dibatalkan. Silakan daftar ulang.');
                return true;
            }
            m.reply(`Kode verifikasi salah. Silakan coba lagi. Percobaan ke-${global.verification[m.sender].attempts}/3`);
            return true;
        }

        user.name = name;
        user.age = age;
        user.regTime = +new Date();
        user.registered = true;
        let sn = createHash('md5').update(m.sender).digest('hex');

        delete global.verification[m.sender];

        try {
            let response = await fetch('https://telegra.ph/file/dda3ddb223ac28ef1f335.jpg');
            let buffer = await response.buffer();

            await conn.sendMessage(m.chat, {
                text: `╭─「 Status 」
│◉ Status: ✅ Successful
│◉ Nama: ${name}
│◉ Umur: ${age} tahun
╰────────────┈ ⳹
◉ Sn: https://pontaceksn.com/sn/${sn}

Jangan lupa baca rules ya kak...
Data user yang tersimpan di database bot dijamin aman tanpa tershare 📁\n*.allmenu [Menampilkan Semua Fitur]*

⻝ Date: ${week} ${date}
⻝ Time: ${wktuwib}
`,
                contextInfo: {
                    externalAdReply: {
                        title: "✅ Sukses Daftar ke Database",
                        body: 'Sekarang Kamu Bisa Menggunakan Fiturku',
                        thumbnail: buffer,
                        sourceUrl: "",
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: m });

        } catch (error) {
            m.reply("Pendaftaran berhasil, tetapi ada masalah saat mengirim pesan sukses. Silakan coba lagi nanti.");
        }

        return true;
    }
    return false;
};