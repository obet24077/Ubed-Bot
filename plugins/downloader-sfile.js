import cheerio from 'cheerio';
import fetch from 'node-fetch';

const handler = async (m, { conn, text }) => {
    if (text.match(/(https:\/\/sfile.mobi\/)/gi)) {
        let res = await sfileDl(text);
        if (!res) return conn.reply(m.chat, 'Unable to Download File', m);
        await m.reply(Object.keys(res).map(v => `*• ${capitalize(v)}:* ${res[v]}`).join('\n') + '\n\n_Sending file..._');
        conn.sendMessage(m.chat, { document: { url: res.download }, fileName: res.filename, mimetype: res.mimetype }, { quoted: m });
    } else if (text) {
        let [query, page] = text.split('|');
        let res = await sfileSearch(query, page);
        if (!res.length) throw `Query "${text}" not found :/`;
        res = res.map((v) => `*Title:* ${v.title}\n*Size:* ${v.size}\n*Link:* ${v.link}`).join('\n\n');
        m.reply(res);
    } else {
        return conn.reply(m.chat, '• *Example :* .sfile scbot', m);
    }
};
handler.help = ['sfile'].map(v => v + ' *<teks>*');
handler.tags = ['downloader'];
handler.command = /^(sfile)$/i;

export default handler;

const sfileSearch = async (query, page = 1) => {
    let res = await fetch(`https://sfile.mobi/search.php?q=${query}&page=${page}`);
    let $ = cheerio.load(await res.text());
    let result = [];
    $('div.list').each(function () {
        let title = $(this).find('a').text();
        let size = $(this).text().trim().split('(')[1];
        let link = $(this).find('a').attr('href');
        if (link) result.push({ title, size: size.replace(')', ''), link });
    });
    return result;
};

const sfileDl = async (url) => {
    let res = await fetch(url);
    let $ = cheerio.load(await res.text());
    let filename = $('div.w3-row-padding').find('img').attr('alt');
    let mimetype = $('div.list').text().split(' - ')[1].split('\n')[0];
    let filesize = $('#download').text().replace(/Download File/g, '').replace(/\(|\)/g, '').trim();
    let download = $('#download').attr('href') + '&k=' + Math.floor(Math.random() * (15 - 10 + 1) + 10);
    return { filename, filesize, mimetype, download };
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);