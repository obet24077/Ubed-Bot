import fetch from 'node-fetch';

let handler = async (message, { conn, isOwner, usedPrefix, command, text }) => {
    if (!text) throw 'Example: .txt2img highly detailed, intricate, 4k, 8k, sharp focus, detailed hair, detailed';

    message.reply('Wait...');
    
    let apiUrl = 'https://widipe.com/ai/text2img?text=' + text;
    conn.sendFile(message.chat, apiUrl, 'image.jpg', 'Prompt: ' + text, message);
};

handler.help = ['txt2img'];
handler.tags = ['ai'];
handler.command = /^(txt2img|aidraw|ai-draw)$/i;
handler.limit = true;

export default handler;