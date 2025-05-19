const handler = async (m, { conn, text }) => {
    if (!text.includes('@')) return m.reply('Gunakan format: .jodoh @user1 love @user2');
    
    const users = text.match(/@\d+/g);
    if (!users || users.length < 2) return m.reply('Gunakan format yang benar: @user1 love @user2');
    
    let user1 = users[0].replace('@', '') + '@s.whatsapp.net';
    let user2 = users[1].replace('@', '') + '@s.whatsapp.net';
    
    let name1 = (await conn.getName(user1)) || "Pengguna";
    let name2 = (await conn.getName(user2)) || "Pengguna";
    
    const matchPercentage = Math.floor(Math.random() * 100) + 1;
    
    let avatar1 = await conn.profilePictureUrl(user1, 'image').catch(() => 'https://files.catbox.moe/no-avatar.png');
    let avatar2 = await conn.profilePictureUrl(user2, 'image').catch(() => 'https://files.catbox.moe/no-avatar.png');
    
    const imageUrl = `https://beforelife.me/api/maker/ship?avatar=${encodeURIComponent(avatar1)}&avatar2=${encodeURIComponent(avatar2)}&number=${matchPercentage}&image=https://files.catbox.moe/1qghjk.png&apikey=ubed2407`;
    
    const caption = `❤️ Persentase kecocokan ${name1} ❤️ ${name2}! ❤️`;
    
    await conn.sendMessage(m.chat, { image: { url: imageUrl }, caption }, { quoted: m });
};

handler.help = ['jodoh @user1 love @user2'];
handler.tags = ['fun'];
handler.command = /^jodoh$/i;

export default handler;