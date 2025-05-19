let handler = async (m, { conn, args }) => {
    let sender = m.sender;
    let user = global.db.data.users[sender];

    if (!user.isMarried) return m.reply('⚠️ Kamu harus menikah sebelum bisa beli rumah!');

    let type = args[0]?.toLowerCase();
    if (!type) return m.reply('⚠️ Gunakan: *.rumah beli* atau *.rumah sewa*');

    if (type === 'beli') {
        if (user.money < 100000000) return m.reply('⚠️ Uangmu kurang! Butuh Rp 100 juta.');
        user.money -= 100000000;
        user.rumah = 'Milik Pribadi';

        return m.reply('🏡 Kamu telah membeli rumah!');
    }

    if (type === 'sewa') {
        if (user.money < 500000) return m.reply('⚠️ Uangmu kurang! Butuh Rp 500K.');
        user.money -= 500000;
        user.rumah = 'Kontrakan';
        user.sewaHabis = Date.now() + 24 * 60 * 60 * 1000; // 1 hari sewa

        return m.reply('🏠 Kamu telah menyewa kontrakan selama 1 hari!');
    }
}

handler.help = ['rumah beli', 'rumah sewa'];
handler.tags = ['rpg'];
handler.command = /^(rumah)$/i;

export default handler;