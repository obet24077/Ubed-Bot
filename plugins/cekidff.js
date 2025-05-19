import fetch from 'node-fetch';

let handler = async (m, { conn, args, text, command }) => {
    if (!text) return m.reply(`Gunakan format: .${command} <user_id>\nContoh: .${command} 11223344`);

    const apikey = 'JFHto2Ydeb1x';
    const url = `https://api.titanzstore.id/api/ff?id=${text}&apikey=${apikey}`;

    try {
        const res = await fetch(url);
        const json = await res.json();

        if (!json.status) {
            return m.reply(`❌ *Gagal:* ${json.message}`);
        }

        const { username, user_id } = json.data;

        let replyMsg = `✅ *ID Free Fire Ditemukan!*\n\n`;
        replyMsg += `👤 *Username:* ${username}\n`;
        replyMsg += `🆔 *User ID:* ${user_id}`;

        m.reply(replyMsg);
    } catch (e) {
        console.error(e);
        m.reply(`❌ Terjadi kesalahan saat menghubungi server.`);
    }
};

handler.help = ['cekidff <user_id>'];
handler.tags = ['tools'];
handler.command = /^cekidff$/i;
handler.limit = true;

export default handler;