import fetch from 'node-fetch';

const handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `*Example:* ${usedPrefix}${command} https://www.mediafire.com/file/941xczxhn27qbby/GBWA_V12.25FF-By.SamMods-.apk/file`;
    
    try {
        // Kirim emoji reaksi saat proses berlangsung
        await m.react('🕓'); // Emoji reaksi saat sedang memproses
        
        const response = await fetch(`https://api.botcahx.eu.org/api/dowloader/mediafire?url=${args[0]}&apikey=ubed2407`);
        const json = await response.json();
        
        if (!json.result) throw 'Failed to fetch!';
        
        let { url, filename, ext, upload_date: aploud, filesize, filesizeH } = json.result;
        
        let caption = `
*💌 Name:* ${filename}
*📊 Size:* ${filesizeH}
*🗂️ Extension:* ${ext}
*📨 Uploaded:* ${aploud}

> Ubed Bot 2025
`.trim();
        
        m.reply(caption);
        conn.sendMessage(m.chat, { document: { url: url }, mimetype: ext, fileName: filename }, { quoted: m });
        
    } catch (e) {
        throw new Error(e);
    }
};

handler.help = ['mediafire'].map(v => v + ' <url>');
handler.tags = ['downloader'];
handler.command = /^(mediafirefree|mffree)$/i;

handler.limit = true;

export default handler;