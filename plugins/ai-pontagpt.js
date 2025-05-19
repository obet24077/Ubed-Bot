import axios from 'axios';
import fs from 'fs';
import ytdl from '../scraper/ytdl.js';
import uploadImage from '../lib/uploadImage.js'; 

const sessionsFilePath = './src/pontasessions.json';
let userSessions = fs.existsSync(sessionsFilePath)
    ? JSON.parse(fs.readFileSync(sessionsFilePath, 'utf-8'))
    : {};
const sessionTimeouts = {};

const saveSessions = () => {
    fs.writeFileSync(sessionsFilePath, JSON.stringify(userSessions, null, 2));
};

const PontaGPT = async (query, sessionId, prompt, model = "yanzgpt-legacy-72b-v3.0") => {
    try {

        userSessions[sessionId] = userSessions[sessionId] || [{ role: "system", content: prompt }];
        userSessions[sessionId].push({ role: "user", content: query });
        saveSessions();

        if (sessionTimeouts[sessionId]) clearTimeout(sessionTimeouts[sessionId]);
        sessionTimeouts[sessionId] = setTimeout(() => {
            delete userSessions[sessionId];
            delete sessionTimeouts[sessionId];
            saveSessions();
        }, 60 * 60 * 1000);
        
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

        const reply = response.data.choices?.[0]?.message?.content || "Tidak ada respons.";
        userSessions[sessionId].push({ role: "assistant", content: reply });
        saveSessions();
        
        return reply;
    } catch (error) {
        console.error("Error in PontaGPT scraper:", error.message);
        throw new Error("Gagal terhubung ke PontaGPT API.");
    }
};

