let handler = async (m, { conn, args }) => {
    let sender = m.sender;
    let user = global.db.data.users[sender];

    if (!user.isMarried) return m.reply('⚠️ Kamu belum menikah!');

    let pasangan = user.pasangan;
    if (!pasangan) return m.reply('⚠️ Kamu tidak memiliki rekening keluarga.');

    // Ambil saldo bank pribadi user dan pasangan
    let saldoBankUser = user.bank || 0;
    let saldoBankPasangan = global.db.data.users[pasangan].bank || 0;

    // Ambil saldo bank keluarga user dan pasangan
    let saldoBankKeluargaUser = user.bankKeluarga || 0;
    let saldoBankKeluargaPasangan = global.db.data.users[pasangan].bankKeluarga || 0;

    // Gabungkan saldo bank keluarga dari kedua pasangan
    let totalSaldoBankKeluarga = saldoBankKeluargaUser + saldoBankKeluargaPasangan;

    let caption = `
🏦 *Rekening Bank Keluarga* 🏦

💰 *Saldo Bank Keluarga:* Rp ${totalSaldoBankKeluarga.toLocaleString()}
👤 *Saldo Bank (Kamu):* Rp ${saldoBankUser.toLocaleString()}
👤 *Saldo Bank (Pasangan):* Rp ${saldoBankPasangan.toLocaleString()}

📌 Gunakan:
- *.setor [jumlah]* → Menyetor uang ke bank keluarga
- *.tarik [jumlah]* → Menarik uang dari bank keluarga (tanpa batasan)
`;

    await conn.sendMessage(m.chat, { text: caption });
}

handler.help = ['bankfamily', 'bankkeluarga'];
handler.tags = ['rpg'];
handler.command = /^(bankfamily|bankkeluarga)$/i;

export default handler;