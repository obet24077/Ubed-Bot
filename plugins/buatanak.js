// plugins/bikinanak.js
let handler = async (m, { conn, args, usedPrefix, command }) => {
    let sender = m.sender;
    let pasangan = global.db.data.users[sender]?.pasangan;

    if (!pasangan) return m.reply('⚠️ Kamu belum menikah. Cari pasangan dulu sebelum buat anak.');


    if (!m.mentionedJid || m.mentionedJid[0] !== pasangan) return m.reply(`⚠️ Tag pasanganmu untuk buat anak.\n\nContoh:\n${usedPrefix}${command} @${pasangan.split('@')[0]}`);

    let pasanganData = global.db.data.users[pasangan];
    let user = global.db.data.users[sender];

    if (user.money < 5000000) return m.reply('⚠️ Uang kamu kurang! Butuh Rp 5 juta untuk menyewa hotel.');

    if ((user.anak?.length || 0) >= 2) return m.reply('⚠️ Kamu hanya bisa memiliki maksimal 2 anak.');

    user.bikinAnakPending = pasangan;
    pasanganData.bikinAnakDitawari = sender;

    await conn.sendMessage(pasangan, {
        text: `❤️ *Permintaan Bikin Anak* ❤️\n\nPasanganmu *${conn.getName(sender)}* ingin membuat anak bersamamu (fiksi).\n\nBiaya: Rp 5 juta (hotel).\n\nKetik *ya* untuk setuju, atau *tidak* untuk menolak.`,
        contextInfo: { mentionedJid: [sender] }
    });

    m.reply('✅ Permintaan telah dikirim ke pasanganmu. Tunggu persetujuan.');
}

handler.before = async (m, { conn }) => {
    let user = global.db.data.users[m.sender];

    if (user?.bikinAnakDitawari) {
        if (/^(ya|iya|oke|setuju)$/i.test(m.text)) {
            let pengaju = user.bikinAnakDitawari;
            let pengajuData = global.db.data.users[pengaju];

            if (pengajuData.money < 5000000) return m.reply('⚠️ Sayangnya pasanganmu sudah tidak punya cukup uang.');

            let semuaUser = Object.keys(global.db.data.users).filter(jid =>
                jid !== pengaju && jid !== m.sender && global.db.data.users[jid].level >= 2
            );

            if (!semuaUser.length) return m.reply('⚠️ Tidak ditemukan calon anak yang cocok (user level 2 ke atas).');

            let anakRandom = semuaUser[Math.floor(Math.random() * semuaUser.length)];
            pengajuData.money -= 5000000;

            // Tambahkan anak ke kedua pasangan
            pengajuData.anak = pengajuData.anak || [];
            user.anak = user.anak || [];
            pengajuData.anak.push(anakRandom);
            user.anak.push(anakRandom);

            m.reply(`👶 *Selamat!*\n\nKamu dan *${conn.getName(pengaju)}* telah dikaruniai seorang anak bernama *${conn.getName(anakRandom)}* (fiksi).`);

            conn.sendMessage(pengaju, {
                text: `👶 *Selamat!*\n\nKamu dan *${conn.getName(m.sender)}* telah mendapatkan anak bernama *${conn.getName(anakRandom)}* (fiksi).\n\nGunakan *.keluarga* untuk melihat status keluargamu.`,
                mentions: [m.sender, anakRandom]
            });

            delete user.bikinAnakDitawari;
            delete pengajuData.bikinAnakPending;
        } else if (/^(tidak|ga|gak|no)$/i.test(m.text)) {
            let pengaju = user.bikinAnakDitawari;
            let pengajuData = global.db.data.users[pengaju];

            m.reply('❌ Kamu menolak permintaan bikin anak.');

            conn.sendMessage(pengaju, { text: `❌ Pasanganmu *${conn.getName(m.sender)}* menolak permintaan bikin anak.` });

            delete user.bikinAnakDitawari;
            delete pengajuData.bikinAnakPending;
        }
    }
}

handler.help = ['bikinanak @pasangan', 'buatanak @pasangan'];
handler.tags = ['rpg'];
handler.command = /^(bikinanak|buatanak)$/i;

export default handler;