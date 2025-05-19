let handler = async (m, { conn }) => {
    let sender = m.sender;
    let user = global.db.data.users[sender];

    if (!user.isMarried || user.rumah !== 'Kontrakan') return m.reply('⚠️ Kamu tidak menyewa kontrakan!');

    let biayaSewa = 500000;

    if (user.money < biayaSewa) {
        user.isMarried = false;
        user.pasangan = null;
        return m.reply('💔 Kamu diusir karena tidak bisa membayar kontrakan! Kamu telah bercerai otomatis.');
    }

    user.money -= biayaSewa;
    user.sewaHabis = Date.now() + 24 * 60 * 60 * 1000;

    return m.reply('✅ Kamu telah membayar kontrakan untuk 1 hari!');
}

handler.help = ['bayarkontrakan'];
handler.tags = ['rpg'];
handler.command = /^(bayarkontrakan)$/i;

export default handler;