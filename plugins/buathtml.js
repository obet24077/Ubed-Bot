import fs from 'fs';
import path from 'path';

let handler = async (m, { command, text }) => {
  try {
    // Pastikan ada input
    if (!text) {
      return m.reply("❌ *Harap berikan nama website dan kode plugin, contoh: .createwebsite MySite | <kode_plugin>*");
    }

    // Pisahkan nama website dan kode plugin
    const [websiteName, pluginCode] = text.split(" | ");
    if (!websiteName || !pluginCode) {
      return m.reply("❌ *Format salah! Harap gunakan format: .createwebsite <nama_website> | <kode_plugin>*");
    }

    // Tentukan path untuk menyimpan website menggunakan cwd() untuk path yang lebih fleksibel
    const websiteDir = path.join(process.cwd(), `./tmp/${websiteName}`);
    console.log(`Membuat direktori: ${websiteDir}`);

    // Pastikan direktori ada
    if (!fs.existsSync(websiteDir)) {
      fs.mkdirSync(websiteDir, { recursive: true });
      console.log(`Direktori ${websiteDir} berhasil dibuat.`);
    }

    // Membuat HTML
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${websiteName}</title>
          <style>
              body { font-family: sans-serif; background: #f4f4f4; padding: 20px; }
              h1 { color: #333; }
              pre { background-color: #282828; color: #f5f5f5; padding: 15px; border-radius: 5px; }
              code { display: block; font-size: 14px; white-space: pre-wrap; word-wrap: break-word; }
          </style>
      </head>
      <body>
          <h1>Website ${websiteName}</h1>
          <h2>Plugin Code:</h2>
          <pre><code>${pluginCode}</code></pre>
      </body>
      </html>
    `;

    // Tentukan path file HTML
    const htmlFilePath = path.join(websiteDir, 'index.html');
    console.log(`Menyimpan file HTML di: ${htmlFilePath}`);

    // Menyimpan file HTML
    fs.writeFileSync(htmlFilePath, htmlContent);

    // Kirimkan file HTML ke pengguna dengan instruksi membuka di browser
    await conn.sendMessage(m.chat, {
      document: fs.readFileSync(htmlFilePath),
      fileName: `${websiteName}.html`,
      mimetype: "application/octet-stream",
    }, { quoted: m });

    // Konfirmasi ke pengguna dengan instruksi membuka file di browser
    m.reply(`✅ *Website "${websiteName}" berhasil dibuat! File HTML telah dikirimkan.*\n\n*Silakan buka file HTML tersebut di browser (misalnya Chrome) untuk melihat hasilnya.*`);
  } catch (e) {
    console.error("Kesalahan dalam pembuatan website:", e);
    m.reply(`❌ *Terjadi kesalahan saat membuat website: ${e.message}*`);
  }
};

handler.help = ['createwebsite <nama_website> | <kode_plugin>'];
handler.tags = ['owner'];
handler.command = /^buathtml$/i;
handler.owner = true;

export default handler;