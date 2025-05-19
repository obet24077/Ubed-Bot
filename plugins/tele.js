import fetch from "node-fetch";

async function downloadSticker(url, apikey) {
  const apiUrl = `https://api.botcahx.eu.org/api/dowloader/telesticker?url=${encodeURIComponent(url)}&apikey=${apikey}`;
  try {
    let response = await fetch(apiUrl);
    let data = await response.json();

    if (data.status === true && data.result && Array.isArray(data.result)) {
      return data.result.map(sticker => sticker.url);  // Mengambil URL stiker dari respons API
    } else {
      throw new Error("Tidak ada stiker yang ditemukan.");
    }
  } catch (error) {
    console.error("Error saat mengunduh stiker:", error);
    throw new Error("Gagal mengunduh stiker.");
  }
}

let handler = async (m, { conn, args }) => {
  const apikey = "ubed2407";  // API key

  if (args.length === 0) {
    return conn.reply(m.chat, "❌ Harap kirim URL stiker pack Telegram.", m);
  }

  let url = args[0];  
  let jumlah = args[1] ? parseInt(args[1]) : null;

  try {
    let stickerUrls = await downloadSticker(url, apikey);

    if (!stickerUrls || stickerUrls.length === 0) {
      return conn.reply(m.chat, "❌ Tidak ada stiker yang ditemukan di pack tersebut.", m);
    }

    if (!jumlah) {
      return conn.reply(m.chat, `📦 Pack ini memiliki ${stickerUrls.length} stiker.\n\n🔹 Ketik *${global.prefix}tele ${url} (jumlah)* untuk mengunduh sesuai jumlah yang diinginkan.`, m);
    }

    if (jumlah > stickerUrls.length) {
      return conn.reply(m.chat, `❌ Jumlah stiker yang diminta melebihi total stiker dalam pack (${stickerUrls.length}).`, m);
    }

    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

    // Kirim stiker sesuai jumlah yang diminta
    for (let i = 0; i < jumlah; i++) {
      await conn.sendMessage(m.chat, {
        sticker: { url: stickerUrls[i] },
        quoted: m
      });
      await new Promise(resolve => setTimeout(resolve, 2000)); // Jeda 2 detik antar stiker
    }

    await conn.reply(m.chat, `✔️ ${jumlah} stiker berhasil diunduh!`, m);
  } catch (error) {
    console.error(error);
    await conn.reply(m.chat, `❌ ${error.message}`, m);
  }
};

handler.help = ["telesticker"];
handler.tags = ["downloader"];
handler.command = /^(telesticker|tele)$/i;
handler.premium = true;

export default handler;