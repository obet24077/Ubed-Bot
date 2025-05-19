import fetch from 'node-fetch';

// Fungsi upload gambar menggunakan Catbox
const uploadImage = async (img) => {
  const formData = new FormData();
  formData.append('file', img);
  
  const response = await fetch('https://catbox.moe/user/api.php', {
    method: 'POST',
    body: formData,
  });

  const result = await response.text();
  if (result.includes('https://')) {
    return result;  // URL gambar yang di-upload
  } else {
    throw new Error('Upload gagal');
  }
};

const handler = async (m, { conn, usedPrefix, command }) => {
  try {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || q.mediaType || '';
    
    if (/^image/.test(mime) && !/webp/.test(mime)) {
      const img = await q.download();
      const out = await uploadImage(img);  // Upload ke Catbox
      conn.sendFile(m.chat, out, null, wm, m);  // Kirim gambar yang sudah di-upload
    } else {
      m.reply(`Kirim gambar dengan caption *${usedPrefix + command}* atau tag gambar yang sudah dikirim.`);
    }
  } catch (e) {
    console.error(e);
    m.reply(`Identifikasi gagal. Silakan coba lagi.`);
  }
};

handler.help = ['remini2'];
handler.tags = ['tools'];
handler.command = ['remini2'];
handler.premium = false;
handler.limit = false;

export default handler;