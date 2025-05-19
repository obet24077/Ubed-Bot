import axios from 'axios';
import fetch from 'node-fetch';

// Fungsi untuk mengirim prompt ke LuminAI API
const sendToLuminAI = async (text, sender) => {
    try {
        const response = await axios.post('https://luminai.my.id/', {
            content: text,
            user: sender,
            prompt: `- You are DELTA, a friendly and helpful voice assistant.
            - Respond briefly to the user's request, and do not provide unnecessary information.
            - If you don't understand the user's request, ask for clarification.
            - You are not capable of performing actions other than responding to the user.
            - Always use Indonesian to answer all questions.
            - You answered all questions with answers less than 300 characters.
            - Please answer the questions as briefly as possible.
            - Do not use markdown, emojis, or other formatting in your responses. Respond in a way easily spoken by text-to-speech software.`
        });
        return response.data.result;
    } catch (error) {
        console.error('Error:', error.message);
        return null;
    }
};

// Fungsi untuk membuat permintaan ke MicMonster API untuk text-to-speech
const generateVoice = async (content) => {
    const formData = new URLSearchParams();
    formData.append("locale", "id-ID");
    formData.append("content", `<voice name="id-ID-ArdiNeural">${content}</voice>`);
    formData.append("ip", `${Array(4).fill(0).map(() => Math.floor(Math.random() * 256)).join('.')}`);

    try {
        const response = await fetch('https://app.micmonster.com/restapi/create', {
            method: 'POST',
            body: formData,
        });

        const audioData = await response.text();
        return Buffer.from(('data:audio/mpeg;base64,' + audioData).split(',')[1], 'base64');
    } catch (error) {
        console.error('Error generating voice:', error.message);
        return null;
    }
};

// Handler untuk menangani input dan memberikan respon voice
const handler = async (m, { text, conn, sender }) => {
    if (!text) {
        return m.reply('Hai saya AI Voice, tanyakan apa saja saya akan menjawabnya');
    }

    // Mengirim pesan sementara "Proses AI Voice..."
    const sentMessage = await conn.sendMessage(
        m.chat,
        { text: "Proses AI Voice..." },
        { quoted: m }
    );

    try {
        // Dapatkan respons dari LuminAI
        const aiResponse = await sendToLuminAI(text, sender);

        if (aiResponse) {
            // Dapatkan file suara dari MicMonster API
            const audioFile = await generateVoice(aiResponse);

            if (audioFile) {
                // Kirim file suara ke chat
                await conn.sendFile(m.chat, audioFile, 'response.mp3', '', m);
            } else {
                await conn.sendMessage(
                    m.chat,
                    { text: 'Gagal menghasilkan suara.' },
                    { quoted: m }
                );
            }
        } else {
            await conn.sendMessage(
                m.chat,
                { text: 'Gagal mendapatkan respons dari AI.' },
                { quoted: m }
            );
        }

        // Hapus pesan sementara
        await conn.sendMessage(
            m.chat,
            { text: 'Selesai.', edit: sentMessage.key },
            { quoted: m }
        );
    } catch (error) {
        console.error(error);
        await conn.sendMessage(
            m.chat,
            { text: 'Terjadi kesalahan saat memproses permintaan Anda.' },
            { quoted: m }
        );
    }
};

// Detail perintah handler
handler.command = ['voiceai', 'aivoice'];
handler.help = ['aivoice'];
handler.tags = ['ai'];
handler.limit = 1;

export default handler;