import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
    try {
        await m.reply('🔍 Sedang mencari foto hijaber random...');

        let imageUrl = 'https://api.botcahx.eu.org/api/asupan/hijaber?apikey=ubed2407';
        let res = await fetch(imageUrl);
        
        if (!res.ok) throw `❌ Gagal mengambil gambar. Status: ${res.status}`;

        let buffer = await res.buffer(); // Ambil gambar sebagai buffer

        console.log('Image fetched successfully'); // Debugging

        await conn.sendFile(m.chat, buffer, 'hijaber.jpg', '✨ Nih hijaber random untukmu!', m);

    } catch (error) {
        console.error('Error:', error);
        m.reply(`❌ Terjadi kesalahan: ${error}`);
    }
}

handler.help = ['hijaber'];
handler.tags = ['random'];
handler.limit = false;
handler.command = /^(hijaber|hijab)$/i;

export default handler;