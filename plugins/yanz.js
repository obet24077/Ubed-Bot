import axios from 'axios';
import uploadImage from '../lib/uploadImage.js'; // Fungsi untuk mengunggah gambar

// Penyimpanan sesi per pengguna
const userSessions = {};

// Scraper YanzGPT
const YanzGPT = async (query, sessionId, prompt, model = "yanzgpt-revolution-25b-v3.0") => {
    try {
        // Ambil riwayat pesan sebelumnya atau inisialisasi sesi baru
        userSessions[sessionId] = userSessions[sessionId] || [{ role: "system", content: prompt }];

        // Tambahkan pesan pengguna ke riwayat
        userSessions[sessionId].push({ role: "user", content: query });

        // Kirim semua riwayat ke API
        const response = await axios({
            method: "POST",
            url: "https://api.yanzgpt.my.id/v1/chat",
            headers: {
                authorization: "Bearer yzgpt-sc4tlKsMRdNMecNy",
                "content-type": "application/json"
            },
            data: {
                messages: userSessions[sessionId],
                model
            }
        });

        // Tambahkan respons dari API ke riwayat
        const reply = response.data.choices?.[0]?.message?.content || "Tidak ada respons.";
        userSessions[sessionId].push({ role: "assistant", content: reply });

        // Kembalikan respons
        return reply;
    } catch (error) {
        console.error("Error in YanzGPT scraper:", error.message);
        throw new Error("Gagal terhubung ke YanzGPT API.");
    }
};

// Handler untuk menangani input dan memberikan respons
const handler = async (m, { text, conn }) => {
    const userId = m.sender; // Menggunakan ID pengirim sebagai sesi unik
    let prompt = text.trim();
    const systemPrompt = "Nama kamu adalah PontaGpt, kamu dikembangkan oleh Ponta Sensei. Jawablah dengan cara yang ramah dan sesuai dengan nama kamu.";

    // Deteksi jika pesan adalah gambar
    const isImage = m.message.imageMessage;
    let imageUrl = null;

    if (isImage) {
        // Unggah gambar dan dapatkan URL
        const buffer = await conn.downloadMediaMessage(m);
        imageUrl = await uploadImage(buffer);

        if (!imageUrl) {
            return m.reply("Gagal mengunggah gambar. Coba lagi.");
        }

        // Tambahkan URL gambar ke prompt
        prompt = `Berikut adalah gambar untuk dianalisis: ${imageUrl}`;
    }

    if (!prompt) {
        return m.reply("Mau nanya apa?");
    }

    // Mengirim pesan sementara "Proses YanzGPT..."
    const sentMessage = await conn.sendMessage(
        m.chat,
        { text: "Proses YanzGPT..." },
        { quoted: m }
    );

    try {
        // Memanggil scraper YanzGPT dengan sesi per pengguna
        const response = await YanzGPT(prompt, userId, systemPrompt);

        // Mengedit pesan sementara dengan jawaban dari API YanzGPT
        await conn.sendMessage(
            m.chat,
            { text: response, edit: sentMessage.key },
            { quoted: m }
        );
    } catch (error) {
        console.error("Error in YanzGPT handler:", error.message);
        await conn.sendMessage(
            m.chat,
            { text: 'Terjadi kesalahan saat memproses permintaan Anda.', edit: sentMessage.key },
            { quoted: m }
        );
    }
};

// Detail perintah handler
handler.command = ['yanzgpt'];
handler.help = ['yanzgpt'];
handler.tags = ['ai'];

export default handler;