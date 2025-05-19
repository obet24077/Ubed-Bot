import fetch from 'node-fetch';

export async function before(m, { conn }) {
    let chat = global.db.data.chats[m.chat];

    if (chat.zahra && !chat.isBanned) {
        if (/^.*false|disable|(turn)?off|0/i.test(m.text)) return;
        if (!m.text || m.fromMe) return;

        try {
            let response = await fetch(`https://api.ubed.my.id/ai/zahra?apikey=ubed2407&text=${encodeURIComponent(m.text)}`);
            if (!response.ok) throw new Error('API Obet Error');

            let json = await response.json();

            if (!json.status || !json.result) throw new Error();

            await conn.reply(m.chat, json.result, m);
        } catch (err) {
            console.error(err);
            await conn.reply(m.chat, '', m); // kosongin aja kalau error
        }

        return !0;
    }

    return !0;
}