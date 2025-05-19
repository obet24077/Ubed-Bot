import cheerio from 'cheerio';
import fetch from 'node-fetch';
import axios from 'axios';
import qs from 'qs';

export async function joox(query) {
    try {
        const time = Math.floor(new Date() / 1000);
        const { data } = await axios.get(`http://api.joox.com/web-fcgi-bin/web_search?lang=id&country=id&type=0&search_input=${query}&pn=1&sin=0&ein=29&_=${time}`);
        
        let hasil = [];
        let promoses = [];
        let ids = data.itemlist.map(item => item.songid);
        
        for (let i = 0; i < ids.length; i++) {
            const get = `http://api.joox.com/web-fcgi-bin/web_get_songinfo?songid=${ids[i]}`;
            promoses.push(
                axios.get(get, {
                    headers: {
                        Cookie: 'wmid=142420656; user_type=1; country=id; session_key=2a5d97d05dc8fe238150184eaf3519ad;'
                    }
                }).then(({ data }) => {
                    const res = JSON.parse(data.replace('MusicInfoCallback(', '').replace('\n)', ''));
                    hasil.push({
                        lagu: res.msong,
                        album: res.malbum,
                        penyanyi: res.msinger,
                        publish: res.public_time,
                        img: res.imgSrc,
                        mp3: res.mp3Url
                    });
                })
            );
        }
        
        await Promise.all(promoses);
        return {
            creator: "DannXD",
            status: true,
            data: hasil
        };
    } catch (error) {
        throw error;
    }
}

export async function tiktok2(query) {
    try {
        const encodedParams = new URLSearchParams();
        encodedParams.set('url', query);
        encodedParams.set('hd', '1');

        const response = await axios({
            method: 'POST',
            url: 'https://tikwm.com/api/',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Cookie': 'current_language=en',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
            },
            data: encodedParams
        });

        const videos = response.data.data;
        return {
            title: videos.title,
            cover: videos.cover,
            origin_cover: videos.origin_cover,
            no_watermark: videos.play,
            watermark: videos.wmplay,
            music: videos.music
        };
    } catch (error) {
        throw error;
    }
}

export async function tiktoks(query) {
    try {
        const response = await axios({
            method: 'POST',
            url: 'https://tikwm.com/api/feed/search',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Cookie': 'current_language=en',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
            },
            data: qs.stringify({
                keywords: query,
                count: 50,
                cursor: 0,
                HD: 1
            })
        });

        const videos = response.data.data.videos;
        if (videos.length === 0) {
            throw new Error("Tidak ada video ditemukan.");
        } else {
            const gywee = Math.floor(Math.random() * videos.length);
            const videorndm = videos[gywee];

            return {
                title: videorndm.title,
                cover: videorndm.cover,
                origin_cover: videorndm.origin_cover,
                no_watermark: videorndm.play,
                watermark: videorndm.wmplay,
                music: videorndm.music
            };
        }
    } catch (error) {
        throw error;
    }
}

export async function rexdl(query) {
    try {
        const { data } = await axios.get(`https://rexdl.com/?s=${query}`);
        const $ = cheerio.load(data);

        const judul = [];
        const jenis = [];
        const date = [];
        const desc = [];
        const link = [];
        const thumb = [];
        const result = [];

        $('div > div.post-content').each((a, b) => {
            judul.push($(b).find('h2.post-title > a').attr('title'));
            jenis.push($(b).find('p.post-category').text());
            date.push($(b).find('p.post-date').text());
            desc.push($(b).find('div.entry.excerpt').text());
            link.push($(b).find('h2.post-title > a').attr('href'));
        });

        $('div > div.post-thumbnail > a > img').each((a, b) => {
            thumb.push($(b).attr('data-src'));
        });

        for (let i = 0; i < judul.length; i++) {
            result.push({
                creator: 'DannTeam',
                judul: judul[i],
                kategori: jenis[i],
                upload_date: date[i],
                deskripsi: desc[i],
                thumb: thumb[i],
                link: link[i]
            });
        }

        return result;
    } catch (error) {
        throw error;
    }
}

export async function nomorhoki(nomor) {
    try {
        const response = await axios({
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            url: 'https://www.primbon.com/no_hoki_bagua_shuzi.php',
            data: new URLSearchParams({
                nomer: nomor,
                submit: 'Submit!'
            })
        });

        const $ = cheerio.load(response.data);
        const fetchText = $('#body').text().trim();
        let result;

        try {
            result = {
                nomor_hp: fetchText.split('No. HP : ')[1].split('\n')[0],
                angka_bagua_shuzi: fetchText.split('Angka Bagua Shuzi : ')[1].split('\n')[0],
                energi_positif: {
                    kekayaan: fetchText.split('Kekayaan = ')[1].split('\n')[0],
                    kesehatan: fetchText.split('Kesehatan = ')[1].split('\n')[0],
                    cinta: fetchText.split('Cinta/Relasi = ')[1].split('\n')[0],
                    kestabilan: fetchText.split('Kestabilan = ')[1].split('\n')[0],
                    persentase: fetchText.split('Kestabilan = ')[1].split('% = ')[1].split('ENERGI NEGATIF')[0]
                },
                energi_negatif: {
                    perselisihan: fetchText.split('Perselisihan = ')[1].split('\n')[0],
                    kehilangan: fetchText.split('Kehilangan = ')[1].split('\n')[0],
                    malapetaka: fetchText.split('Malapetaka = ')[1].split('\n')[0],
                    kehancuran: fetchText.split('Kehancuran = ')[1].split('\n')[0],
                    persentase: fetchText.split('Kehancuran = ')[1].split('% = ')[1].split("\n")[0]
                },
                notes: fetchText.split('* ')[1].split('Masukan Nomor HP Anda')[0]
            };
        } catch {
            result = `Nomor "${nomor}" tidak valid`;
        }

        return result;
    } catch (error) {
        throw error;
    }
}