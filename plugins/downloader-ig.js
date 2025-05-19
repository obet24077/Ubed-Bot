import fetch from 'node-fetch';
import path from 'path';

let handler = async (m, { text, conn, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`Penggunaan: ${usedPrefix + command} <url_instagram>\n\nContoh:\n${usedPrefix + command} https://www.instagram.com/reel/DERFosGO4LA/?igsh=dDQ1OWYwenM4OXI3`);
    }

    if (!text.includes('instagram.com')) {
        return m.reply('URL tidak valid. Harap masukkan URL Instagram.');
    }

    try {
        // Tambahkan reaksi emoji saat memproses
        let processing = await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

        const apiUrl = `https://api.ubed.my.id/download/instagram?apikey=ubed2407&url=${encodeURIComponent(text)}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            // Hapus reaksi berhasil dan tambahkan reaksi gagal
            await conn.sendMessage(m.chat, { react: { text: '❌', key: processing.key } });
            return m.reply(`Terjadi kesalahan saat mengambil data dari API: ${response.status} ${response.statusText}`);
        }

        const buffer = await response.buffer();
        const contentType = response.headers.get('content-type');
        let filename = 'instagram_reel';

        if (contentType) {
            const mimeParts = contentType.split('/');
            if (mimeParts.length > 1) {
                filename += `.${mimeParts[1]}`;
            } else {
                filename += '.mp4'; // Fallback jika mimetype tidak jelas
            }
        } else {
            filename += '.mp4'; // Fallback jika content-type tidak ada
        }

        await conn.sendFile(m.chat, buffer, filename, 'Ini dia videonya dari Instagram!', m);

        // Hapus reaksi berhasil
        await conn.sendMessage(m.chat, { react: { text: '✅', key: processing.key } });

    } catch (error) {
        console.error('Terjadi kesalahan:', error);
        // Hapus reaksi berhasil dan tambahkan reaksi gagal
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } }); // Pastikan menggunakan m.key di sini
        m.reply(`Terjadi kesalahan: ${error}`);
    }
};

handler.help = ['igdl', 'instagramdl', 'instadl'].map(v => v + ' <url>');
handler.tags = ['downloader'];
handler.command = /^(igdl|instagramdl|instadl|ig|instagram)$/i;

export default handler;