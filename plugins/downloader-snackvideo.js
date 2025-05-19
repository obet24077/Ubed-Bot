import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Masukan URL!\n\ncontoh:\n${usedPrefix + command} https://s.snackvideo.com/p/j9jKr9dR`;    
    try {
        if (!text.match(/snackvideo/gi)) throw `URL Tidak Ditemukan!`;        
        await m.react('🕓');  // Emoji reaksi saat proses sedang berlangsung
        
        const response = await axios.get(`https://api.botcahx.eu.org/api/download/snackvideo?url=${text}&apikey=ubed2407`);        
        const res = response.data.result;      
        var { 
          media, 
          title, 
          thumbnail, 
          authorImage, 
          author,  
          like,
          comment,
          share
        } = res;

        let capt = `🍏 *S N A C K   V I D E O*\n\n`;
        capt += `◦ *Title* : ${title}\n`;
        capt += `◦ *Author* : ${author}\n`;
        capt += `◦ *Like* : ${like}\n`;
        capt += `◦ *Comment* : ${comment}\n`;
        capt += `◦ *Share* : ${share}\n`;
        capt += `\n`;
        capt += `> Ubed Bot 2025`;        
        
        await conn.sendFile(m.chat, media, null, capt, m);
    } catch (e) {
        throw new Error(e);
    }
};

handler.command = handler.help = ['snackvideo'];
handler.tags = ['downloader'];
handler.limit = true;

export default handler;