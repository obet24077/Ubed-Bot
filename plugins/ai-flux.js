import axios from 'axios';
import { translate } from 'bing-translate-api';
 
async function handler(m, { conn, text }) {
  if (!text) return m.reply('Masukkan prompt nya\n\n*Example :* .fluxai Pemandangan Gunung');
  
  m.reply('Wait...');
  
  try {
    const translatedPrompt = await translateToEnglish(text);
    const imageUrl = await fluxAI(translatedPrompt);
    
    await conn.sendMessage(m.chat, { 
      image: { url: imageUrl }
    }, { quoted: m });
    
  } catch (error) {
    m.reply(`${error.message}`);
  }
}
 
async function translateToEnglish(text) {
  try {
    const result = await translate(text, null, 'en');
    return result.translation;
  } catch (error) {
    return text;
  }
}
 
async function fluxAI(prompt) {
  try {
    const res = await axios.post('https://fluxai.pro/api/tools/fast', {
      prompt: prompt
    }, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36',
        'Referer': 'https://fluxai.pro/fast-flux'
      },
      timeout: 30000,
      decompress: true
    });
    
    if (res.data?.ok === true && res.data?.data?.imageUrl) {
      return res.data.data.imageUrl;
    }
    
    if (res.data?.data?.images?.[0]) {
      return res.data.data.images[0];
    }
    
    throw new Error('Yah Error');
  } catch (er) {
    throw new Error(`${er.message}`);
  }
}
 
handler.help = ['fluxai'];
handler.tags = ['ai'];
handler.command = ['fluxai', 'aiflux', 'fastflux'];
 
export default handler