import WebSocket from 'ws';
import axios from 'axios';
import uploadImage from '../lib/uploadImage.js';

async function downloadImage(imageBuffer) {
    try {
        return imageBuffer;
    } catch (error) {
        throw new Error(`❌ Gagal memproses gambar: ${error.message}`);
    }
}

async function sendImageToWebSocket(imageUrl) {
    return new Promise((resolve, reject) => {
        const ws = new WebSocket('wss://screenshot-to-code-xe2d.onrender.com/generate-code');
        let collectedText = '';
        let finalCode = '';

        ws.on('open', () => {
            console.log('✅ Terhubung ke WebSocket');

            const data = {
                generationType: "create",
                image: imageUrl, 
                inputMode: "image",
                openAiApiKey: null,
                openAiBaseURL: null,
                anthropicApiKey: null,
                screenshotOneApiKey: null,
                isImageGenerationEnabled: true,
                editorTheme: "cobalt",
                generatedCodeConfig: "html_tailwind",
                codeGenerationModel: "gpt-4o-2024-05-13",
                isTermOfServiceAccepted: false
            };

            ws.send(JSON.stringify(data));
        });

        ws.on('message', (message) => {
            const response = JSON.parse(message.toString());

            if (response.type === 'chunk') {
                collectedText += response.value;
            } else if (response.type === 'setCode') {
                finalCode = response.value;
            }
        });

        ws.on('close', () => {
            console.log('⚡ Koneksi WebSocket ditutup');
            resolve({ description: collectedText.trim(), code: finalCode.trim() });
        });

        ws.on('error', (error) => {
            console.error('❌ Terjadi kesalahan:', error);
            reject(error);
        });
    });
}

let handler = async (m, { conn }) => {
    try {
        if (!m.quoted && !m.hasMedia) {
            return m.reply('Reply gambar dengan caption!\nContoh: .imagetocode');
        }

        await conn.sendMessage(m.chat, { react: { text: '🕑', key: m.key } });

        const media = m.quoted ? m.quoted.download() : m.download();
        const imageBuffer = await media;

        const imageUrl = await uploadImage(imageBuffer);
        console.log('URL Gambar yang Diupload:', imageUrl);
        
        const result = await sendImageToWebSocket(imageUrl);

        if (result.code) {
            conn.sendMessage(m.chat, {
                text: `✨ \`SCREENSHOT TO CODE\` ✨\n\n📜 *Kode HTML:*\n\`\`\`${result.code}\`\`\``,
            }, { quoted: m });
            await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
        } else {
            m.reply('⚠️ *Gagal mendapatkan kode dari gambar ini.*');
        }
    } catch (error) {
        console.error(error);
        m.reply('❌ *Terjadi kesalahan saat memproses gambar.*');
    }
};

handler.help = ['imagetocode'];
handler.tags = ['tools'];
handler.command = /^(screenshottocode|stc|imagetocode|imgtocode)$/i;
handler.limit = 5;
handler.register = true;

export default handler;