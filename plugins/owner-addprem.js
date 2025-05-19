let handler = async (m, { conn, text, usedPrefix, command }) => {
    let who;
    if (m.isGroup) {
        if (m.mentionedJid && m.mentionedJid[0]) {
            who = m.mentionedJid[0];
        } else if (m.quoted) {
            who = m.quoted.sender;
        } else if (text) {
            let input = text.split(' ')[0].replace(/[^0-9]/g, '');
            if (input.startsWith('62') || input.startsWith('0')) {
                who = input.replace(/^0/, '62') + '@s.whatsapp.net';
            } else {
                throw `Format nomor salah, Senpai! Contoh: 628123456789 atau @user`;
            }
        } else {
            throw `Tag seseorang atau masukin nomornya, Senpai!`;
        }
    } else {
        who = m.chat;
    }

    let user = db.data.users[who];
    if (!who || !user) throw `Siapa yang mau dijadikan Premium, Senpai? Usernya gak ketemu!`;

    let args = text.trim().split(' ').slice(1); // ambil setelah nomor
    let jumlahWaktu = parseInt(args[0]);
    let satuanWaktu = args[1] ? args[1].toLowerCase() : 'hari';
    let now = Date.now();

    if (isNaN(jumlahWaktu)) {
        // Kalau jumlah tidak diisi atau salah, langsung permanen
        user.premiumTime = Infinity;
        user.premium = true;
        return m.reply(`Sukses, Senpai!\n*Nama:* ${user.name || 'Unknown'}\n*Durasi:* PERMANEN\nSekarang dia Premium!`);
    }

    // Kalau jumlah valid, lanjut normal
    let durasi;
    switch (satuanWaktu) {
        case 'jam':
            durasi = 3600000 * jumlahWaktu;
            break;
        case 'hari':
            durasi = 86400000 * jumlahWaktu;
            break;
        case 'minggu':
            durasi = 86400000 * 7 * jumlahWaktu;
            break;
        case 'bulan':
            durasi = 86400000 * 30 * jumlahWaktu;
            break;
        case 'tahun':
            durasi = 86400000 * 365 * jumlahWaktu;
            break;
        default:
            throw `Satuan waktu salah, Senpai! Pake 'jam', 'hari', 'minggu', 'bulan', atau 'tahun' aja.`;
    }

    if (user.premiumTime > now) {
        user.premiumTime += durasi;
    } else {
        user.premiumTime = now + durasi;
    }
    user.premium = true;
    m.reply(`Sukses, Senpai!\n*Nama:* ${user.name || 'Unknown'}\n*Durasi:* ${jumlahWaktu} ${satuanWaktu}\nSekarang dia Premium!`);
};

handler.help = ['addprem <nomor/@user> <jumlah> <jam/hari/minggu/bulan/tahun>'];
handler.tags = ['owner'];
handler.command = /^(add|tambah|\+)p(rem)?$/i;
handler.group = false;
handler.owner = true;

export default handler;