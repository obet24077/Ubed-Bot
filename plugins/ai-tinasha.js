import axios from 'axios';

const chatSessions = {};

let handler = async (m, { conn, text }) => {
    if (!text) return m.reply(`🤗 Mau nanya apa sama Tinasha?`);

    const emojis = ["😊", "✨", "🌸", "💖", "🐱", "🌟", "🍭", "🍀", "🦄", "🎀"];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    await conn.sendMessage(m.chat, {
        react: {
            text: randomEmoji,
            key: m.key,
        }
    });

    try {
        const userId = m.sender;

        if (!chatSessions[userId]) {
            chatSessions[userId] = {
                messages: [
                    { role: "system", content: "Kamu sedang berbicara dengan Tinasha Tuldarr, seorang petualang tangguh yang dikenal karena kecerdikan dan kemampuannya dalam bertarung. Dikenal sebagai ahli strategi, Tinasha mahir dalam taktik dan perencanaan. Meskipun memiliki masa lalu yang sulit, dia tidak ragu untuk membantu teman-temannya dalam situasi yang membutuhkan." }
                ],
                timer: setTimeout(() => {
                    delete chatSessions[userId];
                }, 3600000)
            };
        }

        chatSessions[userId].messages.push({ role: "user", content: text });

        const finalQuery = chatSessions[userId].messages
            .map(msg => `${msg.role === "system" ? "System" : msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
            .join("\n");

        let response = await axios.get(`${global.skizoweb}/api/cai/chat?apikey=Ponta-XD&characterId=zOewfy_mMB-Eu-F3H8jLEHQ0TdZ12Yt_5ocG-aTPigE&text=${encodeURIComponent(finalQuery)}&sessionId=&token=6e936b5861aeebf25855993fdff95c5380584527`);

        const { success, result } = response.data;

        if (success && result) {
            const responseText = result.text;
            chatSessions[userId].messages.push({ role: "assistant", content: responseText });
            conn.reply(m.chat, responseText, m);
        } else {
            return conn.reply(m.chat, `Terjadi kesalahan dalam mendapatkan respon: ${result.message || 'Tidak ada detail kesalahan'}`, m);
        }
      await conn.sendMessage(m.chat, { react: { text: '', key: m.key } });
    } catch (error) {
        await conn.sendMessage(m.chat, { react: { text: '🍋', key: m.key } });
        console.error(error);
        return conn.reply(m.chat, `Terjadi kesalahan dalam komunikasi dengan server: ${error.message}`, m);
    }
};

handler.tags = ['ai', 'cai'];
handler.help = ['tinasha <pertanyaan>'];
handler.command = /^(tinasha)/i;
handler.limit = 2;
handler.register = true;

export default handler;