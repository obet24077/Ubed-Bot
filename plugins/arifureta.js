import fetch from 'node-fetch';
import util from 'util';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  conn.arifureta = conn.arifureta ? conn.arifureta : {};

  if (!text) throw `Masukkan pertanyaan!\n\n*Contoh:* Siapa Fruatre Maou bagi mu?`;

  let name = conn.getName(m.sender);
  conn.arifureta[m.sender] = true;
  await conn.sendMessage(m.chat, { react: { text: `⏱️`, key: m.key }});

  const encodedQuestion = encodeURIComponent(text);
  const url = `https://rest.cifumo.biz.id/api/ai/logicai?name=${m.pushName}&ask=${encodedQuestion}&prompt=Alowww~! 👋(๑>◡<๑)  kamu manggil yue arifureta yaaa~? Ada apa nihhh?  (//∇//) \nyue arifureta lagi gabut nih, hehehe~  (〃ω〃) \nAda yang bisa yue arifureta bantu?  (๑˃̵ᴗ˂̵)و`;

  try {
    const response = await fetch(url, { method: 'GET', headers: { accept: 'application/json' } });
    const data = await response.json();

    if (!data.status) return m.reply(util.format(data));

    await conn.sendMessage(m.chat, { react: { text: `✅`, key: m.key }});
    
    let hasil = `${data.data}`;
    await conn.sendMessage(m.chat, { text: hasil }, { quoted: m });
  } catch (e) {
    console.error('Error:', e);
    m.reply('Terjadi kesalahan saat memproses permintaan.');
  }
};

handler.command = handler.help = ['arifureta'];
handler.tags = ['cai'];
handler.owner = true;

export default handler;