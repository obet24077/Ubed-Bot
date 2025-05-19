let handler = async (m, { command, usedPrefix, args }) => {
    let user = global.db.data.users[m.sender]
    let type = (args[0] || '').toLowerCase()
    let staminaMax = 250

    const list = `〔 *E A T I N G* 〕
typing command
   ${usedPrefix + command } ayambakar

* 🥤 Aqua: *${user.aqua}*
* 🍖 Ayambakar: *${user.ayambakar}*
* 🍖 Lelebakar: *${user.lelebakar}*
* 🥩 Steak: *${user.steak}*
* 🍣 Sushi: *${user.sushi}*
* 🍖 Ikanbakar: *${user.ikanbakar}*
`.trim()

    if (/makan|eat/i.test(command)) {
        const count = args[1] && args[1].length > 0 ? Math.min(99999999, Math.max(parseInt(args[1]), 1)) : 1
        let foodType = {
            'ayambakar': { item: 'ayambakar', stamina: 10 },
            'lelebakar': { item: 'lelebakar', stamina: 15 },
            'steak': { item: 'steak', stamina: 20 },
            'sushi': { item: 'sushi', stamina: 5 },
            'ikanbakar': { item: 'ikanbakar', stamina: 15 }
        }

        if (type in foodType) {
            let food = foodType[type]
            if (user.stamina < staminaMax) {
                if (user[food.item] >= count) {
                    user[food.item] -= count
                    user.stamina = Math.min(user.stamina + food.stamina * count, staminaMax)
                    conn.reply(m.chat, `Nyam nyam! Stamina kamu sekarang ${user.stamina}/${staminaMax}`, m)
                } else {
                    conn.reply(m.chat, `${food.item.replace(/^\w/, c => c.toUpperCase())} kamu kurang`, m)
                }
            } else {
                conn.reply(m.chat, `Stamina kamu sudah penuh (${user.stamina}/${staminaMax})`, m)
            }
        } else {
            await conn.reply(m.chat, list, m)
        }
    }
}

handler.help = ['eat']
handler.tags = ['rpg']
handler.register = true
handler.command = /^(eat|makan)$/i
export default handler