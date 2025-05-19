const handler = async (m, { conn, args }) => {
  try {
    if (!args[0]) throw 'Masukkan nama, contoh: *.bucinserti Ubed*';

    await conn.sendMessage(m.chat, { react: { text: '❤️', key: m.key } });

    const name = encodeURIComponent(args.join(' '));
    const imageUrl = `https://api.lolhuman.xyz/api/bucinserti?apikey=ubed2407&name=${name}`;

    await conn.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: 'Bucin Sertifikat oleh Ubed Bot'
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (err) {
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    await conn.sendMessage(m.chat, {
      text: `Terjadi kesalahan: ${err.message || err}`
    }, { quoted: m });
  }
};

handler.help = ['bucinstk <nama>'];
handler.tags = ['maker'];
handler.command = ['bucinstk'];
handler.limit = true;

export default handler;