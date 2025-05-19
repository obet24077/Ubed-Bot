import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs/promises';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    if (!mime) throw `❌ Kirim audio dengan caption *${usedPrefix}${command}* atau reply audio dengan *${usedPrefix}${command}*`;
    if (!/audio\/(mp3|mpeg|ogg|opus|wav|webm)/.test(mime.toLowerCase())) throw `❌ File yang kamu kirim bukan audio atau format tidak didukung!`;

    await conn.sendMessage(m.chat, { react: { text: '🎧', key: m.key } });

    // Unduh audio sebagai buffer
    const audioBuffer = await q.download();
    if (!audioBuffer) throw `❌ Gagal mengunduh audio.`;

    // Buat folder tmp kalau belum ada
    await fs.mkdir('./tmp', { recursive: true });

    const tempInputPath = path.join('./tmp', `input_${Date.now()}.${mime.includes('ogg') ? 'ogg' : mime.includes('wav') ? 'wav' : 'audio'}`);
    await fs.writeFile(tempInputPath, audioBuffer);

    const tempOutputPath = path.join('./tmp', `output_${Date.now()}.mp3`);

    // Convert ke MP3 dulu
    await new Promise((resolve, reject) => {
      ffmpeg(tempInputPath)
        .setFfmpegPath(ffmpegStatic)
        .noVideo()
        .audioCodec('libmp3lame')
        .format('mp3')
        .output(tempOutputPath)
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .run();
    });

    const mp3Buffer = await fs.readFile(tempOutputPath);

    // Upload ke Catbox
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', mp3Buffer, 'audio.mp3');

    const catboxRes = await axios.post('https://catbox.moe/user/api.php', form, {
      headers: form.getHeaders(),
    });

    const catboxUrl = catboxRes.data;
    if (typeof catboxUrl !== 'string' || !catboxUrl.includes('catbox.moe')) {
      throw new Error('Gagal upload ke Catbox.');
    }

    // Bersihkan file sementara
    await fs.unlink(tempInputPath).catch(() => {});
    await fs.unlink(tempOutputPath).catch(() => {});

    // Panggil API Maelyn untuk analisis
    const apiUrl = `https://api.maelyn.tech/api/gemini/audio?q=jadiin%20text%20lagu%20ini&url=${encodeURIComponent(catboxUrl)}&apikey=ubed2407`;
    const { data } = await axios.get(apiUrl);

    if (data.status !== 'Success' || !data.result) {
      throw new Error('Gagal menganalisis audio.');
    }

    await conn.sendMessage(
      m.chat,
      {
        text: `🎶 Berikut hasil analisis audio:\n\n${data.result}`,
      },
      { quoted: m }
    );

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (err) {
    console.error(err);
    const msg = err?.message || JSON.stringify(err);
    await conn.reply(m.chat, `❌ Terjadi kesalahan saat memproses audio.\n\n🪵 *Log:* ${msg}`, m);
  }
};

handler.help = ['aiaudio'];
handler.tags = ['ai'];
handler.command = /^(aiaudio)$/i;
handler.limit = 3;
handler.register = true;
handler.premium = false;

export default handler;