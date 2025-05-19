let handler = async (m, { conn }) => {
    const text = m.text.toLowerCase();

    // Deteksi berbagai variasi kata klaim
    if (/^(claim freebet|klaim freebet|klaim|claim)$/i.test(text)) {
        let info = "untuk claim freebet silahkan japri kontak dibawah ini ya brookhu 🫵🏻👇🏻\n\n\n\n+855968423617 🫶🏻";

        await conn.reply(m.chat, info, m);
        return conn.sendMessage(m.chat, {
            react: {
                text: '👇🏻',
                key: m.key,
            },
        });
    }
};

handler.customPrefix = /^(claim freebet|klaim freebet|klaim|claim)$/i;
handler.command = new RegExp();

export default handler;