const { proto, prepareWAMessageMedia, generateWAMessageFromContent } = (await import('@adiwajshing/baileys')).default;

let handler = async function (m, { conn }) {
  // Link grup utama
  const gcLink = 'https://chat.whatsapp.com/EfPjvlM7WIkBTfE5C2mNG1';

  // Mengambil foto profil pengguna atau menggunakan default jika tidak ditemukan
  const pp = await conn.profilePictureUrl(m.sender, "image").catch((_) => "https://telegra.ph/file/ee60957d56941b8fdd221.jpg");

  // Mengambil nama pengguna
  let name = await conn.getName(m.sender);

  // Menyiapkan media untuk foto profil
  let media = await prepareWAMessageMedia({ image: { url: pp } }, { upload: conn.waUploadToServer });

  // Membuat pesan interaktif dengan tombol untuk menyalin link grup
  let msgs = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        "messageContextInfo": {
          "deviceListMetadata": {},
          "deviceListMetadataVersion": 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({
            text: `${name}, Berikut adalah link grup utama bot:\n${gcLink}`
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: "Klik untuk menyalin link"
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            title: "> 📝 Salin Link Grup Bot Utama",
            subtitle: "> 📝 Salin link grup bot utama di bawah ini",
            hasMediaAttachment: true,
            ...media
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
              {
                "name": "cta_copy",
                "buttonParamsJson": JSON.stringify({
                  "display_text": "Klik untuk salin link",
                  "id": "123456789",
                  "copy_code": gcLink
                })
              }
            ]
          })
        })
      }
    }
  }, {});

  // Mengirim pesan ke pengguna
  conn.relayMessage(m.key.remoteJid, msgs.message, {
    messageId: m.key.id
  });
}

handler.help = ['gcbot'];
handler.tags = ['main'];
handler.command = /^(gcbot)$/i;
handler.register = true;

export default handler;