import fs from 'fs';
let handler = async (m, { conn }) => {
  conn.reply(m.chat, `${namebot} ᴠᴇʀsɪᴏɴ: *${global.version}*`, m, {
    contextInfo: {
      externalAdReply: {
      showAdAttribution: true,
        body: `ʙᴏᴛ ᴠᴇʀsɪᴏɴ: ${global.version}`,
        thumbnailUrl: 'https://telegra.ph/file/97fbd7a476a73c8489660.jpg',
        sourceUrl: sgc,
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  });
};

handler.command = ['version','versi'];
handler.help = ['version'];
handler.tags = ['info'];

export default handler;