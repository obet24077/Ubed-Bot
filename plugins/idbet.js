let handler = async (m, { conn }) => {
    const text = m.text.toLowerCase();

    // Deteksi jika teks diawali dengan "id"
    if (/^id\b/.test(text)) {
        let info = "Silahkan japri ke nomor ini ya broku +62 851-9168-7899";

        await conn.reply(m.chat, info, m);
        return conn.sendMessage(m.chat, {
            react: {
                text: '📩',
                key: m.key,
            },
        });
    }
};

handler.customPrefix = /^id\b/i;
handler.command = new RegExp();

export default handler;