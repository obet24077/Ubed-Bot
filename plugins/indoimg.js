import axios from 'axios';

let handler = async (m, { conn }) => {
    try {
        await conn.sendMessage(m.chat, { react: { text: '🖼️', key: m.key } });

        // Panggil API yang langsung mengembalikan buffer gambar
        const response = await axios.get('https://obet-rest-api.vercel.app/random/indonesia?apikey=free1', {
            responseType: 'arraybuffer'
        });

        let buffer = Buffer.from(response.data);

        // Kirim buffer sebagai gambar ke WhatsApp
        await conn.sendMessage(m.chat, {
            image: buffer,
            caption: 'Foto random dari Indonesia.'
        }, { quoted: m });

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, '❌ Gagal mengambil gambar dari API.', m);
    }
};

handler.help = ['indoimg'];
handler.tags = ['internet', 'random'];
handler.command = /^(indoimg)$/i;
handler.limit = 3;
handler.register = true;

export default handler;