const handler = async (m) => {
  const info = `
╭━━━[ *INFO RPG* ]━━━⬣
┃ Banyak yang bingung dengan perbedaan sistem Ekonomi.
┃ Berikut penjelasannya:

┣━━━⭑ *Untuk Bank* ⭑━━━⬣
┃ 💰 .bank
┃ 🔁 .tf
┃ 🏦 .nabung
┃ 💸 .tarik
┃ 🛒 .sell
┃ 🛍️ .beli
┃ 📦 .inventory1 _(belum fix)_

┣━━━⭑ *Untuk Bank2* ⭑━━━⬣
┃ 💰 .bank2
┃ 💸 .tarik2
┃ 🔁 .tf2
┃ 🏦 .tabung
┃ 🛍️ .shop2
┃ 📦 .inventory

┣━━━⭑ *Ubed Coins* ⭑━━━⬣
┃ 🪙 .ubedcoins
┃ 🛒 .rpgshop
┃ 🎒 .rpginventory

┣━━━✦ *Catatan* ✦━━━⬣
┃ 💡 Saldo *money dalam bank* itu sama untuk *Bank* & *Bank2*
┃ 💼 Yang berbeda hanyalah *saldo money pribadi* (di luar bank)
┃ 💳 Jadi kalian bisa kumpulin *money bank* dari 2 sumber money!

╰━━━━━━━━━━━━━━━━━━⬣
  `.trim();

  await conn.sendMessage(m.chat, { text: info }, { quoted: m });
};

handler.help = ["inforpg"];
handler.tags = ["rpg"];
handler.command = /^inforpg$/i;

export default handler;