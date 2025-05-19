import { sticker } from '../lib/sticker.js'
import axios from 'axios'

const handler = async (m, { conn, args }) => {
    let text;
    if (args.length >= 1) {
        text = args.slice(0).join(" ");
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text;
    } else throw "Input teks atau reply teks yang ingin dijadikan quote!";
    if (!text) return m.reply('masukan text');
    if (text.length > 999999999999999999999999999999) return m.reply('Maksimal 100 Teks!');

    const randomColor = ['#FFFFFF']; // Changed to white

    const apiColor = randomColor[Math.floor(Math.random() * randomColor.length)];

    const pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://telegra.ph/file/320b066dc81928b782c7b.png');

    const obj = {
        "type": "quote",
        "format": "png",
        "backgroundColor": apiColor, // White background
        "width": 512,
        "height": 768,
        "scale": 2,
        "messages": [{
            "entities": [],
            "avatar": true,
            "from": {
                "id": 1,
                "name": m.name,
                "photo": {
                    "url": pp
                }
            },
            "text": text,
            "replyMessage": {}
        }]
    };

    const json = await axios.post('https://btzqc.betabotz.eu.org/generate', obj, {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const buffer = Buffer.from(json.data.result.image, 'base64');
    const stiker = await sticker(buffer, false, global.stickpack, global.stickauth);
    if (stiker) return conn.sendFile(m.chat, stiker, 'Quotely.webp', '', m);
}

handler.help = ['qc2']
handler.tags = ['sticker']
handler.command = /^(qc2)$/i

export default handler