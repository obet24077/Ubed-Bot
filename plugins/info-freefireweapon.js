import SenjataFreeFire from '../scraper/freefireweapon.js';

let handler = async (m, { conn }) => {
  const senjata = new SenjataFreeFire();
  const info = await senjata.Info();

  if (!info) {
    await conn.reply(m.chat, 'Maaf, terjadi kesalahan saat mengambil informasi senjata Free Fire.', m);
    return;
  }

  let message = `🔫 *Informasi Senjata Free Fire* 🔫\n\n`;
  info.forEach((senjata, index) => {
    message += `*${index + 1}. ${senjata.name}*\n`;
    message += `💥 *Damage:* ${senjata.damage}\n`;
    message += `📜 *Deskripsi:* ${senjata.description}\n`;
    message += `🏷️ *Tags:* ${senjata.tags.join(', ')}\n\n`;
  });

  await conn.reply(m.chat, message.trim(), m);
}

handler.help = ['freefireweapon'];
handler.tags = ['info'];
handler.command = /^(freefireweapon|ffweapon|weaponsff)$/i;

export default handler;