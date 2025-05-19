let handler = async (m, { conn, args }) => {
    const user = global.db.data.users[m.sender];

    if (!user.isMarried) return m.reply('⚠️ Kamu belum menikah.');
    if (!user.anak || user.anak.length === 0) return m.reply('⚠️ Kamu belum mengadopsi anak.');

    const namaAnak = args[0];
    if (!namaAnak) return m.reply('Contoh penggunaan: *.cabutanak NamaAnak*');

    // Cek apakah anak ada dalam daftar anak user
    if (!user.anak.includes(namaAnak)) return m.reply(`⚠️ Anak bernama *${namaAnak}* tidak ditemukan di daftar anak kamu.`);

    // Hapus dari anak user
    user.anak = user.anak.filter(a => a !== namaAnak);

    // Hapus dari anak pasangan
    const pasanganData = global.db.data.users[user.pasangan];
    if (pasanganData && pasanganData.anak) {
        pasanganData.anak = pasanganData.anak.filter(a => a !== namaAnak);
    }

    // Hapus status orangtua di user anak
    for (let jid in global.db.data.users) {
        let calonAnak = global.db.data.users[jid];
        if (calonAnak.namaAnak?.toLowerCase() === namaAnak.toLowerCase() && calonAnak.orangtua === m.sender) {
            delete calonAnak.orangtua;
            delete calonAnak.namaAnak;
            break;
        }
    }

    return m.reply(`✅ Anak bernama *${namaAnak}* telah dicabut dari daftar adopsimu.`);
};

handler.help = ['cabutanak <nama>'];
handler.tags = ['rpg'];
handler.command = /^cabutanak$/i;

export default handler;