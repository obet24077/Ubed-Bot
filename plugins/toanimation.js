import fetch from 'node-fetch';
import FormData from 'form-data';
import { fileTypeFromBuffer } from 'file-type';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let style = args[0];
  if (!style) {
    return m.reply(`*Contoh penggunaan:*\n${usedPrefix + command} Gothic\n\n*Style yang tersedia:*\n- 20: Crayon\n- 21: Ink Stains\n- 22: Simple Drawing\n- 23: Witty\n- 24: Tinies\n- 25: Grumpy 3D\n- 26: 90s Shoujo Manga\n- 29: Gothic\n- 32: Vector\n- 33: Comic Book\n- 35: Felted Doll\n- 36: Wojak\n- 37: Illustration\n- 38: Mini\n- 39: Clay\n- 40: 3D\n- 41: Ink Painting\n- 42: Color Rough`);
  }

  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  if (!mime.startsWith('image/')) return m.reply('Balas gambar dengan caption *.toanimation Gothic*');

  await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

  let img = await q.download();

  // Upload ke Catbox
  let catboxUrl = await uploadCatbox(img);
  if (!catboxUrl || !catboxUrl.startsWith('https://')) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    return m.reply('Gagal upload ke Catbox.');
  }

  let apiUrl = `https://fastrestapis.fasturl.cloud/imgedit/toanimation?imageUrl=${encodeURIComponent(catboxUrl)}&style=${style}`;
  let res = await fetch(apiUrl, { headers: { accept: 'image/png' } });

  if (!res.ok) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    return m.reply(`Gagal mengubah ke animasi.\nPastikan *style* valid!\n\nGunakan: *${usedPrefix + command} Gothic*`);
  }

  let buffer = await res.buffer();
  await conn.sendMessage(m.chat, { image: buffer, caption: `Selesai dengan style: *${style}*` }, { quoted: m });
  await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
};

handler.command = /^toanimation$/i;
handler.help = ['toanimation'];
handler.tags = ['tools'];
handler.limit = true;

export default handler;

// ESM-compatible Catbox upload
async function uploadCatbox(buffer) {
  let type = await fileTypeFromBuffer(buffer) || { ext: 'png', mime: 'image/png' };
  let form = new FormData();
  form.append('reqtype', 'fileupload');
  form.append('fileToUpload', buffer, {
    filename: `file.${type.ext}`,
    contentType: type.mime
  });

  let res = await fetch('https://catbox.moe/user/api.php', {
    method: 'POST',
    body: form,
    headers: form.getHeaders()
  });

  let text = await res.text();
  return text;
}