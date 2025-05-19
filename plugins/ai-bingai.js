import fetch from 'node-fetch';

let userQueries = {};
let userTimeouts = {};

const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 jam dalam milidetik

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) throw `Gunakan format:\n${usedPrefix + command} <pertanyaan>\n\nContoh:\n${usedPrefix + command} Apa itu AI?`;
  
  conn.sendMessage(m.chat, { react: { text: '🕑', key: m.key } });

  try {
    if (userQueries[m.sender]) {
      text = `${userQueries[m.sender]}\n${text}`;
    }

    let url = `https://loco.web.id/wp-content/uploads/api/v1/bingai.php?q=${encodeURIComponent(text)}&lang=id`;
    let response = await fetch(url);

    if (!response.ok) throw 'Gagal menghubungi API. Silakan coba lagi nanti.';

    let json = await response.json();

    if (!json.status || !json.result || !json.result.ai_response) {
      throw 'Maaf, tidak ada hasil yang relevan untuk pertanyaan Anda.';
    }

    let aiResponse = json.result.ai_response.trim().replace(/\*\*/g, '*');
    let searchResults = json.result.search_results || [];
    let firstResult = searchResults[0];
    let searchSummary = '';

    if (firstResult) {
      searchSummary = `*Search Results:*\n[Link](${firstResult.url})`;
    }

    userQueries[m.sender] = text;

    if (userTimeouts[m.sender]) clearTimeout(userTimeouts[m.sender]);
    userTimeouts[m.sender] = setTimeout(() => {
      delete userQueries[m.sender];
      delete userTimeouts[m.sender];
      console.log(`Sesi pengguna ${m.sender} dihapus karena tidak ada aktivitas.`);
    }, SESSION_TIMEOUT);

    let resultMessage = firstResult 
      ? `${aiResponse}\n\n${searchSummary}` 
      : aiResponse;

    const bing = await m.reply(resultMessage);
    await conn.sendMessage(m.chat, { react: { text: null, key: m.key } });
    await conn.sendMessage(m.chat, { react: { text: '✨', key: bing.key } });

  } catch (err) {
    console.error(err);
    m.reply('Terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi nanti.');
  }
};

handler.help = ['bingai'];
handler.tags = ['ai'];
handler.command = /^(bingai)$/i;
handler.limit = 1;
handler.register = true;

export default handler;