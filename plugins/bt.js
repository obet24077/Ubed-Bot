import axios from 'axios';
import { Sticker } from 'wa-sticker-formatter';

let handler = async (m, { conn, text, usedPrefix }) => {
    if (!text) throw `Gunakan perintah ini dengan format: ${usedPrefix}brat <teks>`;

    try {
        conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

        const url = `https://brat.caliphdev.com/api/brat?text=${encodeURIComponent(text)}`;
        const response = await axios.get(url, { responseType: 'arraybuffer' });

        const sticker = new Sticker(response.data, {
            pack: 'Stiker By',
            author: 'Ubed Bot',
            type: 'image/png',
        });

        const stikerBuffer = await sticker.toBuffer();
        let sentMessage = await conn.sendMessage(m.chat, { sticker: stikerBuffer }, { quoted: m });
        await conn.sendMessage(m.chat, { react: { text: '🎉', key: sentMessage.key } });
    } catch (error) {
        console.error('Error:', error);
        await conn.reply(m.chat, 'Maaf, terjadi kesalahan saat mencoba membuat stiker brat. Coba lagi nanti.', m);
    }
};

handler.help = ['brat'];
handler.tags = ['sticker'];
handler.command = /^(stext|bt)$/i;
handler.limit = 5;
handler.register = true;
handler.premium = false;

export default handler