const xpperlimit = 1

let handler = async (m, { conn, command, args }) => {
    let user = global.db.data.users[m.sender]

    // Tentukan batas maksimal bank berdasarkan level ATM
    let MAX_BANK = 25_000_000_000 // Default untuk level < 15
    if (user.atm >= 25) {
        MAX_BANK = 100_000_000_000
    } else if (user.atm >= 15) {
        MAX_BANK = 50_000_000_000
    }

    let count = command.replace(/^nabung/i, '')
    count = count
        ? /all/i.test(count)
            ? Math.floor(user.money / xpperlimit)
            : parseInt(count)
        : args[0]
        ? parseInt(args[0])
        : 1
    count = Math.max(1, count)

    if (isNaN(count)) return conn.reply(m.chat, `Masukkan jumlah yang valid untuk ditabung.`, m)

    if (user.bank >= MAX_BANK) {
        return conn.reply(m.chat, `Tabunganmu sudah mencapai batas maksimal Rp ${MAX_BANK.toLocaleString()}!`, m)
    }

    if (user.money >= xpperlimit * count) {
        // Cek apakah setelah menabung akan melebihi batas bank
        let sisa = MAX_BANK - user.bank
        if (count > sisa) count = sisa // Batasi sesuai sisa ruang

        user.money -= xpperlimit * count
        user.bank += count

        conn.reply(m.chat, `Sukses menabung sebesar Rp ${count.toLocaleString()}.`, m)
    } else {
        conn.reply(m.chat, `Uang kamu tidak mencukupi untuk menabung Rp ${count.toLocaleString()}.`, m)
    }
}

handler.help = ['nabung <jumlah>']
handler.tags = ['rpg']
handler.command = /^nabung([0-9]+)?$|^nabung$|^nabungall$/i
handler.register = true

export default handler