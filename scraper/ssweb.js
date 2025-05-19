import axios from 'axios';
import { JSDOM } from 'jsdom';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs/promises';
import path from 'path';
import FormData from 'form-data';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ssmachine = {
  api: {
    base: "https://www.screenshotmachine.com",
    ocr: "https://www.cardscanner.co", 
    catbox: "https://catbox.moe/user/api.php",
    dimensions: {
      desktop: '1024x768',
      phone: '480x800',
      tablet: '800x1280',
      laptop: '1366x768', 
      hd: '1920x1080',
      ultrawide: '2560x1080',
      '4k': '3840x2160'
    }
  },

  dom: new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: "https://www.screenshotmachine.com",
    referrer: "https://www.screenshotmachine.com", 
    contentType: 'text/html',
    includeNodeLocations: true,
    storageQuota: 10000000
  }),

  window: null,
  document: null,
  cookie: null,
  token: null,
  tokenExpiry: null,
  csrfCookie: null,
  sessionCookie: null,

  headers: {
    'accept': '*/*',
    'accept-language': 'id-MM,id;q=0.9',
    'cache-control': 'no-cache',
    'user-agent': 'Postify/1.0.0'
  },

  getDimension: (device) => {
    return ssmachine.api.dimensions[device.toLowerCase()] || ssmachine.api.dimensions.desktop;
  },

  tokai: async (forceRefresh = false) => {
    try {
      if (!forceRefresh && ssmachine.token && ssmachine.tokenExpiry && Date.now() < ssmachine.tokenExpiry) {
        return ssmachine.token;
      }

      const res = await axios.get(ssmachine.api.ocr, {
        headers: ssmachine.headers
      });

      const cookies = res.headers['set-cookie'];
      if (cookies) {
        for (const cookie of cookies) {
          if (cookie.includes('XSRF-TOKEN=')) {
            ssmachine.csrfCookie = cookie.split(';')[0];
          }
          if (cookie.includes('laravel_session=')) {
            ssmachine.sessionCookie = cookie.split(';')[0];
          }
        }
      }

      const response = await axios.get(`${ssmachine.api.ocr}/image-to-text`, {
        headers: {
          ...ssmachine.headers,
          'Cookie': `${ssmachine.csrfCookie}; ${ssmachine.sessionCookie}`
        }
      });

      const $ = cheerio.load(response.data);
      const token = $('input[name="_token"]').val();

      if (!token) {
        throw new Error('Tokennya kagak ada bree 🤫');
      }

      ssmachine.token = token;
      ssmachine.tokenExpiry = Date.now() + (4 * 60 * 1000);
      return token;

    } catch (error) {
      throw new Error(`Error: ${error.message}`);
    }
  },

  getHeaders: (type = 'json') => {
    const headers = {
      ...ssmachine.headers,
      'referer': `${ssmachine.api.base}/`
    };

    if (ssmachine.cookie) {
      headers.cookie = `${ssmachine.cookie}; homepage-tab=screenshot`;
    }

    if (type === 'image') {
      headers.accept = 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8';
      headers['sec-fetch-dest'] = 'image';
      headers['sec-fetch-mode'] = 'no-cors';
    } else {
      headers.accept = '*/*';
      headers['content-type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
      headers['sec-fetch-dest'] = 'empty';
      headers['sec-fetch-mode'] = 'cors';
    }

    return headers;
  },

  updateCookie: (headers) => {
    const cookies = headers['set-cookie'];
    if (cookies) {
      const phpSession = cookies.find(c => c.startsWith('PHPSESSID='));
      if (phpSession) {
        ssmachine.cookie = phpSession.split(';')[0];
      }
    }
  },

  saveCaptcha: async (baper) => {
  try {
    const downloadDir = path.join(process.cwd(), 'tmp');
    await fs.mkdir(downloadDir, { recursive: true });
    const filename = `captcha_${Date.now()}.png`;
    const filepath = path.join(downloadDir, filename);
    await fs.writeFile(filepath, baper);
    return { filepath, filename };
  } catch (error) {
    throw error;
  }
},

  upload2Catbox: async (baper, filename) => {
    try {
      const formData = new FormData();
      formData.append('reqtype', 'fileupload');
      formData.append('fileToUpload', baper, filename);

      const response = await axios.post(ssmachine.api.catbox, formData, {
        headers: formData.getHeaders()
      });

      return response.data;
    } catch (error) {
      throw new Error(`Error : ${error.message}`);
    }
  },

  ocrna: async (baper, filename, retryCount = 0) => {
    try {
      const token = await ssmachine.tokai(retryCount > 0);
      
      const formData = new FormData();
      formData.append('_token', token);
      formData.append('imgsData', '');
      formData.append('captcha_token', '');
      formData.append('urlLabel', '');
      formData.append('urlLabel', '');
      formData.append('images[]', '');
      formData.append('images[]', baper, filename);
      formData.append('name', `cardscanner.co_${filename}`);
      formData.append('tool', 'image-to-text');

      const up = await axios.post(`${ssmachine.api.ocr}/uploadImage`, formData, {
        headers: {
          ...formData.getHeaders(),
          'Cookie': `${ssmachine.csrfCookie}; ${ssmachine.sessionCookie}`,
          'Origin': ssmachine.api.ocr,
          'Referer': `${ssmachine.api.ocr}/image-to-text`,
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (!up.data.path) {
        throw new Error('Gagal upload gambarnya bree 😎');
      }

      const read = await axios.post(`${ssmachine.api.ocr}/imageread`,
        new URLSearchParams({
          'imgsData': up.data.path,
          'zipName': 'm8e1vfqswixt1',
          '_token': token,
          'tool': 'image-to-text'
        }).toString(),
        {
          headers: {
            ...ssmachine.headers,
            'Cookie': `${ssmachine.csrfCookie}; ${ssmachine.sessionCookie}`,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Origin': ssmachine.api.ocr,
            'Referer': `${ssmachine.api.ocr}/image-to-text`,
            'X-Requested-With': 'XMLHttpRequest'
          }
        }
      );

      return read.data.text.trim();

    } catch (error) {
      if (error.response?.status === 419 && retryCount < 3) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return ssmachine.ocrna(baper, filename, retryCount + 1);
      }
      throw error;
    }
  },

  getCaptcha: async () => {
    try {
      const agak = await axios.get(ssmachine.api.base, {
        headers: ssmachine.getHeaders()
      });
      ssmachine.updateCookie(agak.headers);

      const response = await axios.get(`${ssmachine.api.base}/simple-php-captcha.php?_CAPTCHA&t=${Date.now()}`, {
        headers: {
          ...ssmachine.getHeaders('image'),
          'x-requested-with': 'XMLHttpRequest'
        },
        responseType: 'arraybuffer'
      });

      ssmachine.updateCookie(response.headers);
      const { filepath, filename } = await ssmachine.saveCaptcha(response.data);
      const recognizedText = await ssmachine.ocrna(response.data, filename);

      return {
        success: true,
        text: recognizedText,
        filepath: filepath
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  capture: async (url, options = {}) => {
    try {
      if (!url || url.trim() === '') {
        return {
          status: false,
          code: 400,
          result: {
            error: "Lu mau ngess web kan? link webnya mana? Gitu doang kudu di kasih tau mulu... "
          }
        };
      }

      try {
        new URL(url);
      } catch (e) {
        return {
          status: false, 
          code: 400,
          result: {
            error: "Yaelah, basic url aja kagak tau lu 🗿 chuaaak..."
          }
        };
      }

      const validDevices = Object.keys(ssmachine.api.dimensions);
      const device = (options.device || 'desktop').toLowerCase();

      if (!validDevices.includes(device)) {
        return {
          status: false,
          code: 400,
          result: {
            error: "Type Devicenya kagak valid bree, input yang pasti2 dah 🗿",
            valid_devices: validDevices
          }
        };
      }

      const dimension = ssmachine.getDimension(device);

      const def = {
        device: device,
        dimension: dimension,
        format: 'png',
        cacheLimit: 0,
        delay: 200,
        timeout: 20000
      };

      const settings = { ...def, ...options };

      const caper = await ssmachine.getCaptcha();
      if (!caper.success) {
        return {
          status: false,
          code: 400,
          result: {
            error: caper.error
          }
        };
      }

      const formData = new URLSearchParams();
      formData.append('url', url);
      formData.append('device', settings.device);
      formData.append('dimension', settings.dimension);
      formData.append('format', settings.format);
      formData.append('cacheLimit', settings.cacheLimit);
      formData.append('delay', settings.delay);
      formData.append('timeout', settings.timeout);
      formData.append('captcha', caper.text);

      const response = await axios.post(`${ssmachine.api.base}/capture.php`, formData, {
        headers: {
          ...ssmachine.getHeaders(),
          'x-requested-with': 'XMLHttpRequest'
        }
      });

      if (response.data.status === 'success') {
        const imageUrl = `${ssmachine.api.base}/serve.php?file=result&t=${Date.now()}`;
        const imageResponse = await axios.get(imageUrl, {
          headers: ssmachine.getHeaders('image'),
          responseType: 'arraybuffer'
        });

        const filename = `screenshot_${Date.now()}.png`;
        const ketbok = await ssmachine.upload2Catbox(imageResponse.data, filename);

        return {
          status: true,
          code: 200,
          result: {
            url: ketbok,
            device: settings.device,
            dimension: settings.dimension
          }
        };
      }

      return {
        status: false,
        code: 400,
        result: {
          error: response.data.message || 'Screenshotnya gagal bree 🤣'
        }
      };

    } catch (error) {
      return {
        status: false,
        code: error.response?.status || 500,
        result: {
          error: error.message
        }
      };
    }
  }
};

ssmachine.window = ssmachine.dom.window;
ssmachine.document = ssmachine.window.document;

export { ssmachine };