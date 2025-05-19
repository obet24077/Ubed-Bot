const handler = async (m, { conn }) => {
    global.db.data.ubedKomentar ??= {};

    const komentar = global.db.data.ubedKomentar[m.sender] || [];

    if (!komentar.length) return m.reply('❌ Belum ada komentar di status kamu.');

    let teks = `🗨️ *Komentar di Status Kamu:*\n\n`;

    for (let i = 0; i < komentar.length; i++) {
        const komen = komentar[i];
        const waktu = new Date(komen.timestamp).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
        const nama = await conn.getName(komen.jid).catch(() => 'Pengguna');

        teks += `*${i + 1}. ${nama}* (${waktu})\n`;
        teks += `💬 ${komen.text}\n\n`;
    }

    await conn.sendMessage(m.chat, {
        text: teks.trim(),
        mentions: komentar.map(k => k.jid)
    }, { quoted: m });
};

handler.help = ['komentarsaya'];
handler.tags = ['media'];
handler.command = /^komentarsaya$/i;

export default handler;