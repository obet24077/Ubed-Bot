import axios from "axios";

const emojis = ["🍏", "🍊", "🍎"];

const handler = async (m, { conn, args, text, usedPrefix, command }) => {
    let input = text || args.join(" ");
    if (!input) {
        throw `🎵 *Kamu mau cari lagu apa?*\n\nContoh:\n${usedPrefix + command} Hati-Hati di Jalan\n${usedPrefix + command} https://open.spotify.com/track/...`;
    }

    let reacting = true;
    const reactLoop = async () => {
        let i = 0;
        while (reacting) {
            await conn.sendMessage(m.chat, {
                react: {
                    text: emojis[i % emojis.length],
                    key: m.key
                }
            });
            await new Promise(res => setTimeout(res, 1000));
            i++;
        }
    };
    reactLoop();

    try {
        let spotifyLink = input;

        if (!input.includes("spotify.com/track")) {
            let search = await axios.get(`https://api.agatz.xyz/api/spotify?message=${encodeURIComponent(input)}`);
            if (!search?.data?.data?.[0]?.externalUrl) throw "❌ Gagal menemukan lagu berdasarkan judul!";
            spotifyLink = search.data.data[0].externalUrl;
        }

        let res = await axios.get(`https://fastrestapis.fasturl.cloud/downup/spotifydown?url=${encodeURIComponent(spotifyLink)}`);
        let result = res.data?.result;

        if (!result?.success) throw "❌ Gagal mengunduh lagu dari Spotify.";

        let { title, artists, album, cover } = result.metadata;
        let link = result.link;

        let caption = `╭─❍ *『 SPOTIFY MUSIC 』* ❍─╮
│  
│  🍃 *Judul:* ${title}
│  🎤 *Artis:* ${artists}
│  💽 *Album:* ${album}
│  🔗 *URL:* ${spotifyLink}
│  
╰───────────────✦

🍏 Ubed udah ketemu lagu kamu nih~`;

        const buttons = [
            { buttonId: `.mp4 ${spotifyLink}`, buttonText: { displayText: "⎚ Download Video" }, type: 1 }
        ];

        await conn.sendMessage(m.chat, {
            image: { url: cover },
            caption,
            footer: "Klik tombol di bawah untuk download video!",
            buttons,
            headerType: 4,
            contextInfo: {
                externalAdReply: {
                    title: title,
                    body: `${artists} • ${album}`,
                    thumbnailUrl: cover,
                    sourceUrl: spotifyLink,
                    mediaType: 1,
                   // renderLargerThumbnail: true
                }
            }
        }, { quoted: m });

        await conn.sendMessage(m.chat, {
            audio: { url: link },
            mimetype: 'audio/mpeg',
            ptt: true,
            fileName: `${title} - ${artists}.mp3`
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        throw `💔 *Gagal memproses lagu...* Coba lagi nanti ya!`;
    } finally {
        reacting = false;
    }
};

handler.help = ["spotify <judul/link>"];
handler.tags = ["downloader"];
handler.command = /^spotify$/i;

export default handler;