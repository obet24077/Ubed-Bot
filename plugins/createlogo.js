import fetch from "node-fetch";

let handler = async (m, { conn, text }) => {
    if (!text) throw 'Please provide the text you want to create a logo with. Example: .createlogo YourTextHere';
    
    m.reply('Generating your logo, please wait...');

    try {
        const url = `https://flamingtext.com/net-fu/proxy_form.cgi?script=fluffy-logo&text=${encodeURIComponent(text)}&imageoutput=true&output=direct&doScale=true&scaleWidth=676&scaleHeight=359`;

        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Failed to generate logo');
        
        const imageBuffer = await response.buffer();
        
        await conn.sendFile(m.chat, imageBuffer, 'logo.png', `Here is your logo with the text: ${text}`, m);
    } catch (e) {
        console.error(e);
        m.reply('Sorry, an error occurred while generating the logo.');
    }
};

handler.help = ['createlogo'];
handler.tags = ['tools'];
handler.command = /^(createlogo)$/i;
handler.limit = true;

export default handler;