import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix }) => {
    if (!text) throw `Gunakan perintah ini dengan format: ${usedPrefix}tulisbuku <teks>`;

    try {
        conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

        // URL API Tulis Buku
        const url = `https://api.ubed.my.id/tools/tulisbuku?apikey=${global.ubed}&text=${encodeURIComponent(text)}`;
        const response = await axios.get(url, { responseType: 'arraybuffer' });

        // Mengirimkan gambar hasil API langsung
        await conn.sendMessage(m.chat, { image: response.data, caption: '✅ Gambar berhasil dibuat dari teks.' });

        await conn.sendMessage(m.chat, { react: { text: '🎉', key: m.key } });
    } catch (error) {
        console.error('Error:', error);
        await conn.reply(m.chat, 'Maaf, terjadi kesalahan saat mencoba membuat gambar dari teks. Coba lagi nanti.', m);
    }
};

handler.help = ['nulis <text>'];
handler.tags = ['tools', 'image'];
handler.command = /^(nulis)$/i;
handler.limit = 5;
handler.register = true;
handler.premium = false;

export default handler;