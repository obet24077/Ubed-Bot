import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Kirim dengan format:\n\n*${usedPrefix + command} <isi tweet>*`;

    await conn.sendMessage(m.chat, { react: { text: '✍️', key: m.key } });

    let name = m.pushName || 'Ubed';
    let username = 'Ubed_bot';
    let verified = true;
    let retweets = 9999;
    let quotes = 2407;
    let likes = 99999;
    let mode = 'dim';

    // Tanggal & waktu realtime
    const now = new Date();
    const time = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

    // Ambil foto profil
    let ppUrl;
    try {
        ppUrl = await conn.profilePictureUrl(m.sender, 'image');
    } catch (e) {
        ppUrl = 'https://files.catbox.moe/y8rn53.jpg';
    }

    const api = `https://api.ubed.my.id/maker/tweet?apikey=ubed2407&content=${encodeURIComponent(text)}&ppUrl=${encodeURIComponent(ppUrl)}&name=${encodeURIComponent(name)}&username=${username}&verified=${verified}&time=${encodeURIComponent(time)}&date=${encodeURIComponent(date)}&retweets=${retweets}&quotes=${quotes}&likes=${likes}&mode=${mode}`;

    try {
        const res = await axios.get(api, { responseType: 'arraybuffer' });
        await conn.sendMessage(m.chat, {
            image: res.data,
            caption: `Tweet oleh @${username}`
        }, { quoted: m });

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    } catch (e) {
        console.error(e);
        m.reply('❌ Gagal membuat tweet.');
    }
};

handler.help = ['faketweet <text>'];
handler.tags = ['maker'];
handler.command = /^faketweet$/i;
handler.limit = true;

export default handler;