import axios from 'axios';
import yts from 'yt-search';

const SaveTube = {
  qualities: {
    video: { 3: '480' },
  },

  headers: {
    'accept': '*/*',
    'referer': 'https://ytshorts.savetube.me/',
    'origin': 'https://ytshorts.savetube.me/',
    'user-agent': 'Postify/1.0.0',
    'Content-Type': 'application/json',
  },

  cdn() {
    return Math.floor(Math.random() * 11) + 51;
  },

  async fetchData(url, cdn, body = {}) {
    const headers = {
      ...this.headers,
      'authority': `cdn${cdn}.savetube.su`,
    };

    try {
      const response = await axios.post(url, body, { headers });
      return response.data;
    } catch (error) {
      throw new Error('❌ Gagal menghubungi server.');
    }
  },

  async dl(link) {
    const quality = this.qualities.video[3];
    const cdnNumber = this.cdn();
    const cdnUrl = `cdn${cdnNumber}.savetube.su`;

    const videoInfo = await this.fetchData(`https://${cdnUrl}/info`, cdnNumber, { url: link });
    if (!videoInfo?.data?.key) {
      throw new Error('❌ Video tidak valid atau tidak ditemukan.');
    }

    const downloadBody = {
      downloadType: 'video',
      quality,
      key: videoInfo.data.key,
    };

    const dlRes = await this.fetchData(`https://${cdnUrl}/download`, cdnNumber, downloadBody);
    if (!dlRes?.data?.downloadUrl) {
      throw new Error('❌ Gagal mendapatkan tautan unduhan.');
    }

    return {
      link: dlRes.data.downloadUrl,
      duration: videoInfo.data.duration,
      durationLabel: videoInfo.data.durationLabel,
      thumbnail: videoInfo.data.thumbnail,
      title: videoInfo.data.title,
      uploadDate: videoInfo.data.uploadDate,
      description: videoInfo.data.description,
    };
  },
};

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('Harap masukkan kata kunci pencarian.');

  await conn.sendMessage(m.chat, { react: { text: '⏰', key: m.key } });

  try {
    const searchResults = await yts(text);
    const videos = searchResults.videos;
    if (!videos.length) return m.reply('❌ Tidak ada video ditemukan.');

    const selectedVideo = videos[0];
    const result = await SaveTube.dl(selectedVideo.url);

    await conn.sendMessage(
      m.chat,
      {
        document: { url: result.link },
        mimetype: 'video/mp4',
        fileName: `${result.title}.mp4`,
        caption: `🎥 *Judul:* ${result.title}\n⏳ *Durasi:* ${result.durationLabel}`,
      },
      { quoted: m }
    );

    await conn.sendMessage(m.chat, { react: { text: null, key: m.key } });
  } catch (error) {
    await conn.sendMessage(m.chat, { react: { text: null, key: m.key } });
    m.reply(error.message || 'Terjadi kesalahan saat mengunduh video.');
  }
};

handler.help = ['playvideo'];
handler.tags = ['downloader'];
handler.command = /^(playvideo)$/i;
handler.limit = 5;
handler.register = true;

export default handler;