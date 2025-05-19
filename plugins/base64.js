let handler = async (m, { args, command }) => {
    let type = args[0]?.toLowerCase();
    let text = args.slice(1).join(' ') || (m.quoted && m.quoted.text);

    if (!type || !text) return m.reply('Gunakan format: *base64 <encode/decode> <teks>* atau balas pesan dengan *base64 <encode/decode>*');

    try {
        if (type === 'encode') {
            let encoded = Buffer.from(text).toString('base64');
            m.reply(`🔐 *Encoded:*\n\`${encoded}\``);
        } else if (type === 'decode') {
            let decoded = Buffer.from(text, 'base64').toString('utf-8');
            m.reply(`🔓 *Decoded:*\n\`${decoded}\``);
        } else {
            m.reply('Gunakan format: *base64 <encode/decode> <teks>* atau balas pesan dengan *base64 <encode/decode>*');
        }
    } catch (error) {
        console.error(error);
        m.reply('Terjadi kesalahan dalam proses encoding/decoding.');
    }
};

handler.help = ['base64'];
handler.tags = ['tools'];
handler.command = /^(base64)$/i;
handler.limit = 5;
handler.register = true;

export default handler;