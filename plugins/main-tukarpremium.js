const { generateWAMessageFromContent, prepareWAMessageMedia } = (await import("@adiwajshing/baileys")).default;

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let who = m.sender;
    let user = db.data.users[who];
    let pp = await conn.profilePictureUrl(who, "image").catch(() => "https://telegra.ph/file/8904062b17875a2ab2984.jpg");

    if (!text || isNaN(text.trim())) {
        let oya = `*Harga Premium*

* 1 Hari = 10,286 Limit
* 7 Hari = 72,002 Limit
* 14 Hari = 144,004 Limit
* 21 Hari = 216,006 Limit
* 30 Hari = 308,580 Limit

Pilih jumlah hari premium yang ingin dibeli:`;

        let msg = generateWAMessageFromContent(
            m.chat,
            {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadata: {},
                            deviceListMetadataVersion: 2,
                        },
                        interactiveMessage: {
                            body: { text: oya },
                            footer: { text: wm },
                            header: {
                                title: "",
                                subtitle: "Menu",
                                hasMediaAttachment: true,
                                ...(await prepareWAMessageMedia(
                                    {
                                        document: {
                                            url: "https://chat.whatsapp.com/CZy0SzJKnfoLib7ICMjS4e",
                                        },
                                        mimetype: "image/webp",
                                        fileName: `[ Hello ${user.name} ]`,
                                        pageCount: 2024,
                                        jpegThumbnail: await conn.resize(pp, 400, 400),
                                        fileLength: 2024000,
                                    },
                                    { upload: conn.waUploadToServer }
                                )),
                            },
                            contextInfo: {
                                forwardingScore: 2024,
                                isForwarded: true,
                                mentionedJid: [m.sender],
                                forwardedNewsletterMessageInfo: {
                                    newsletterJid: "9999999@newsletter",
                                    serverMessageId: null,
                                    newsletterName: `© ${global.namebot}`,
                                },
                                externalAdReply: {
                                    showAdAttribution: true,
                                    title: "[ Yue Arifureta ]",
                                    body: "",
                                    mediaType: 1,
                                    sourceUrl: "",
                                    thumbnailUrl: global.thumb,
                                    renderLargerThumbnail: true,
                                },
                            },
                            nativeFlowMessage: {
                                buttons: [
                                    {
                                        name: "single_select",
                                        buttonParamsJson: 
                                            '{"title":"Pilih Hari Premium","sections":[{"title":"Pilih Durasi","rows":[{"title":"1 Hari","description":"10,286 Limit","id":".tukarprem 1"},{"title":"7 Hari","description":"72,002 Limit","id":".tukarprem 7"},{"title":"14 Hari","description":"144,004 Limit","id":".tukarprem 14"},{"title":"21 Hari","description":"216,006 Limit","id":".tukarprem 21"},{"title":"30 Hari","description":"308,580 Limit","id":".tukarprem 30"}]}]}'
                                    },
                                ],
                            },
                        },
                    },
                },
            },
            { quoted: m }
        );

        await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
        return;
    }

    let daysPremium = parseInt(text.trim());
    if (isNaN(daysPremium) || daysPremium < 1 || daysPremium > 30) {
        throw `Masukkan jumlah hari yang valid antara 1 hingga 30.`;
    }

    let requiredLimit = daysPremium * 10286;
    if (user.limit < requiredLimit) throw `Kamu butuh ${requiredLimit} limit untuk membeli ${daysPremium} hari premium.`;

    user.limit -= requiredLimit;
    let jumlahHari = 86400000 * daysPremium;
    let now = Date.now();

    if (now < user.premiumTime) user.premiumTime += jumlahHari;
    else user.premiumTime = now + jumlahHari;
    user.premium = true;

    m.reply(`Sukses\n*Nama:* ${user.name}\n*Selama:* ${daysPremium} Hari\n*Sisa Limit:* ${user.limit}`);
};

handler.help = ['tukarprem'];
handler.tags = ['main'];
handler.command = /^(tukarprem|tukarpremium)$/i;
handler.group = false;
handler.rowner = false;

export default handler;