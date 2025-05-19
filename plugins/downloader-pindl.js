import axios from "axios";
import { JSDOM } from "jsdom";

class Pinterest {
    async getURL(url) {
        try {
            const response = await axios.get(url);
            const dom = new JSDOM(response.data);
            const document = dom.window.document;
            let contentUrl = '';
            const video = document.querySelector('video');
            if (video) {
                const videoUrl = video.getAttribute('src');
                contentUrl = videoUrl.replace('hls', '720p').replace('.m3u8', '.mp4');
            } else {
                const img = document.querySelector('meta[property="og:image"]');
                if (img) {
                    contentUrl = img.getAttribute('content');
                }
            }
            return contentUrl;
        } catch (error) {
            console.error('Error:', error.message);
            return '';
        }
    }

    async getBuffer(rawUrl) {
        try {
            const url = await this.getURL(rawUrl);
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            return response.data;
        } catch (error) {
            console.error('Error:', error.message);
            return null;
        }
    }
}

const handler = async (m, { conn, args, usedPrefix, command }) => {
    try {
        if (!args[0]) {
            return conn.reply(m.chat, `Harap masukkan URL Pinterest.\nContoh: ${usedPrefix}${command} <url>`, m);
        }

        const url = args[0];
        const pinterest = new Pinterest();

        await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

        const buffer = await pinterest.getBuffer(url);

        if (buffer) {
            const contentUrl = await pinterest.getURL(url);
            const isImage = contentUrl.endsWith('.jpg') || contentUrl.endsWith('.png') || contentUrl.endsWith('.jpeg');
            if (isImage) {
                await conn.sendMessage(m.chat, { image: buffer, caption: "Berhasil mengunduh gambar dari Pinterest!" }, { quoted: m });
            } else {
                await conn.sendMessage(m.chat, { video: buffer, caption: "Berhasil mengunduh video dari Pinterest!" }, { quoted: m });
            }
        } else {
            conn.reply(m.chat, "Gagal mengambil konten dari URL yang diberikan. Pastikan URL benar atau coba lagi nanti.", m);
        }
    } catch (err) {
        console.error(err);
        conn.reply(m.chat, "Terjadi kesalahan saat memproses permintaan Anda.", m);
    } finally {
        await conn.sendMessage(m.chat, { react: { text: '', key: m.key } });
    }
};

handler.help = ['pinterestdl <url>'];
handler.tags = ['downloader'];
handler.command = /^(pinterestdownload|pindl)$/i;
handler.register = true;
handler.limit = 1;

export default handler;