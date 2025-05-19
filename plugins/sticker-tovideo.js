import fetch from 'node-fetch';
import { FormData, Blob } from 'formdata-node';
import { JSDOM } from 'jsdom';

let handler = async (m, { conn, usedPrefix, command }) => {
    const notStickerMessage = `✳️ Balas stiker dengan perintah:\n\n*${usedPrefix + command}*`;
    if (!m.quoted) throw notStickerMessage;

    const q = m.quoted;
    let mime = q.mimetype || q.mediaType || '';
    if (!/webp/.test(mime)) throw notStickerMessage;

    if (conn.sendMessage) await conn.sendMessage(m.chat, { react: { text: '🍏', key: m.key } });

    try {
        let media = await q.download();
        let out = await webp2mp4(media);

        await conn.sendMessage(m.chat, {
            video: { url: out },
            caption: '✅ Stiker berhasil diubah ke video.'
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        throw '❌ Gagal mengubah stiker ke video.';
    }
};

handler.help = ['tovideo (balas stiker)'];
handler.tags = ['sticker'];
handler.command = /^(tovideo|tomp4)$/i;
handler.limit = true;

export default handler;

// ==============================
// Fungsi convert webp ke mp4
// ==============================

async function webp2mp4(source) {
  let form = new FormData();
  let isUrl = typeof source === 'string' && /https?:\/\//.test(source);
  const blob = !isUrl && new Blob([source.toArrayBuffer()]);
  form.append('new-image-url', isUrl ? blob : '');
  form.append('new-image', isUrl ? '' : blob, 'image.webp');

  let res = await fetch('https://ezgif.com/webp-to-mp4', {
    method: 'POST',
    body: form
  });
  let html = await res.text();
  let { document } = new JSDOM(html).window;

  let form2 = new FormData();
  let obj = {};
  for (let input of document.querySelectorAll('form input[name]')) {
    obj[input.name] = input.value;
    form2.append(input.name, input.value);
  }

  let res2 = await fetch('https://ezgif.com/webp-to-mp4/' + obj.file, {
    method: 'POST',
    body: form2
  });
  let html2 = await res2.text();
  let { document: document2 } = new JSDOM(html2).window;
  return new URL(document2.querySelector('div#output > p.outfile > video > source').src, res2.url).toString();
}