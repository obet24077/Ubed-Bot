import fetch from 'node-fetch';
import { format } from 'util';
import path from 'path';

global.API = (origin, pathname, searchParams, apiKey) => {
    let url = origin + pathname;
    if (Object.keys(searchParams).length > 0) {
        url += '?' + new URLSearchParams(searchParams).toString();
    }
    return url;
};

let handler = async (m, { text, conn, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`NOTE: You can use https:// or http:// or none (https:// and http://)
*You can download and view files shortened by services like shorturl.at/GHY58 or other short URLs (tinyurl, s.id, shorturl, etc.)* \n
You can download and display json, html, txt, image, pdf, etc. example: ${usedPrefix + command} Link/Url\n
|====================================|
${usedPrefix + command} shorturl.at/GHY58
${usedPrefix + command} si.ft.unmul.ac.id/modul_praktikum/8as0x4aConbSoi4lPy0D05PHemnX6x.pdf
${usedPrefix + command} cdn.i-joox.com/_next/static/chunks/130.9700ec051eee3adc4f5d.js
${usedPrefix + command} data.bmkg.go.id/DataMKG/TEWS/autogempa.json
${usedPrefix + command} tr.deployers.repl.co/robots.txt
${usedPrefix + command} tr.deployers.repl.co/sitemap.xml
${usedPrefix + command} api.duniagames.co.id/api/content/upload/file/7081780811647600895.png
${usedPrefix + command} medlineplus.gov/musclecramps.html
|====================================|\n
NOTE: There's much more, if there's an error, contact +${global.nomorown}
coded by https://github.com/Xnuvers007 [Xnuvers007]
`);
    }

    // Tambahkan reaksi emoji saat memproses
    let processing = await conn.sendMessage(m.chat, { react: { text: '🍏', key: m.key } });

    if (!/^https?:\/\//.test(text)) {
        text = 'http://' + text;
    }

    try {
        let _url = new URL(text);
        let url = global.API(_url.origin, _url.pathname, Object.fromEntries(_url.searchParams.entries()), 'APIKEY');

        let maxRedirects = 999999;
        let redirectCount = 0;
        let redirectUrl = url;

        while (redirectCount < maxRedirects) {
            let res = await fetch(redirectUrl);

            if (res.headers.get('content-length') > 100 * 1024 * 1024 * 1024) {
                res.body.destroy();
                throw `Content-Length: ${res.headers.get('content-length')}`;
            }

            const contentType = res.headers.get('content-type');
            let filename = path.basename(new URL(redirectUrl).pathname);

            if (/^image\//.test(contentType)) {
                await conn.sendFile(m.chat, redirectUrl, filename, text, m);
            } else if (/^text\//.test(contentType)) {
                let txt = await res.text();
                await m.reply(txt.slice(0, 65536) + '');
                await conn.sendFile(m.chat, Buffer.from(txt), 'file.txt', null, m);
            } else if (/^application\/json/.test(contentType)) {
                let txt = await res.json();
                txt = format(JSON.stringify(txt, null, 2));
                await m.reply(txt.slice(0, 65536) + '');
                await conn.sendFile(m.chat, Buffer.from(txt), 'file.json', null, m);
            } else if (/^text\/html/.test(contentType)) {
                let html = await res.text();
                await conn.sendFile(m.chat, Buffer.from(html), 'file.html', null, m);
            } else if (/^video\//.test(contentType)) {
                await conn.sendFile(m.chat, redirectUrl, filename, text, m);
            } else {
                await conn.sendFile(m.chat, redirectUrl, filename, text, m);
            }

            if (res.status === 301 || res.status === 302 || res.status === 307 || res.status === 308) {
                let location = res.headers.get('location');
                if (location) {
                    redirectUrl = location;
                    redirectCount++;
                } else {
                    break;
                }
            } else {
                break;
            }
        }

        if (redirectCount >= maxRedirects) {
            throw `Too many redirects (max: ${maxRedirects})`;
        }
    } catch (e) {
        // Hapus reaksi gagal (jika perlu)
        await conn.sendMessage(m.chat, { react: { text: '❌', key: processing.key } });
        throw e;
    } finally {
        // Hapus reaksi berhasil
        await conn.sendMessage(m.chat, { react: { text: '✅', key: processing.key } });
    }
};

handler.help = ['fetch', 'get'].map(v => v + ' <url>');
handler.tags = ['internet'];
handler.command = /^(fetch|get)$/i;

export default handler;