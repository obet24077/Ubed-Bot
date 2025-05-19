import { createCanvas, loadImage, registerFont } from 'canvas';
import fs from 'fs';

registerFont('./src/font/Roboto-Regular.ttf', { family: 'Roboto' });
registerFont('./src/font/digital-7-mono.ttf', { family: 'Digital' });

let handler = async (m, { conn, args, text }) => {
    let idGroup = m.chat;

    if (args[0]) {
        let linkRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i;
        let match = args[0].match(linkRegex);
        if (!match) throw 'Link grup tidak valid!';
        let code = match[1];
        try {
            idGroup = await conn.groupAcceptInvite(code);
        } catch (e) {
            throw 'Gagal mengambil ID grup dari link. Pastikan link aktif dan bot tidak diblokir.';
        }
    }

    if (!global.db.data.chats[idGroup] || global.db.data.chats[idGroup].expired < 1)
        throw 'Grup ini tidak memiliki pengaturan sewa.';

    let now = new Date().getTime();
    let expiredTimestamp = global.db.data.chats[idGroup].expired;
    let remainingTime = expiredTimestamp - now;
    let timeLeft = msToTime(remainingTime);

    let expiredDate = new Date(expiredTimestamp).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    const backgroundImage = await loadImage('https://files.catbox.moe/09pd4h.jpeg');
    const canvas = createCanvas(1365, 768);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    ctx.font = '100px Digital';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    let timeText = `${padZero(timeLeft.days)} : ${padZero(timeLeft.hours)} : ${padZero(timeLeft.minutes)}`;
    ctx.fillText(timeText, canvas.width / 2, 400);

    ctx.font = '30px Roboto';
    ctx.fillText('DAYS', canvas.width / 2 - 225, 460);
    ctx.fillText('HOURS', canvas.width / 2, 460);
    ctx.fillText('MINUTES', canvas.width / 2 + 230, 460);

    const marginRight = 80;
    const yPos = 520;
    ctx.font = '25px Roboto';
    ctx.textAlign = 'right';
    ctx.fillText(`Expired\n${expiredDate}`, canvas.width - marginRight, yPos);

    const buffer = canvas.toBuffer();
    fs.writeFileSync('./tmp/time.png', buffer);
    await conn.sendFile(m.chat, buffer, 'time.png', `Sewa berakhir pada ${expiredDate}.`, m);
};

function padZero(num) {
    return num < 10 ? '0' + num : num;
}

function msToTime(ms) {
    let days = Math.floor(ms / (24 * 60 * 60 * 1000));
    let hours = Math.floor((ms / (60 * 60 * 1000)) % 24);
    let minutes = Math.floor((ms / (60 * 1000)) % 60);
    return { days, hours, minutes };
}

handler.help = ['ceksewa [linkgc]'];
handler.tags = ['group'];
handler.command = /^(ceksewa)$/i;
handler.group = false; // bisa diakses dari chat pribadi juga

export default handler;