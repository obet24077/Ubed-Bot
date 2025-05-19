import axios from "axios";

const emojis = ["🍏", "🍊", "🍎"];

const handler = async (m, { conn, args, text }) => {
    let input = text || args.join(" ");
    if (!input) {
        throw `🎵 *Kamu mau cari lagu apa?*\n\nContoh:\n.applemusic You've Got a Friend In Me\n.applemusic https://music.apple.com/...`;
    }

    // Animasi emoji loop
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
        let appleLink = input;

        // Kalau input bukan link Apple Music, cari dulu
        if (!input.includes("music.apple.com")) {
            let search = await axios.get(`https://fastrestapis.fasturl.cloud/music/applemusic?query=${encodeURIComponent(input)}`);
            let result = search.data?.result?.find(x => x.link.includes("/album/") && x.link.includes("?i="));
            if (!result?.link) throw "❌ Gagal menemukan lagu berdasarkan judul!";
            appleLink = result.link;
        }

        // Proses unduhan dari API
        let res = await axios.get(`https://fastrestapis.fasturl.cloud/downup/applemusicdown?url=${encodeURIComponent(appleLink)}`);
        let result = res.data?.result;

        if (!result?.downloadUrl) throw "❌ Gagal mengunduh lagu dari Apple Music.";

        let { title, artist, artworkUrl } = result.metadata;

        // Kirim caption + audio
        let caption = `╭─❍ *『 APPLE MUSIC 』* ❍─╮
│  
│  🍃 *Judul:* ${title}
│  🎤 *Artis:* ${artist}
│  🔗 *URL:* ${appleLink}
│  
╰───────────────✦

✨ Ubed Udah ketemu Lagu kamu nih~`;

        await conn.sendMessage(m.chat, {
            image: { url: artworkUrl },
            caption,
            contextInfo: {
                externalAdReply: {
                    title: title,
                    body: artist,
                    thumbnailUrl: artworkUrl,
                    sourceUrl: appleLink,
                    mediaType: 1,
                    //renderLargerThumbnail: true
                }
            }
        }, { quoted: m });

        await conn.sendMessage(m.chat, {
            audio: { url: result.downloadUrl },
            mimetype: 'audio/mpeg',
            ptt: true,
            fileName: `${title} - ${artist}.mp3`
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        throw `💔 *Gagal memproses lagu...* Coba lagi nanti ya!`;
    } finally {
        reacting = false;
    }
};

handler.help = ["applemusic <judul/link>"];
handler.tags = ["downloader"];
handler.command = /^applemusic$/i;

export default handler;