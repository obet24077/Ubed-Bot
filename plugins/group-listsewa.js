let handler = async (m, { conn }) => {
    let txt = '';
    let i = 1;
    for (let [jid, chat] of Object.entries(conn.chats).filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats)) {
        if (global.db.data.chats[jid] && global.db.data.chats[jid].expired > 0) {
            let expiredTimestamp = global.db.data.chats[jid].expired;
            let now = new Date().getTime();
            let remainingTime = expiredTimestamp - now;

            // Menghitung waktu tersisa
            let timeLeft = msToTime(remainingTime);
            let timeText = `${timeLeft.days} hari, ${timeLeft.hours} jam, ${timeLeft.minutes} menit`;

            txt += `${i++}. *${await conn.getName(jid)}*\n   - JID: ${jid} [${chat?.metadata?.read_only ? 'Left' : 'Joined'}]\n   - Waktu Tersisa: ${timeText}\n\n`;
        }
    }
    if (txt === '') {
        txt = 'Tidak ada grup dengan sewa yang aktif.';
    }
    m.reply(`List Groups dengan Sewa Aktif:\n${txt}`.trim());
};

// Fungsi untuk mengubah milidetik ke format hari, jam, dan menit
function msToTime(ms) {
    let days = Math.floor(ms / (24 * 60 * 60 * 1000));
    let hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    let minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    return { days, hours, minutes };
}

handler.help = ['listsewa'];
handler.tags = ['group'];
handler.command = /^(listsewa)$/i;
handler.group = false;

export default handler;