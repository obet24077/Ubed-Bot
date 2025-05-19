import axios from "axios";

let conversations = {};

const handler = async (m, { conn, text }) => {
    conn.autoaiSession = conn.autoaiSession || {};

    if (!text) throw `*• Contoh:* .autoai *[on/off]*`;

    if (text === "on") {
        if (conn.autoaiSession[m.chat]) {
            clearTimeout(conn.autoaiSession[m.chat].timeout);
        }
        conn.autoaiSession[m.chat] = {
            user: m.sender,
            messages: [],
            timeout: setTimeout(() => delete conn.autoaiSession[m.chat], 3600000)
        };
        m.reply("[ ✓ ] AutoAI session dimulai.");
    } else if (text === "off") {
        if (conn.autoaiSession[m.chat]) {
            clearTimeout(conn.autoaiSession[m.chat].timeout);
            delete conn.autoaiSession[m.chat];
            m.reply("[ ✓ ] AutoAI session dihentikan.");
        } else {
            m.reply("[ ✓ ] Tidak ada sesi AutoAI aktif.");
        }
    }
};

handler.before = async (m, { conn }) => {
    conn.autoaiSession = conn.autoaiSession || {};
    if (!m.text || !conn.autoaiSession[m.chat]) return;
    if (/^[.\#!\/\\]/.test(m.text)) return;
    if (m.sender !== conn.autoaiSession[m.chat].user) return;

    await conn.sendMessage(m.chat, { react: { text: '⏱️', key: m.key } });

    let d = new Date();
    let locale = 'id';
    let jam = d.toLocaleTimeString("en-US", { timeZone: "Asia/Jakarta" });
    let hari = d.toLocaleDateString(locale, { weekday: 'long' });
    let tgl = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });

    let prompt = `Kamu adalah Ubed, seorang pria muda yang cool, cuek, tapi perhatian. Kamu dibuat oleh Ubed. Gunakan kata khas *sensei* untuk memanggil orang. Gunakan emoji dalam setiap jawaban agar terasa hidup. Format tanggal sekarang ${tgl}, jam ${jam}, hari ${hari}.\n\nPercakapan:\n`;

    let userId = m.chat;
    let inputText = m.text;

    conversations[userId] = (conversations[userId] || '') + `\nUser: ${inputText}`;

    try {
        let response = await axios.post("https://chateverywhere.app/api/chat/", {
            model: {
                id: "gpt-4",
                name: "GPT-4",
                maxLength: 32000,
                tokenLimit: 8000,
                completionTokenLimit: 5000,
                deploymentName: "gpt-4"
            },
            messages: [{
                pluginId: null,
                content: conversations[userId],
                role: "user"
            }],
            prompt,
            temperature: 0.5
        }, {
            headers: {
                Accept: "*/*",
                "User-Agent": "Mozilla/5.0"
            }
        });

        let result = response.data;
        if (!result || typeof result !== 'string') throw 'Jawaban kosong dari AI.';

        conversations[userId] += `\nBot: ${result}`;
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
        m.reply(result);
    } catch (err) {
        console.error("AI Error:", err);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        m.reply("Gagal memproses jawaban dari AI.");
    }
};

handler.command = ['autoai'];
handler.tags = ['ai'];
handler.help = ['autoai *[on/off]*'];

export default handler;