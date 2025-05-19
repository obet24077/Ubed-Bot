import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
 m.reply(wait);
    let url = gensin[Math.floor(Math.random() * gensin.length)];
    conn.sendFile(m.chat, url, 'image.jpg', 'VIA QRIS', m, false, { thumbnail: await (await fetch(url)).buffer() });
}

handler.command = /^(qris)$/i;
handler.tags = ['info'];
handler.help = ['qris'];

export default handler;

global.gensin = [
    "https://telegra.ph/file/88767b05f15ab5800c357.jpg"
];