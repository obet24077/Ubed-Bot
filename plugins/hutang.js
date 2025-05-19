let handler = async (m, { conn, command }) => {
  let user = global.db.data.users[m.sender];

  // Pastikan 'flaaa.getRandom()' menghasilkan gambar acak yang valid
  let imgr = flaaa.getRandom(); 

  // Menambahkan beberapa variabel yang tidak didefinisikan sebelumnya
  const htki = "🔸"; // Misalnya: set ikon untuk header
  const htka = "🔸"; // Misalnya: set ikon untuk footer
  const dmenub = "⧫"; // Misalnya: set simbol untuk baris menu
  const dmenuf = "⧫"; // Misalnya: set simbol untuk footer menu

  // Membuat caption untuk pesan
  const caption = `
${htki} *H U T A N G  U S E R* ${htka}
${dmenub} 📛 *Name:* ${user.registered ? user.name : conn.getName(m.sender)}
${dmenub} 💹 *Money:* ${user.money} 💲
${dmenuf}
`.trim();
  
  // Mengirim gambar dan caption ke chat
  await conn.sendFile(m.chat, imgr, "", caption, m);
};

handler.help = ['hutang'];
handler.tags = ['rpg'];
handler.command = /^(hutang)$/i;

handler.register = false;
export default handler;