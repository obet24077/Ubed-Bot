let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender];
  let {
    paus, kepiting, gurita, cumi, buntal, dory,
    lumba, lobster, hiu, udang, ikan, orca,
    pancingan, anakpancingan
  } = user;

  let levelPancing = pancingan == 0 ? 'Tidak Punya'
                  : pancingan == 1 ? 'Level 1'
                  : pancingan == 2 ? 'Level 2'
                  : pancingan == 3 ? 'Level 3'
                  : pancingan == 4 ? 'Level 4'
                  : 'Level MAX';

  let nextLevel = pancingan < 5 ? `To level *${pancingan + 1}*` : '*Max Level*';
  let expProgress = pancingan < 5 ? `Exp *${anakpancingan}* → *${pancingan * 10000}*` : '';

  let teks = `
╭───〔  *INVENTORY KOLAM IKAN*  〕───⬣

🐟 *Ikan Kolammu:*
🦈 Hiu        : ${hiu}
🐟 Ikan       : ${ikan}
🐠 Dory       : ${dory}
🐋 Orca       : ${orca}
🐳 Paus       : ${paus}
🦑 Cumi       : ${cumi}
🐙 Gurita     : ${gurita}
🐡 Buntal     : ${buntal}
🦐 Udang      : ${udang}
🐬 Lumba²     : ${lumba}
🦞 Lobster    : ${lobster}
🦀 Kepiting   : ${kepiting}

🎣 *Level Pancingan:*
${pancingan > 0 ? `🎣 ${levelPancing} ${pancingan < 5 ? `→ Level *${pancingan + 1}*` : ''}` : '❌ Tidak Punya Pancingan'}
${pancingan < 5 ? `📊 ${expProgress}` : ''}

╰────────────────────────⬣
`.trim();

  m.reply(teks);
};

handler.help = ['inventorykolam', 'invkolam'];
handler.tags = ['rpg'];
handler.command = ['inventorykolam', 'invkolam'];
handler.register = true;

export default handler;