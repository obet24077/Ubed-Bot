let handler = async (m, { conn }) => {
    const text = m.text.toLowerCase();

    // Daftar variasi kata klaim yang lebih romantis
    const responses = [
        "Apa kabar, sayang? Ubed di sini, ada yang bisa aku bantu?",
        "Halo, cintaku! Ubed selalu siap untukmu.",
        "Hei, kamu lagi apa? Ubed selalu ada untukmu, loh.",
        "Gimana, sayang? Ubed rindu sama kamu.",
        "Ada apa, hati? Ubed ada di sini buat kamu.",
        "Ubed merasa hangat setiap kali kamu nyapa.",
        "Cinta, kamu butuh apa? Ubed siap menemanimu.",
        "Hey, sayang! Ubed di sini, siap kasih perhatian buat kamu.",
        "Gimana rasanya punya Ubed yang selalu ada buat kamu?",
        "Ubed di sini, ada yang bisa ku bantu, cinta?",
        "Kamu lagi apa, sayang? Ubed di sini buat nemenin kamu.",
        "Rindu deh, kayaknya Ubed harus sering-sering muncul di chat kamu.",
        "Aku di sini, sayang. Ubed selalu siap untukmu kapan saja.",
        "Hidup jadi lebih manis kalau ada kamu, sayang. Ubed selalu ingin berada di sampingmu.",
        "Ubed akan selalu ada untukmu, jangan khawatir, cintaku.",
        "Ayo ngobrol, kamu selalu buat Ubed senang.",
        "Hati ini milikmu, sayang. Ubed selalu ada buat kamu."
    ];

    // Deteksi perintah "p"
    if (/^p$/i.test(text)) {
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        await conn.reply(m.chat, randomResponse, m);
        return conn.sendMessage(m.chat, {
            react: {
                text: '🍎',
                key: m.key,
            },
        });
    }
};

handler.customPrefix = /^p$/i; // Hanya "p" yang akan memicu perintah ini
handler.command = new RegExp();

export default handler;