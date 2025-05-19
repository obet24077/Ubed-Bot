import axios from 'axios';

const googleImageSearch = async (query) => {
    const apiKey = global.GoogleApi;  // Menggunakan global Google API key
    const cx = global.GoogleCx;       // Menggunakan global Custom Search Engine ID

    if (!apiKey || !cx) {
        throw 'API key atau CSE ID tidak ditemukan di global variables!';
    }

    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&cx=${cx}&key=${apiKey}&searchType=image&num=1`;

    try {
        const response = await axios.get(url);
        const items = response.data.items;

        if (!items || items.length === 0) {
            throw 'Tidak ada gambar yang ditemukan!';
        }

        return items[0].link;  // Mengembalikan URL gambar pertama
    } catch (error) {
        console.error(error);
        throw 'Gagal mencari gambar!';
    }
};

// Bot handler function
var handler = async (m, { conn, args }) => {
    if (!args[0]) {
        throw 'Masukkan text untuk mencari gambar!';
    }

    try {
        const query = args.join(' ');
        await conn.reply(m.chat, `Mencari gambar untuk: ${query}`, m);

        const imageUrl = await googleImageSearch(query);

        // Kirim gambar pertama
        await conn.sendFile(m.chat, imageUrl, 'image.jpg', 'Ini gambarnya', m);

    } catch (error) {
        conn.reply(m.chat, `Error: ${error}`, m);
    }
};

handler.help = ['image'].map((v) => v + ' <query>');
handler.tags = ['search'];
handler.command = /^(image|gimage|gimg)$/i;

export default handler;