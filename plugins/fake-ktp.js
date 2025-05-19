/*
ubed bot
api : api.ubed.my.id
*/

import axios from 'axios';

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    if (!text) throw `Format:\n${usedPrefix + command} provinsi|kota|nik|nama|ttl|jenisKelamin|golDarah|alamat|rt/rw|kelurahan|kecamatan|agama|status|pekerjaan|kewarganegaraan|masaBerlaku|terbuat\n\nContoh:\n${usedPrefix + command} Jawa Barat|Bandung|1234567890123456|Ujang Saputra|01-01-2000|Laki-laki|O|Jl. Mawar No. 1|001/002|Mekarjaya|Cicendo|Islam|Belum Kawin|Pelajar|WNI|Seumur Hidup|Bandung`;

    const data = text.split('|');
    if (data.length < 17) throw `Semua field harus diisi. Gunakan pemisah | sebanyak 16 kali.`

    let [
        provinsi, kota, nik, nama, ttl, jenisKelamin, golonganDarah,
        alamat, rtRw, kelDesa, kecamatan, agama, status,
        pekerjaan, kewarganegaraan, masaBerlaku, terbuat
    ] = data.map(v => v.trim());

    // Ambil foto profil atau reply gambar
    let pasPhoto;
    try {
        if (/image\/(jpe?g|png)/.test(mime)) {
            let media = await q.download();
            const FormData = (await import('form-data')).default;
            const form = new FormData();
            form.append('reqtype', 'fileupload');
            form.append('fileToUpload', media, 'photo.jpg');
            const res = await axios.post('https://catbox.moe/user/api.php', form, {
                headers: form.getHeaders()
            });
            pasPhoto = res.data;
        } else {
            pasPhoto = await conn.profilePictureUrl(m.sender, 'image');
        }
    } catch (e) {
        pasPhoto = 'https://files.catbox.moe/y8rn53.jpg';
    }

    let apiUrl = `https://api.ubed.my.id/maker/ktp?apikey=ubed2407&provinsi=${encodeURIComponent(provinsi)}&kota=${encodeURIComponent(kota)}&nik=${nik}&nama=${encodeURIComponent(nama)}&ttl=${encodeURIComponent(ttl)}&jenisKelamin=${encodeURIComponent(jenisKelamin)}&golonganDarah=${golonganDarah}&alamat=${encodeURIComponent(alamat)}&rtRw=${encodeURIComponent(rtRw)}&kelDesa=${encodeURIComponent(kelDesa)}&kecamatan=${encodeURIComponent(kecamatan)}&agama=${encodeURIComponent(agama)}&status=${encodeURIComponent(status)}&pekerjaan=${encodeURIComponent(pekerjaan)}&kewarganegaraan=${encodeURIComponent(kewarganegaraan)}&masaBerlaku=${encodeURIComponent(masaBerlaku)}&terbuat=${encodeURIComponent(terbuat)}&pasPhoto=${encodeURIComponent(pasPhoto)}`;

    await conn.sendMessage(m.chat, { react: { text: '🪪', key: m.key } });

    try {
        let res = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        await conn.sendMessage(m.chat, {
            image: res.data,
            caption: 'Berikut KTP-nya!'
        }, { quoted: m });
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    } catch (e) {
        console.error(e);
        m.reply('❌ Gagal membuat KTP, pastikan semua data valid.');
    }
};

handler.help = ['ktp <data>'];
handler.tags = ['maker'];
handler.command = /^ktp$/i;
handler.premium = true;
handler.limit = true;

export default handler;