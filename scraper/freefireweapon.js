import axios from 'axios';
import cheerio from 'cheerio';

class SenjataFreeFire {
  async Info() {
    try {
      const response = await axios.get(`https://ff.garena.com/id/weapons/`);
      const $ = cheerio.load(response.data);

      const daftarSenjata = [];

      $('.weapon-card').each((index, element) => {
        const namaSenjata = $(element).find('.title-wrap span').text().trim();
        const damage = $(element).find('.damage-level').text().trim();
        const deskripsi = $(element).find('.abstract').text().trim();
        const tags = [];

        $(element).find('.tags-wrap .weapon-tag').each((i, tagElement) => {
          tags.push($(tagElement).text().trim());
        });

        daftarSenjata.push({
          name: namaSenjata,
          damage: damage,
          description: deskripsi,
          tags: tags,
        });
      });

      return daftarSenjata;
    } catch (error) {
      console.error("Error fetching Free Fire weapon information:", error);
      return null;
    }
  }
}

export default SenjataFreeFire;