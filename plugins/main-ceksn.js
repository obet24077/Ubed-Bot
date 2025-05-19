import { createHash } from 'crypto';

let handler = async function (m, { conn }) {
  let sn = createHash('md5').update(m.sender).digest('hex');
  let botName = global.namebot || "YourBotName";
  let mentionedJid = [m.sender]

  // Get the current date
  let date = new Date().toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Create a URL link for SN
  let snUrl = `https://pontaceksn.com/sn/${sn}`;

  // Send message with formatted tag, date, and SN as clickable URL
  let ceksn = `📌 *Tag:* @${m.sender.replace(/@.+/, '')}
📅 *Date:* ${date}

🔑 *SN Anda:* ${snUrl}

> *contoh:*  .unreg https://pontaceksn.com/sn/xxxxxx

🤖 *Bot:* ${botName}`;
  
  conn.sendMessage(m.key.remoteJid, {
  text: ceksn, 
  footer: "Pesan Ini Dibuat Oleh AI",
  buttons: [
    { buttonId: `.unreg ${snUrl}`, buttonText: { displayText: 'Auto Unreg' }, type: 1 }
  ],
  headerType: 4,
  viewOnce: true,
  mentions: mentionedJid
}, { quoted: floc })
};

handler.help = ['ceksn'];
handler.tags = ['main'];
handler.command = /^(ceksn)$/i;
handler.register = true;

export default handler;