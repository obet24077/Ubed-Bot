import fetch from 'node-fetch';
import yts from 'yt-search';

const handler = async (m, { conn, command, text, usedPrefix }) => {
    if (!text) throw `📌 Gunakan contoh: *${usedPrefix}${command} naruto blue bird*`;

    await conn.sendMessage(m.chat, {
        react: {
            text: "🎶",
            key: m.key
        }
    });

    try {
        const search = await yts(text);
        if (!search.videos.length) throw "❌ Video tidak ditemukan!";

        const videos = search.videos.slice(0, 20);
        const video = videos[0];
        const { title: videoTitle, timestamp, views: ytViews, ago, url: videoUrl, thumbnail: ytThumbnail } = video;

        const apiUrl = `https://fastrestapis.fasturl.cloud/downup/ytmp3?url=${encodeURIComponent(videoUrl)}`;
        const res = await fetch(apiUrl);
        const data = await res.json();

        if (data.status !== 200 || data.content !== "Success" || !data.result?.media) throw "❌ Gagal mengambil audio dari API.";

        const { title, metadata, author, media, quality } = data.result;
        const { duration, thumbnail: apiThumbnail, views, uploadDate } = metadata;

        const caption = `╭─❍ *『 UBED MUSIC 』* ❍─╮
│  
│  📌 *Judul:* ${title}
│  👤 *Artis:* ${author?.name || 'Tidak Diketahui'}
│  ⏳ *Durasi:* ${duration}
│  👁️ *Views:* ${(views || ytViews)?.toLocaleString()} views
│  📆 *Upload:* ${uploadDate || ago}
│  🔗 *Link:* ${videoUrl}
│  
╰───────────────✦
`;

        const buttons = [
            { buttonId: `.lirik5 ${text}`, buttonText: { displayText: "♪ Lirik" }, type: 1 },
            { buttonId: `.spotify ${text}`, buttonText: { displayText: "🎶 Spotify Music" }, type: 1 },
            { buttonId: `.ytmp4 ${videoUrl}`, buttonText: { displayText: "⎚ Download Video" }, type: 1 },
            {
                buttonId: "action",
                buttonText: { displayText: "📌 Pilih Lagu" },
                type: 4,
                nativeFlowInfo: {
                    name: "single_select",
                    paramsJson: JSON.stringify({
                        title: "Hasil Pencarian YouTube",
                        sections: [
                            {
                                title: "📌 Pilih yang Ingin Diunduh",
                                rows: videos.map((vid, index) => ({
                                    header: `🎵 Lagu #${index + 1}`,
                                    title: vid.title,
                                    description: `⏳ ${vid.timestamp} | 👁️ ${vid.views.toLocaleString()} views`,
                                    id: `${usedPrefix}${command} ${vid.url}`,
                                })),
                            },
                        ],
                    }),
                },
            },
        ];

        const thumbRes = await fetch(apiThumbnail || ytThumbnail);
        const thumbBuffer = await thumbRes.buffer();

        await conn.sendMessage(m.chat, {
            image: thumbBuffer,
            caption,
            footer: "Ubed Bot",
            buttons,
            headerType: 4,
        }, { quoted: m });

        const audioRes = await fetch(data.result.media);
        const audioBuffer = await audioRes.arrayBuffer();

        await conn.sendMessage(m.chat, {
            audio: Buffer.from(audioBuffer),
            mimetype: 'audio/mpeg',
            ptt: false,
            fileName: `${title}.mp3`,
            caption: "✅ *Berhasil mengunduh audio!*",
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(m.chat, {
            react: {
                text: "❌",
                key: m.key
            }
        });
        throw `❌ Gagal mengunduh audio.\n\n🪵 *Log:* ${e.message || e}`;
    }
};

handler.help = ["play", "audio", "lagu", "musik", "music"].map(v => v + " <query>");
handler.tags = ["downloader"];
handler.command = /^(play|audio|lagu|music|musik|song|songs)$/i;
handler.limit = true;
handler.premium = false;
handler.register = true;

export default handler;