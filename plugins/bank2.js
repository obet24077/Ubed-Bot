let handler = async (m, { conn, text, usedPrefix }) => {
    let user = global.db.data.users[m.sender]
    let moneyFormatted = user.eris.toLocaleString('en-US')
    let bankFormatted = user.bank.toLocaleString('en-US')
    let balanceFormatted = user.balance.toLocaleString('en-US')

    let teks = `🏦「 *BANK COIN PLAYER* 」🏦

🧑🏻‍💻 *Pemilik:*   ${conn.getName(m.sender)}
👤 *Name:*   _${user.registered ? user.name : conn.getName(m.sender)}_
💸 *Money:*   _Rp.${moneyFormatted}_
💳 *Bank:*   _Rp.${bankFormatted}_
🪙 *Ubed Coins:*   _ᴜ͢ᴄ.${balanceFormatted}_
🪪 *Status:*   _${user.premiumTime > 0 ? 'Premium' : 'Free'}_
📂 *Registered:*   _${user.registered ? 'Yes' : 'No'}_

*Tutorial Menabung Dan Menarik Uang*
1. .deposit [jumlah] - untuk menabung
2. .tarik [jumlah] - untuk menarik
`

    conn.sendMessage(m.chat, { text: teks }, { quoted: m })
}

handler.help = ['bank2']
handler.tags = ['rpg']
handler.command = /^bank2$/i

export default handler