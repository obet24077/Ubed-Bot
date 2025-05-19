import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  if (!text) throw 'Tolong kirimkan link terabox!';

  // Kirim reaksi emoji saat memproses
  await conn.sendMessage(m.chat, { react: { text: '🍏', key: m.key } });

  try {
    // Ambil URL dari pesan
    const url = text;

    // Request ke API
    const res = await fetch(`https://api.ubed.my.id/download/terabox?apikey=ubed2407&url=${encodeURIComponent(url)}`);
    const json = await res.json();

    // Cek apakah status API 200 dan data tersedia
    if (json.status === 200 && json.result && json.result.length > 0) {
      const downloadUrl = json.result[0].downloadUrl;
      await conn.sendMessage(m.chat, { text: `Download link: ${downloadUrl}` }, { quoted: m });
    } else {
      throw 'Tidak dapat menemukan data download.';
    }
  } catch (e) {
    console.error(e);
    await conn.sendMessage(m.chat, { text: '❌ Terjadi kesalahan saat memproses permintaan.' }, { quoted: m });
  }
};

handler.command = /^terabox$/i;
handler.tags = ["downloader"];
export default handler;