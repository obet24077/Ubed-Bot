const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = (await import('@adiwajshing/baileys')).default;

const handler = async (m, { conn }) => {
  await conn.sendMessage(m.chat, { react: { text: '🍏', key: m.key }});

  const msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.fromObject({
          contextInfo: {
            mentionedJid: [m.sender],
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363369035192952@newsletter',
              newsletterName: 'Powered By : Ubed',
              serverMessageId: -1
            },
            businessMessageForwardInfo: { businessOwnerJid: conn.decodeJid(conn.user.id) },
            forwardingScore: 256,
            externalAdReply: {  
              title: 'ubed',
              thumbnailUrl: 'https://files.catbox.moe/xxzzyv.jpg',
              sourceUrl: 'https://whatsapp.com/channel/0029Vb1ryLH3WHTd0blIVg3Z',
              mediaType: 2,
              renderLargerThumbnail: false
            }
          },
          body: proto.Message.InteractiveMessage.Body.fromObject({
            text: `*Hello, @${m.sender.replace(/@.+/g, '')}!*\nSilahkan Lihat Produk Di Bawah!`
          }),
          footer: proto.Message.InteractiveMessage.Footer.fromObject({
            text: 'Powered By _WhatsApp_'
          }),
          header: proto.Message.InteractiveMessage.Header.fromObject({
            hasMediaAttachment: false
          }),
          carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
            cards: [
              {
                body: proto.Message.InteractiveMessage.Body.fromObject({
                  text: '> *1 Bulan : 10.000*\n> *2 Bulan : 15.000*\n> *Permanen : 25.000*\n\n`</> Benefit Prem </>`\n\n> Get Unlimited Limit\n> Get Acces All Fitur\n> Get Profile Good'
                }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({}),
                header: proto.Message.InteractiveMessage.Header.fromObject({
                  title: '`</> Premium Bot </>`\n',
                  hasMediaAttachment: true,
                  ...(await prepareWAMessageMedia({ image: { url: 'https://files.catbox.moe/xxzzyv.jpg' } }, { upload: conn.waUploadToServer }))
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                  buttons: [
                    {
                      name: "cta_url",
                      buttonParamsJson: `{"display_text":"Order Here!","url":"https://wa.me/6285147777105","merchant_url":"https://wa.me/6285147777105"}`
                    }
                  ]
                })
              },
              {
                body: proto.Message.InteractiveMessage.Body.fromObject({
                  text: '> *30 Days : 20.000*\n> *1 Tahun : 45.000*\n> *Permanen : 60.000*\n\n`</> Benefit Sewa </>`\n\n> Auto Welcome\n> Auto Kick\n> Auto Open/Close'
                }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({}),
                header: proto.Message.InteractiveMessage.Header.fromObject({
                  title: '`</> Sewa Bot </>`\n',
                  hasMediaAttachment: true,
                  ...(await prepareWAMessageMedia({ image: { url: 'https://files.catbox.moe/xxzzyv.jpg' } }, { upload: conn.waUploadToServer }))
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                  buttons: [
                    {
                      name: "cta_url",
                      buttonParamsJson: `{"display_text":"Order Here!","url":"https://wa.me/6285147777105","merchant_url":"https://wa.me/6282256578235"}`
                    }
                  ]
                })
              },
              {
                body: proto.Message.InteractiveMessage.Body.fromObject({
                  text: '> *No Update Fitur : 80.000*\n> *Update Fitur : 120.000*\n> *- : -*\n\n`</> Benefit Beli </>`\n\n> Dapet SC Premium\n> Support All Button\n> Fix Fitur Error'
                }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({}),
                header: proto.Message.InteractiveMessage.Header.fromObject({
                  title: '`*Harga Script*`\n',
                  hasMediaAttachment: true,
                  ...(await prepareWAMessageMedia({ image: { url: 'https://files.catbox.moe/xxzzyv.jpg' } }, { upload: conn.waUploadToServer }))
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                  buttons: [
                    {
                      name: "cta_url",
                      buttonParamsJson: `{"display_text":"Order Here!","url":"https://wa.me/6285147777105","merchant_url":"https://wa.me/6285147777105"}`
                    }
                  ]
                })
              }
            ]
          })
        })
      }
    }
  }, { userJid: m.chat, quoted: m });
  
  await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
};

handler.help = ['sewabot', 'premium'];
handler.tags = ['main'];
handler.command = /^(sewa|sewabot|premium|sew)$/i;
handler.private = false;

export default handler;