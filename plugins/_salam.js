export async function before(m, {
    conn,
    participants
}) {
    const info = {
        nomerown: '6285147777105' // Ganti sesuai nomor owner kamu
    };

    if (!conn.time_join) {
        conn.time_join = {
            join: false,
            time: 0,
        };
    }

    const currentTime = Math.floor(Date.now() / 1000);

    if (!m.isGroup || conn.time_join.time > currentTime) {
        console.log("Not a group message or still in cooldown");
        return;
    }

    const isCek = global.db.data.users[m.sender];
    let messageText = "";

    switch (m.sender) {
        case info.nomerown + "@s.whatsapp.net":
            messageText = "📣 *Perhatian semua, Ownerku ubed telah tiba disini* ";
            break;
        default:
            if (isCek?.owner) {
                messageText = "Selamat datang, Owner !";
            } else if (isCek?.premium) {
                messageText = "Hai king!";
            }
            break;
    }

    if (messageText) {
        await conn.sendMessage(
            m.chat, {
                text: messageText,
            }, {
                quoted: m
            }
        );

        conn.time_join = {
            join: true,
            time: currentTime + 2400,
        };
    } else {
        console.log("No message to send");
    }
}