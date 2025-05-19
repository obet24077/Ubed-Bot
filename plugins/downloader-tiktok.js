//scrape tiktok ubed
//Simpan aja buat cadangan

import axios from 'axios';
import qs from 'qs';
import cheerio from 'cheerio';

async function tiktok(query) {
    try {
        const encodedParams = new URLSearchParams();
        encodedParams.set("url", query);
        encodedParams.set("hd", "1");

        const response = await axios({
            method: "POST",
            url: "https://tikwm.com/api/",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                Cookie: "current_language=en",
                "User-Agent":
                    "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
            },
            data: encodedParams,
        });
        const videos = response.data;
        return videos;
    } catch (error) {
        console.error("Error fetching TikTok v2 data:", error);
        throw error;
    }
}

const headers = {
    "authority": "ttsave.app",
    "accept": "application/json, text/plain, */*",
    "origin": "https://ttsave.app",
    "referer": "https://ttsave.app/en",
    "user-agent": "Postify/1.0.0",
};

const tiktokdl = {
    submit: async function (url, referer) {
        const headerx = { ...headers, referer };
        const data = { "query": url, "language_id": "1" };
        return axios.post('https://ttsave.app/download', data, { headers: headerx });
    },

    parse: function ($) {
        const description = $('p.text-gray-600').text().trim();
        const dlink = {
            nowm: $('a.w-full.text-white.font-bold').first().attr('href'),
            audio: $('a[type="audio"]').attr('href'),
        };

        const slides = $('a[type="slide"]').map((i, el) => ({
            number: i + 1,
            url: $(el).attr('href')
        })).get();

        return { description, dlink, slides };
    },

    fetchData: async function (link) {
        try {
            const response = await this.submit(link, 'https://ttsave.app/en');
            const $ = cheerio.load(response.data);
            const result = this.parse($);
            return {
                video_nowm: result.dlink.nowm,
                audio_url: result.dlink.audio,
                slides: result.slides,
                description: result.description
            };
        } catch (error) {
            console.error("Error fetching TikTok data:", error);
            throw error;
        }
    }
};

let handler = async (m, { text, usedPrefix, command, conn }) => {
    if (!text) throw `Penggunaan: ${usedPrefix}${command} <URL TikTok>`;
    try {
        await conn.sendMessage(m.chat, { react: { text: '🍏', key: m.key } });
        const results = await tiktokdl.fetchData(text);

        if (results?.video_nowm) {
            await conn.sendMessage(m.chat, {
                video: { url: results.video_nowm },
                caption: `*TikTok Downloader*\n\n*Deskripsi:* ${results.description}\n*Sumber:* ${text}\n\n© Ubed Bot`,
            }, { quoted: m });
        } else if (results?.audio_url) {
            await conn.sendMessage(m.chat, {
                audio: { url: results.audio_url },
                mimetype: 'audio/mpeg',
                caption: `*TikTok Downloader*\n\n*Audio:* ${results.description}\n*Sumber:* ${text}\n\n© Ubed Bot`,
            }, { quoted: m });
        } else if (results?.slides && results.slides.length > 0) {
            await conn.sendMessage(m.chat, {
                text: `*TikTok Downloader*\n\n*Deskripsi:* ${results.description}\n*Sumber:* ${text}\n\n🖼️ Mengirim ${results.slides.length} slide...`,
                quoted: m
            });
            for (const slide of results.slides) {
                await conn.sendMessage(m.chat, { image: { url: slide.url }, caption: '© Ubed Bot' }, { quoted: m });
            }
        } else {
            await m.reply(`Tidak dapat mengunduh video atau menemukan media lain dari URL tersebut.`);
        }
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    } catch (error) {
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        m.reply(`Terjadi kesalahan saat mengunduh dari TikTok: ${error.message}`);
    }
};

handler.help = ["tiktok", "tt"].map(v => v + " <url>");
handler.tags = ["downloader"];
handler.premium = false;
handler.limit = 1;
handler.command = ["tiktok", "tt"];

export default handler;