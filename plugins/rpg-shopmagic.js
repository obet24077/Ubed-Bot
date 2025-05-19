let handler = async (m, { conn, command, args, usedPrefix, owner }) => {
    const _magicalitem = global.db.data.users[m.sender].magicalitem;
    const magicalitem = (_magicalitem == 0 ? 1500000 : _magicalitem == 1 ? 2500000 : _magicalitem == 2 ? 3000000 : _magicalitem == 3 ? 3500000 : '');

    const Kchat = `
Penggunaan ${usedPrefix}shop <Buy|sell> <item> <jumlah>
Contoh penggunaan: *${usedPrefix}shop buy potion 1*
▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰

🎩 Magicalitem:   Rp.${magicalitem}

▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
`.trim();

    try {
        if (/shop|toko/i.test(command)) {
            const jualbeli = args[0]?.toLowerCase();
            const count = args[3] && args[3].length > 0 ? Math.min(999999999999999, Math.max(parseInt(args[3]), 1)) : 1;
            switch (jualbeli) {
                case 'buy':
                    const _type = args[1]?.toLowerCase();
                    switch (_type) {
                        case 'magicalitem':
                            if (global.db.data.users[m.sender].magicalitem == 3) return conn.reply(m.chat, 'Kamu telah memiliki semua item sihir', m);
                            if (global.db.data.users[m.sender].eris >= magicalitem * count) {
                                global.db.data.users[m.sender].magicalitem += count;
                                global.db.data.users[m.sender].health += 66 * count;
                                global.db.data.users[m.sender].stamina += 66 * count;
                                global.db.data.users[m.sender].magicalitemdurability += 50 * count;
                                global.db.data.users[m.sender].eris -= magicalitem * count;
                                conn.reply(m.chat, `Berhasil membeli magicalitem seharga ${magicalitem * count} money\n\nMendapatkan Buff\nHealth   +${66 * count}\nStamina   +${66 * count}`, m);
                            } else {
                                conn.reply(m.chat, `Uangmu tidak cukup untuk membeli magicalitem seharga ${magicalitem * count} money`, m);
                            }
                            break;
                        default:
                            return conn.reply(m.chat, Kchat, m);
                    }
                    break;
                default:
                    return conn.reply(m.chat, Kchat, m);
            }
        } else if (/beli|buy/i.test(command)) {
            const count = args[2] && args[2].length > 0 ? Math.min(999999999999999, Math.max(parseInt(args[2]), 1)) : 1;
            const type = args[1]?.toLowerCase();
            switch (type) {
                case 'magicalitem':
                    if (global.db.data.users[m.sender].magicalitem == 3) return conn.reply(m.chat, 'Kamu telah memiliki semua item sihir', m);
                    if (global.db.data.users[m.sender].eris >= magicalitem * count) {
                        global.db.data.users[m.sender].magicalitem += count;
                        global.db.data.users[m.sender].health += 66 * count;
                        global.db.data.users[m.sender].stamina += 66 * count;
                        global.db.data.users[m.sender].magicalitemdurability += 50 * count;
                        global.db.data.users[m.sender].eris -= magicalitem * count;
                        conn.reply(m.chat, `Berhasil membeli magicalitem seharga ${magicalitem * count} money\n\nMendapatkan Buff\nHealth   +${66 * count}\nStamina   +${66 * count}`, m);
                    } else {
                        conn.reply(m.chat, `Uangmu tidak cukup untuk membeli magicalitem seharga ${magicalitem * count} money`, m);
                    }
                    break;
                default:
                    return conn.reply(m.chat, Kchat, m);
            }
        } else {
            return conn.reply(m.chat, Kchat, m);
        }
    } catch (e) {
        console.error(e);
        throw e;
    }
};

handler.help = ['shopmagic <sell|buy> <args>'];
handler.tags = ['rpg'];
handler.command = /^(shopmagic)$/i;
handler.limit = true;
handler.group = true;

export default handler;