/*
- PLUGINS HYTAMKAN (penghytaman waifu🐧)
- Thanks penyedia api
- Source: https://whatsapp.com/channel/0029VakezCJDp2Q68C61RH2C
*/
//const fetch = require('node-fetch');
//const uploadImage = require('../lib/uploadImage.js');
import fetch from 'node-fetch';
import uploadImage from '../lib/uploadImage.js';

let handler = async (m, { conn }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    if (!mime) throw 'Silakan kirim atau reply gambar dengan caption *.hytamkan*';

    m.reply('Proses penghytaman...');

    let media = await q.download();
    let url = await uploadImage(media);
    if (!url) throw 'Gagal mengunggah gambar. Coba lagi nanti.';

    let res = await fetch(`https://api.hiuraa.my.id/ai/gemini-canvas?text=change+skin+color+to+black&imageUrl=${encodeURIComponent(url)}`);
    if (!res.ok) throw 'Gagal mengedit gambar. Coba lagi nanti.';

    let json = await res.json();
    if (!json?.result?.image?.base64) throw 'Gagal mendapatkan gambar dari API.';

    let hasilBuffer = Buffer.from(json.result.image.base64, 'base64');
    await conn.sendFile(m.chat, hasilBuffer, 'hytam.jpg', 'Nih waifumu jadi hitam!', m);
};

handler.help = ['hytamkan'];
handler.tags = ['tools', 'anime'];
handler.command = /^hytamkan$/i;
handler.register = true;
handler.limit = true;

export default handler;
//module.exports = handler;