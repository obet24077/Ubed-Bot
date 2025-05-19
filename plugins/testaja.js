import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
    try {
        // Kirim pesan proses
        await m.reply('🍏 Sedang memproses video random...');

        // URL API untuk mendapatkan video random
        let videoUrl = 'https://api.ubed.my.id/random/asupan?apikey=ubed2407';
        
        // Mengambil video dari API menggunakan fetch
        let res = await fetch(videoUrl);
        
        if (!res.ok) throw `❌ Gagal mengambil video. Status: ${res.status}`;

        // Mengambil video sebagai buffer
        let buffer = await res.buffer();

        // Debugging: Log jika video berhasil diambil
        console.log('Video fetched successfully');

        // Kirim video ke chat
        await conn.sendFile(m.chat, buffer, 'random_video.mp4', '✨ Nih video random untukmu!', m);

    } catch (error) {
        console.error('Error:', error);
        m.reply(`❌ Terjadi kesalahan: ${error}`);
    }
};

handler.help = ['asupan'];
handler.tags = ['random'];
handler.limit = false;
handler.command = /^(testaja)$/i;

export default handler;