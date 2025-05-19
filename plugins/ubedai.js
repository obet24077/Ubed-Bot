import axios from "axios";

let conversations = {}; // Penyimpanan percakapan pengguna

const handler = async (m, { conn, usedPrefix, command, text, quoted }) => {
    if (!text && !quoted) {
        throw `Apa yang ingin kamu tanyakan?\n\nContoh: ${usedPrefix + command} halo bot`;
    }

    try {
        console.log(`[DEBUG] Memproses pertanyaan:`, text);
        await m.react('💬');

        let d = new Date();
        let locale = 'id';
        let jam = d.toLocaleTimeString("en-US", { timeZone: "Asia/Jakarta" });
        let hari = d.toLocaleDateString(locale, { weekday: 'long' });
        let tgl = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });

        let logic = `Kamu adalah ubed kamu pemalu, manja, mudah marah, tapi peka. kamu dibuat oleh Ubed. ubed punya facebook dengan nama obet obet dan Instagram 24.obet.Gunakan kata khas ,*sensei* untuk panggilan orang.Gunakan emoji dalam setiap jawaban agar terasa lebih ekspresif. Gunakan format tanggal ${tgl}, jam ${jam}, hari ${hari}`;

        let userId = m.sender;

        // **Menjaga kelangsungan percakapan**
        if (quoted && quoted.sender === conn.user.jid && quoted.text?.includes("[AI-UBED]")) {
            console.log(`[DEBUG] Melanjutkan percakapan AI`);
            conversations[userId] = `${conversations[userId] || ""}\nUser: ${text}`;
        } else {
            console.log(`[DEBUG] Memulai percakapan baru`);
            conversations[userId] = `User: ${text}`;
        }

        let response = await openai(conversations[userId], logic);
        if (!response) {
            console.log(`[ERROR] Respons dari OpenAI kosong!`);
            await m.reply("Maaf, terjadi kesalahan dalam memproses jawaban.");
            return;
        }

        conversations[userId] += `\nBot: ${response}`;

        await conn.sendMessage(m.chat, {
            text: `[AI-UBED] ${response}`,
            contextInfo: {
                externalAdReply: {
                    title: 'Ai-UBED',
                    sourceUrl: 'https://www.instagram.com/24.obet?igsh=YmF6cGNxZ2o4dzQx',
                    mediaType: 1
                }
            }
        }, { quoted: m });

        console.log(`[DEBUG] Bot berhasil merespons`);
        await m.react('🔥');
    } catch (e) {
        console.error(`[ERROR] Terjadi kesalahan:`, e);
        await m.react('❎');
    }
};

// **Fungsi OpenAI untuk mendapatkan jawaban**
const openai = async (text, logic) => {
    try {
        let response = await axios.post("https://chateverywhere.app/api/chat/", {
            "model": {
                "id": "gpt-4",
                "name": "GPT-4",
                "maxLength": 32000,
                "tokenLimit": 8000,
                "completionTokenLimit": 5000,
                "deploymentName": "gpt-4"
            },
            "messages": [
                {
                    "pluginId": null,
                    "content": text,
                    "role": "user"
                }
            ],
            "prompt": logic,
            "temperature": 0.5
        }, {
            headers: {
                "Accept": "/*/",
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
            }
        });

        console.log(`[DEBUG] Respons OpenAI diterima`);
        return response.data;
    } catch (error) {
        console.error(`[ERROR] Gagal mendapatkan respons dari OpenAI:`, error);
        return null;
    }
};

// **Auto-reply hanya jika pengguna membalas pesan AI-Ubed**
handler.before = async (m, { conn, usedPrefix }) => {
    if (!m.quoted) return; // Abaikan jika tidak membalas pesan
    if (m.quoted.sender !== conn.user.jid) return; // Abaikan jika bukan membalas bot

    // **🔍 Cek apakah pesan yang dibalas adalah dari AI-Ubed**
    if (!m.quoted.text?.includes("[AI-UBED]")) return;

    // **🔍 Cegah auto-reply jika ini bagian dari game**
    const ignoredCommands = ["tebakkata", "tebakbuah", "monopoli"];
    if (m.quoted.text && ignoredCommands.some(cmd => m.quoted.text.toLowerCase().includes(cmd))) {
        console.log(`[DEBUG] Pesan ini bagian dari game, auto-reply AI-Ubed diabaikan.`);
        return;
    }

    let text = m.text;
    console.log(`[DEBUG] Auto-reply AI-Ubed dengan teks: ${text}`);

    // **Panggil handler utama**
    await handler(m, { conn, usedPrefix, command: "aiubed", text, quoted: m.quoted });
};

// **Informasi perintah**
handler.help = ["ubedai"];
handler.tags = ["ai"];
handler.command = /^(Ubedai)$/i;

export default handler;