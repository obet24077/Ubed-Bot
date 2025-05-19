let handler = async (m, {
    conn,
    usedPrefix
}) => {
    let banteng = global.db.data.users[m.sender].banteng
    let harimau = global.db.data.users[m.sender].harimau
    let gajah = global.db.data.users[m.sender].gajah
    let kambing = global.db.data.users[m.sender].kambing
    let panda = global.db.data.users[m.sender].panda
    let buaya = global.db.data.users[m.sender].buaya
    let kerbau = global.db.data.users[m.sender].kerbau
    let sapi = global.db.data.users[m.sender].sapi
    let monyet = global.db.data.users[m.sender].monyet
    let babihutan = global.db.data.users[m.sender].babihutan
    let babi = global.db.data.users[m.sender].babi
    let ayam = global.db.data.users[m.sender].ayam
    let ikanKecil = global.db.data.users[m.sender].ikanKecil
    let ikanBesar = global.db.data.users[m.sender].ikanBesar

    // Total hewan besar
    let totalHewanBesar = banteng + harimau + gajah + buaya + kerbau + sapi + babihutan + babi;

    // Hewan-hewan besar
    let hewanBesar = `
Hewan-hewan Besar (Total: ${totalHewanBesar}):
• 🐂 Banteng:    ${banteng} Ekor
• 🐅 Harimau:    ${harimau} Ekor
• 🐘 Gajah:    ${gajah} Ekor
• 🐊 Buaya:    ${buaya} Ekor
• 🐃 Kerbau:    ${kerbau} Ekor
• 🐄 Sapi:    ${sapi} Ekor
• 🐖 Babi Hutan:    ${babihutan} Ekor
• 🐖 Babi:    ${babi} Ekor
    `;

    // Total hewan kecil
    let totalHewanKecil = kambing + panda + monyet + ayam;

    // Hewan-hewan kecil
    let hewanKecil = `
Hewan-hewan Kecil (Total: ${totalHewanKecil}):
• 🐐 Kambing:    ${kambing} Ekor
• 🐼 Panda:    ${panda} Ekor
• 🐒 Monyet:    ${monyet} Ekor
• 🐔 Ayam:    ${ayam} Ekor
    `;

    let ndy = `
List Hewan Di Kandang
${hewanBesar}
${hewanKecil}
    `.trim();
    conn.reply(m.chat, ndy, m);
};

handler.help = ['kandang'];
handler.tags = ['rpg'];
handler.command = /^(kandang)$/i;

export default handler;