let handler = async (m, { conn, args }) => {
    let sender = m.sender;
    let user = global.db.data.users[sender];
    
    // Cek apakah sudah menikah
    if (!user.isMarried) return m.reply('⚠️ Kamu belum menikah!');

    let pasanganID = user.pasangan;
    let pasangan = global.db.data.users[pasanganID];
    let nameUser = await conn.getName(sender);
    let namePasangan = await conn.getName(pasanganID);

    user.talakCount ??= 0;

    // Handle perintah .cerai talak1, talak2, talak3
    let input = args[0]?.toLowerCase();

    if (input && ['talak1', 'talak2', 'talak3'].includes(input)) {
        // Talak 1
        if (input === 'talak1') {
            if (user.talakCount >= 1) return m.reply('Kamu sudah menjatuhkan Talak 1 sebelumnya.');
            user.talakCount = 1;
            return m.reply(`✅ Talak 1 dijatuhkan.\n${nameUser} telah menjatuhkan *Talak 1* kepada ${namePasangan}.`);
        }

        // Talak 2
        if (input === 'talak2') {
            if (user.talakCount < 1) return m.reply('Kamu harus menjatuhkan Talak 1 terlebih dahulu.');
            if (user.talakCount >= 2) return m.reply('Kamu sudah menjatuhkan Talak 2 sebelumnya.');
            user.talakCount = 2;
            return m.reply(`✅ Talak 2 dijatuhkan.\n${nameUser} telah menjatuhkan *Talak 2* kepada ${namePasangan}.`);
        }

        // Talak 3
        if (input === 'talak3') {
            if (user.talakCount < 2) return m.reply('Kamu harus menjatuhkan Talak 1 dan 2 terlebih dahulu.');
            if (user.talakCount >= 3) return m.reply('Kamu sudah menjatuhkan Talak 3. Tunggu persetujuan pasangan.');

            user.talakCount = 3;
            pasangan.pendingCerai = sender;
            return conn.sendMessage(m.chat, {
                text: `⚠️ ${nameUser} telah menjatuhkan *Talak 3* kepada ${namePasangan}.\n\n${namePasangan}, ketik *.cerai setuju* untuk menyetujui perceraian ini.`,
                mentions: [sender, pasanganID]
            });
        }
    }

    // Handle persetujuan cerai dengan .cerai setuju
    if (args[0]?.toLowerCase() === 'setuju') {
        if (pasangan.pendingCerai !== sender) {
            return m.reply('⚠️ Kamu tidak memiliki permintaan cerai yang pending atau kamu bukan pasangan yang terlibat dalam cerai ini!');
        }

        // Setujui perceraian
        user.isMarried = false;
        pasangan.isMarried = false;
        user.talakCount = 0;
        pasangan.talakCount = 0;
        pasangan.pendingCerai = null;

        return conn.sendMessage(m.chat, {
            text: `✅ Perceraian antara ${nameUser} dan ${namePasangan} telah disetujui dan selesai.\nKeduanya kini tidak lagi menikah.`,
            mentions: [sender, pasanganID]
        });
    }

    // Jika format salah
    return m.reply('Gunakan format:\n.cerai talak1\n.cerai talak2\n.cerai talak3\natau\n.cerai setuju untuk menyetujui perceraian');
};

handler.help = ['cerai <talak1|talak2|talak3>', 'cerai setuju'];
handler.tags = ['rpg'];
handler.command = /^cerai$/i;

export default handler;