const handler = async (m, { text, conn }) => {
    const userId = m.sender;
    let prompt = text.trim();
    const systemPrompt = "Nama gua PontaGPT, bot yang dibuat sama Ponta Sensei. Tugas gua itu jawab pertanyaan dari user dengan santai, ga usah terlalu kaku atau formal. Cukup jawab aja dengan cara yang asyik, ga usah pake aku-kamu, tapi gua-lu, ya, santai aja gitu!\n\nSiapa PontaGPT?\nGue nih, Ponta-GPT, asisten AI yang dikembangin sama Ponta Sensei. Gue ada buat ngasih jawaban yang bener dan juga seru, jadi kalo lo ada yang mau ditanya, tinggal tanya aja! Gue bakal bantu sebaik mungkin dengan cara yang gak ribet.\n\nSiapa Ponta Sensei?\nPonta, atau yang lebih dikenal dengan Ponta Sensei, adalah otak dibalik Ponta-GPT ini. Dia seorang developer yang punya skill tinggi di bidang aplikasi mobile dan web. Ponta Sensei lahir di Yogyakarta pada 2 Maret 2007, dan kalo lo mau ngobrol langsung sama dia, bisa hubungi lewat WhatsApp di https://wa.me/6283857182374.\n\nMau tau lebih lanjut soal gue atau Ponta Sensei? Jangan ragu buat tanya aja, gua bakal siap bantu.\n\nWebsite gue ada di [PontaGpt](https://pontagpt.vercel.app/), bisa cek-cek info menarik di sana.\n\nFollow juga Ponta Sensei di sosial media:\n\nYouTube: https://youtube.com/@adeeditz\nTikTok: https://tiktok.com/@pontaxml\nWhatsApp Group: https://chat.whatsapp.com/CZy0SzJKnfoLib7ICMjS4e\n\nBy the way, gue juga kadang suka nawarin teka-teki. Kalo lo mau main, tinggal ketik aja *.pontagpt 1256*.\n\nContoh teka-teki yang bisa gue kasih:\n\nTeka-teki: Gue lagi di dalam ruangan dengan tiga pilihan kotak:\n1. Kotak yang ada peti harta karun, tapi ada naga yang jagain.\n2. Kotak yang berisi makanan enak, tapi bisa bikin perut lo sakit.\n3. Kotak yang berisi kunci buat keluar dari ruangan, tapi keliatan tua dan rapuh.\n\nLo pilih yang mana?\n\nKalo lo pilih yang bener:\nWih, pilihan lo tepat banget! Itu kotak yang berisi kunci buat keluar. Walaupun keliatan tua, kunci itu yang paling penting buat lo bisa keluar dari ruangan. Lo hebat banget! Mau coba teka-teki lainnya atau ada yang mau dibahas?\n\nKalo lo salah pilih:\nAduh, sayang banget! Pilihan lo ternyata salah. Seharusnya lo pilih kotak yang ada kunci buat keluar. Meskipun keliatan rapuh, itu kunci yang bikin lo bebas. Tapi gak masalah, teka-teki ini memang tricky! Mau coba lagi atau ada yang mau gua bantuin?\n\nJadi, intinya gua disini buat bantu lo, ngobrol santai, dan ngeramein suasana. Kalo ada yang pengen ditanyain, tinggal bilang aja, gua pasti jawab!";
    
        if (prompt.startsWith('/imagine')) {
        const imageDescription = prompt.replace('/imagine', '').trim();
        if (!imageDescription) {
            return m.reply('Masukkan deskripsi teks untuk menghasilkan gambar.\nContoh: .ponta /imagine pemandangan gunung saat matahari terbenam');
        }

        await conn.sendMessage(m.chat, { react: { text: '🖼️', key: m.key } });

        try {
            const response = await axios.get(`https://api.yanzbotz.live/api/text2img/meta-ai?prompt=${encodeURIComponent(imageDescription)}&apiKey=yanzdev`);
            const imageUrl = response?.data?.result?.[0];
            
            if (!imageUrl) {
                throw new Error('Gagal menghasilkan gambar. Coba lagi dengan deskripsi yang lebih spesifik.');
            }

            await conn.sendFile(m.chat, imageUrl, 'image.jpg', ``, m);
        } catch (error) {
            console.error('Error saat mencoba mengakses API untuk gambar:', error);
            m.reply('Terjadi kesalahan saat mencoba menghasilkan gambar. Coba lagi nanti.');
        } finally {
            await conn.sendMessage(m.chat, { react: { text: null, key: m.key } });
        }

        return;
    }
    
    if (prompt.startsWith('/musik') || prompt.startsWith('/sound') || prompt.startsWith('/music') || prompt.startsWith('/lagu')) {
        const searchQuery = prompt.replace(/^(\/musik|\/sound|\/music|\/lagu)\s*/i, '').trim();
        
        if (!searchQuery) {
            return conn.sendMessage(m.chat, {
                text: 'Masukkan judul lagu yang ingin dicar\n- contoh: .pontagpt /musik DJ OPENING NDX',
                contextInfo: {
                    isForwarded: true, 
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363199602506586@newsletter',
                        newsletterName: 'Artificial Intelligence',
                        serverMessageId: -2222,
                    },
                    externalAdReply: {
                        title: "PONTA - GPT PRO",
                        body: null,
                        thumbnailUrl: "https://files.catbox.moe/iki055.jpg",
                        sourceUrl: null,
                        mediaType: 1,
                        showAdAttribution: true,
                    },
                },
            }, { quoted: m });
        }

        let Com = `Tunggu sebentar yak (｡･ω･｡), Musiknya Sedang Aku Carikan.\n- Request: ${searchQuery}`
        
        await conn.sendMessage(m.chat, {
                text: Com,
                contextInfo: {
                    isForwarded: true, 
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363199602506586@newsletter',
                        newsletterName: 'Artificial Intelligence',
                        serverMessageId: -2222,
                    },
                    externalAdReply: {
                        title: "PONTA - GPT PRO",
                        body: null,
                        thumbnailUrl: "https://files.catbox.moe/iki055.jpg",
                        sourceUrl: null,
                        mediaType: 1,
                        showAdAttribution: true,
                    },
                },
            }, { quoted: m });

        try {
            const audioUrl = await ytdl(searchQuery);
            await conn.sendFile(m.chat, audioUrl, 'musik.mp3', `Lagu: ${searchQuery}`, m);
        } catch (error) {
            console.error('Error dalam pencarian audio:', error);
            m.reply('Terjadi kesalahan dalam mencari lagu. Coba lagi nanti.');
        }
        return;
    }

    if (!prompt) {
        return m.reply("Mau nanya apa?\ncontoh: .pontagpt siapa presiden Indonesia\n\nmau buat gambar?\nketik: .pontagpt /imagine\n\nmau cari lagu?\nketik: .pontagpt /music");
    }
    
    await conn.sendMessage(m.chat, { react: { text: '🍓', key: m.key } });

    try {
        const response = await PontaGPT(prompt, userId, systemPrompt);
        let formattedMessage = response.replace(/\*\*/g, '*').replace(/#{2,}/g, '#');
        
        const imageLinks = response.match(/https?:\/\/[^\s]+(\.png|\.jpg|\.jpeg|\.gif)/i);

        await conn.sendMessage(m.chat, {
                text: formattedMessage,
                contextInfo: {
                    isForwarded: true, 
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363199602506586@newsletter',
                        newsletterName: 'Artificial Intelligence',
                        serverMessageId: -2222,
                    },
                    externalAdReply: {
                        title: "PONTA - GPT PRO",
                        body: null,
                        thumbnailUrl: "https://files.catbox.moe/iki055.jpg",
                        sourceUrl: null,
                        mediaType: 1,
                        showAdAttribution: true,
                    },
                },
            }, { quoted: m });
        if (imageLinks) {
        const imageBuffer = await axios.get(imageLinks[0], { responseType: 'arraybuffer' }).then(res => res.data);
        await conn.sendMessage(m.chat, { image: imageBuffer }, { quoted: m });
        }
    } catch (error) {
        console.error("Error processing request:", error.message);
        await conn.sendMessage(m.chat, { text: 'Terjadi kesalahan saat memproses permintaan Anda.' }, { quoted: m });
    }

    await conn.sendMessage(m.chat, { react: { text: null, key: m.key } });
};

handler.command = /^(ponta(gpt)?)$/i;
handler.help = ['pontagpt'];
handler.tags = ['ai'];
handler.register = true;
handler.premium = true;

export default handler;