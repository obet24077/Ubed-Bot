let handler = async (m, { conn, text, participants }) => {
  if (!text) throw "❌ Masukkan jumlah money yang ingin ditambahkan!";
  if (isNaN(text)) throw "❌ Masukkan angka yang valid!";

  let money = parseInt(text);
  let user = global.db.data.users;
  
  let addedUsers = 0;
  for (let member of participants) {
    if (user[member.id]) {
      user[member.id].money += money;
      addedUsers++;
    }
  }

  conn.reply(m.chat, `✅ Berhasil menambahkan **${money.toLocaleString()} money** ke **${addedUsers} anggota** dalam grup ini!`, m);
};

handler.help = ["addmoneygrub"];
handler.tags = ["owner"];
handler.command = /^(addmoneygrub)$/i;
handler.owner = true;
handler.group = true;

export default handler;