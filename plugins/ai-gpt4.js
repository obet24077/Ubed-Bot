import fetch from 'node-fetch';

const handler = async (m, { conn, args, usedPrefix, command, text }) => {
    if (!text) return conn.reply(m.chat, `Contoh: ${usedPrefix + command} siapa presiden Indonesia?`, m);

    try {
        let res = await fetch(`https://fastrestapis.fasturl.cloud/aillm/gpt-4?ask=${encodeURIComponent(text)}`);
        if (!res.ok) throw await res.text();

        let json = await res.json();
        if (json.status !== 200) throw json;

        // Terjemahkan gaya bahasa jadi khas Ubed (versi santai + lokal)
        let ubedStyle = json.result
            .replace(/Hi(?:,)?/i, 'Halo cuy,')
            .replace(/I'm just a program.*?but/i, 'Aku emang cuma bot doang, tapi tenang')
            .replace(/How can I assist you today\?/i, 'Ada yang bisa Ubed bantuin hari ini?');

        let replyText = `*Ubed bilang:*\n${ubedStyle}`;

        conn.reply(m.chat, replyText, m);
    } catch (e) {
        console.error(e);
        conn.reply(m.chat, 'Maaf, Ubed lagi error nih. Coba beberapa saat lagi ya!', m);
    }
};

handler.command = ['gpt4', 'tanyaubed'];
handler.help = ['gpt4 <pertanyaan>'];
handler.tags = ['ai'];

export default handler;