import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const talkNotes = {
  transcribe: async (audioPath) => {
    try {
      const formData = new FormData();
      const fileStream = fs.createReadStream(audioPath);
      const fileName = path.basename(audioPath);
      
      formData.append('file', fileStream, {
        filename: fileName,
        contentType: 'audio/mpeg'
      });
      const config = {
        headers: {
          ...formData.getHeaders(),
          'authority': 'api.talknotes.io',
          'accept': '*/*',
          'accept-encoding': 'gzip, deflate, br',
          'origin': 'https://talknotes.io',
          'referer': 'https://talknotes.io/',
          'User-Agent': 'Postify/1.0.0'
        },
        maxBodyLength: Infinity
      };
      const response = await axios.post(
        'https://api.talknotes.io/tools/converter',
        formData,
        config
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(`${error.response.status}: ${error.response.data}`);
      } else if (error.request) {
        throw new Error('Ya begitulah... kagak ada response dari sononyaa 😂');
      } else {
        throw new Error(error.message);
      }
    }
  }
};

export { talkNotes };