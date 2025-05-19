import fetch from 'node-fetch';

let handler = async (m, { text, conn, command }) => {
  if (!text) throw `Contoh penggunaan:\n.${command} https://pastebin.com/NC7Wj4bP`;

  // Kirim emoji reaksi saat memproses
  await conn.sendMessage(m.chat, {
    react: {
      text: '⏳',
      key: m.key
    }
  });

  try {
    const api = `https://fastrestapis.fasturl.cloud/downup/pastebindown?url=${encodeURIComponent(text)}`;
    const res = await fetch(api);
    if (!res.ok) throw 'Gagal menghubungi API';

    const json = await res.json();
    if (json.status !== 200 || !json.result) throw 'Gagal mendapatkan data Pastebin.';

    const result = json.result;
    const caption = `
*📄 Title:* ${result.title}
*🗣️ Author:* ${result.username}
*💬 Language:* ${result.language}
*📅 Date:* ${result.datePosted}
*👁️ Views:* ${result.viewCount}
*🔗 Raw:* ${result.rawLink}
*⬇️ Download:* ${result.downloadLink}
`.trim();

    await conn.sendFile(m.chat, Buffer.from(result.content), `${result.title}.${getExt(result.language)}`, caption, m);

    // Reaksi selesai
    await conn.sendMessage(m.chat, {
      react: {
        text: '✅',
        key: m.key
      }
    });
  } catch (e) {
    console.error(e);
    throw typeof e === 'string' ? e : 'Terjadi kesalahan saat memproses.';
  }
};

// Fungsi bantu konversi ekstensi berdasarkan bahasa
function getExt(language) {
  language = language.toLowerCase();
  if (language.includes('javascript')) return 'js';
  if (language.includes('python')) return 'py';
  if (language.includes('html')) return 'html';
  if (language.includes('css')) return 'css';
  if (language.includes('java')) return 'java';
  if (language.includes('php')) return 'php';
  if (language.includes('json')) return 'json';
  return 'txt'; // default
}

handler.command = /^pastebin(dl|down)$/i;
handler.help = ['pastebindl <url>'];
handler.tags = ['tools'];

export default handler;