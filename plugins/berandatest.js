import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import FormData from 'form-data';

const handler = async (m, { conn }) => {
  const fileName = 'beranda.html';
  const filePath = path.resolve('./tmp', fileName);

  // Buat isi file HTML
  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Ubed Media</title></head>
<body style="font-family:sans-serif;text-align:center">
  <h1>Halo dari WhatsApp Bot!</h1>
  <p>Website ini diupload otomatis lewat bot.</p>
</body></html>`;

  fs.mkdirSync('./tmp', { recursive: true });
  fs.writeFileSync(filePath, html);

  // Pakai API Key sebagai Bearer Token
  const apiKey = 'bca0d4243deaca709474f3a6cf777d34';

  const form = new FormData();
  form.append('file', fs.createReadStream(filePath), fileName);

  const res = await fetch('https://neocities.org/api/upload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      ...form.getHeaders()
    },
    body: form
  });

  const json = await res.json();
  if (!json.success) return m.reply(`Gagal upload ke Neocities:\n${JSON.stringify(json, null, 2)}`);

  await conn.sendMessage(m.chat, {
    text: `Berhasil upload ke Neocities!\nCek di: https://ubedmedia.neocities.org/${fileName}`,
  }, { quoted: m });
};

handler.command = /^berandatest$/i;
export default handler;