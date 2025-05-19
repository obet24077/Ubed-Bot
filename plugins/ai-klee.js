import axios from 'axios';

let handler = async (m, { isOwner, conn, text }) => {
   //biarin aja, sama gak ada beda nya
    if (!text) return m.reply(`Mau nanya apa sama klee?`);

    await conn.sendMessage(m.chat, {
        react: {
            text: "🆙",
            key: m.key,
        }
    });

    try {
        let response = await axios.get(`${global.skizoweb}/api/cai/chat?apikey=Ponta-XD&characterId=kZ3_qgkyiYvcRqgwv1WE2WQeME9CZy1yrCnMx98wyfk&text=${text}&sessionId=&token=6e936b5861aeebf25855993fdff95c5380584527`);

        const { success, result } = response.data;

        if (success && result) {
            const { text, srcCharacterName, urlAvatar, sessionId } = result
            let str = result.text;
            m.reply(str)
        } else {
            return m.reply(`Klee gagal menjawab pertanyaan.`);
        }
    } catch (error) {
        console.error(error);
        return m.reply(`Terjadi kesalahan dalam komunikasi dengan server.`);
    }
};
handler.tags = ['ai', 'cai'];
handler.help = ['klee <pertanyaan>'];
handler.command = /^(klee)/i;
handler.limit = true;

export default handler;