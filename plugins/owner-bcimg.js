import uploadImage from '../lib/uploadImage.js';

let handler = async (m, { conn, usedPrefix, command, text }) => {
  const fkontak = {
    "key": {
      "participants": "0@s.whatsapp.net",
      "remoteJid": "status@broadcast",
      "fromMe": false,
      "id": "Halo"
    },
    "message": {
      "contactMessage": {
        "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      }
    },
    "participant": "0@s.whatsapp.net"
  };

  const q = m.quoted ? m.quoted : m;
  const mime = (q.msg || q).mimetype || q.mediaType || "";

  if (!mime) {
    return conn.reply(m.chat, `Example: reply/send image with caption *${usedPrefix + command}*`, m);
  }

  let image = await uploadImage(await q.download());
  let groups = Object.entries(await conn.chats)
    .filter(([id, chat]) => id.endsWith('@g.us') && chat.isChats)
    .map(([id]) => id);
  
  conn.reply(m.chat, `_Mengirim pesan broadcast ke ${groups.length} grup_`, m);

  for (let id of groups) {
    await sleep(5000);
    conn.sendFile(id, image, '', text.trim(), fkontak);
  }

  conn.reply(m.chat, 'Broadcast ke grup selesai, Senpai!', m);
};

handler.help = ['broadcastimg', 'bcimg'].map(v => v + ' <teks>');
handler.tags = ['owner'];
handler.command = /^(broadcastimg|bcimg)$/i;
handler.owner = true;

export default handler;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}