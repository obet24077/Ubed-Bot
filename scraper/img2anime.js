import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function img2anime(imageUrl) {
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const mimeType = imageResponse.headers['content-type'];
    const base64Image = Buffer.from(imageResponse.data).toString('base64');
    const base64ImageUrl = `data:${mimeType};base64,${base64Image}`;
    const data = JSON.stringify({ image: base64ImageUrl });
    const config = {
        method: 'POST',
        url: 'https://www.drawever.com/api/tools/process',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'accept-language': 'id-ID',
            referer: 'https://www.drawever.com/ai/photo-to-anime?start=1736212737985',
            path: '/ai/photo-to-anime',
            origin: 'https://www.drawever.com',
            'alt-used': 'www.drawever.com',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            priority: 'u=0',
            te: 'trailers',
            Cookie: '_ga_H15YQYJC6R=GS1.1.1736212732.1.0.1736212732.0.0.0; _ga=GA1.1.1471909988.1736212732',
        },
        data,
    };
    const api = await axios.request(config);
    const images = api.data;
    const savedPaths = [];
    images.forEach((base64Image) => {
        const matches = base64Image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
            const fileType = matches[1];
            const base64Data = matches[2];
            const fileExtension = fileType.split('/')[1];
            const fileName = `${uuidv4()}.${fileExtension}`;
            const filePath = path.join(process.cwd(), 'tmp', fileName);
            fs.writeFileSync(filePath, base64Data, 'base64');
            savedPaths.push(filePath);
        }
    });
    return savedPaths;
}