// Scraper: Bagian ini bertanggung jawab untuk scraping
import axios from 'axios';

const searchThatSong = {
  detect: async function(lyric) {
    try {
      const response = await axios.post(
        'https://searchthatsong.com/',
        { data: lyric },
        {
          headers: {
            'Content-Type': 'text/plain',
            origin: 'https://searchthatsong.com',
            referer: 'https://searchthatsong.com/',
          }
        }
      );
      // Mengembalikan data hasil pencarian dari situs
      return response.data;
    } catch (error) {
      console.error('Terjadi kesalahan saat mencari lagu:', error);
      throw 'Gagal mencari lagu. Coba lagi nanti.';
    }
  }
};

export { searchThatSong };