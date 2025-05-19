import axios from 'axios';
import qs from 'qs';
import cheerio from 'cheerio';

const fdown = {
  getToken: async () => {
    try {
      const response = await axios.get('https://fdown.net', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8',
          'Accept-Language': 'id-ID',
          'Upgrade-Insecure-Requests': '1',
        }
      });
      const html = response.data;
      const $ = cheerio.load(html);
      const token_v = $('input[name="token_v"]').val();
      const token_c = $('input[name="token_c"]').val();
      const token_h = $('input[name="token_h"]').val();

      return { token_v, token_c, token_h };
    } catch (error) {
      throw new Error(`Error fetching tokens: ${error.message}`);
    }
  },

  request: async (url) => {
    const { token_v, token_c, token_h } = await fdown.getToken();
    const data = qs.stringify({
      'URLz': url,
      'token_v': token_v,
      'token_c': token_c,
      'token_h': token_h
    });

    const config = {
      method: 'POST',
      url: 'https://fdown.net/download.php',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8',
        'Content-Type': 'application/x-www-form-urlencoded',
        'accept-language': 'id-ID',
        'referer': 'https://fdown.net/',
      },
      data: data
    };
    const api = await axios.request(config);
    return api.data;
  },

  download: async (url) => {
    const data = await fdown.request(url);
    const $ = cheerio.load(data);
    const videoDetails = $('#result .lib-item').map((i, el) => {
      const normalQualityLink = $('#sdlink').attr('href');
      const hdQualityLink = $('#hdlink').attr('href');
      return {
        normalQualityLink,
        hdQualityLink
      };
    }).get();

    return videoDetails;
  }
};

export default fdown;