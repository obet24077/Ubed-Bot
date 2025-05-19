import axios from 'axios';
import { Sticker } from 'wa-sticker-formatter';

let handler = async (m, { conn, text, usedPrefix }) => {
    if (!text) throw `Gunakan perintah ini dengan format: ${usedPrefix}brat2 <teks>\n\nContoh: *${usedPrefix}brat2 Hai semua!*`;

    function randomColor() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    }

    try {
        await conn.sendMessage(m.chat, { react: { text: '🍊', key: m.key } });

        const fontColor = encodeURIComponent(randomColor());
        const bgColor = encodeURIComponent(randomColor());

        const apiUrl = `https://fastrestapis.fasturl.cloud/maker/brat/advanced?text=${encodeURIComponent(text)}&font=Arial&fontSize=auto&fontPosition=justify&fontBlur=3&fontColor=${fontColor}&bgColor=${bgColor}`;
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

        const sticker = new Sticker(response.data, {
            pack: 'Sticker By',
            author: 'Ubed Bot',
            type: 'image/png',
        });

        const stickerBuffer = await sticker.toBuffer();
        let sentMessage = await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m });

        await conn.sendMessage(m.chat, { react: { text: '🍏', key: sentMessage.key } });

    } catch (error) {
        console.error('Error:', error);
        await conn.reply(m.chat, '❌ Maaf, terjadi kesalahan saat membuat stiker brat2. Coba lagi nanti.', m);
    }
};

handler.help = ['brat2 <teks>'];
handler.tags = ['sticker'];
handler.command = /^brat2$/i;
handler.limit = 5;
handler.register = true;
handler.premium = false;

export default handler;