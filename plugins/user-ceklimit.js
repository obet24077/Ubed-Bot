let handler = async (m, { conn }) => {
    let who;
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;
    else who = m.sender;
    
    if (typeof db.data.users[who] == 'undefined') throw 'Pengguna tidak ada di dalam database';
    
    const pp = await conn.profilePictureUrl(who, "image").catch(_ => "https://telegra.ph/file/ee60957d56941b8fdd221.jpg");

    // **Daftar Owner (Tambahkan nomor jika lebih dari satu)**
    const ownerJid = ['628123456789@s.whatsapp.net', '628987654321@s.whatsapp.net']; // Ganti dengan nomor owner

    // **Batas limit maksimal**
    const MAX_LIMIT = 10_000;

    // Ambil limit dari database
    let user = db.data.users[who];
    let limitUser = user.limit || 0;
    let isOwner = ownerJid.includes(who);
    let isPremium = user.premium || false; // Pastikan ada sistem premium di database

    // **Owner & Premium tidak memiliki batas limit**
    if (isOwner || isPremium) {
        limitUser = '∞'; // Tampilkan sebagai "Tak Terbatas"
    } else {
        // **Jika limit di atas 10K dan digunakan, langsung ubah ke 9999**
        if (limitUser > MAX_LIMIT) {
            db.data.users[who].limit = 9999;
            limitUser = 9999;
        }

        // **Tampilkan limit sesuai database (maksimal 10K)**
        limitUser = Math.min(limitUser, MAX_LIMIT);
    }

    conn.sendMessage(m.chat, {
        text: '',
        contextInfo: {
            externalAdReply: {
                title: '🎟️ Y O U R  L I M I T',
                body: `➜ ❲ ${limitUser} ❳`, // Tampilkan "∞" jika Owner atau Premium
                showAdAttribution: true,
                mediaType: 1,
                sourceUrl: '',
                thumbnailUrl: pp,
                renderLargerThumbnail: false
            }
        }
    }, { quoted: m });
};

handler.help = ['limit <@user>'];
handler.tags = ['main'];
handler.command = /^(limit)$/i;
handler.register = true;

export default handler;