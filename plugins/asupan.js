import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
    try {
        await m.reply('🔍 Sedang mencari video asupan random...');

        let apiUrl = 'https://api.botcahx.eu.org/api/asupan/asupan?apikey=ubed2407';
        let res = await fetch(apiUrl);

        if (!res.ok) throw `❌ Gagal mengambil video. Status: ${res.status}`;

        let buffer = await res.buffer(); // Ambil video sebagai buffer

        console.log('Video fetched successfully'); // Debugging

        await conn.sendFile(m.chat, buffer, 'asupan.mp4', '✨ Nih asupan random untukmu!', m);

    } catch (error) {
        console.error('Error:', error);
        m.reply(`❌ Terjadi kesalahan: ${error}`);
    }
}

handler.help = ['asupan'];
handler.tags = ['video'];
handler.limit = false;
handler.command = /^(asupan)$/i;

export default handler;