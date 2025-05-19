const handler = async (m, { text, command }) => {
    const user = global.db.data.users[m.sender];
    
    if (!user.registered) throw `Kamu belum terdaftar. Gunakan perintah .Daftar`;
    
    if (!text) throw 'Silakan masukkan nama baru Anda.';
    
    // Check if the user has the required item
    if (user.tiketcn < 1) return m.reply('Kamu tidak memiliki *Tiketcn* harap beli terlebih dahulu\n> Example: .shop buy tiketcn')

    // Remove one tiketcn from the user's inventory
    user.tiketcn -= 1

    const oldName = user.name;
    user.name = text.trim();
    
    return await conn.reply(m.chat, `Kamu berhasil mengganti nama\n\n> Nama sebelumnya: ${oldName}\n> Nama baru: ${user.name}`, m);
};

handler.help = ['changenama <nama baru>'];
handler.tags = ['main', 'users'];
handler.command = /^(changenama|cn)$/i;

export default handler;