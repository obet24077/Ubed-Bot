const { generateWAMessageFromContent, prepareWAMessageMedia } = (await import("@adiwajshing/baileys")).default;

let handler = async (m, { conn }) => {
    let pp = await conn.profilePictureUrl(m.sender, "image").catch(() => "https://files.catbox.moe/4tizh9.jpg");
    let oya = `Pilih Jumlah Uang yang Ingin Kamu Taruhkan`;

    let taruhanList = [
        ["10000", "10.000 IDR"], ["20000", "20.000 IDR"], ["50000", "50.000 IDR"],
        ["100000", "100.000 IDR"], ["200000", "200.000 IDR"], ["500000", "500.000 IDR"],
        ["all", "Semua Saldo"]
    ];

    let rows = taruhanList.map(([value, label]) => ({
        header: "",
        title: label,
        description: "Klik untuk mulai bertaruh",
        id: `.judi ${value}`
    }));

    let msg = generateWAMessageFromContent(
        m.chat,
        {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: {
                        body: { text: oya },
                        footer: { text: "© Ubed Bot 2025 - Game Judi" },
                        header: {
                            title: "",
                            subtitle: "Menu Judi Bot",
                            hasMediaAttachment: true,
                            ...(await prepareWAMessageMedia(
                                {
                                    document: {
                                        url: "https://chat.whatsapp.com/EfPjvlM7WIkBTfE5C2mNG1"
                                    },
                                    mimetype: "image/webp",
                                    fileName: `[ Hello ${m.pushName || 'Player'} ]`,
                                    pageCount: 2024,
                                    jpegThumbnail: await conn.resize(pp, 400, 400),
                                    fileLength: 2024000
                                },
                                { upload: conn.waUploadToServer }
                            ))
                        },
                        contextInfo: {
                            forwardingScore: 2025,
                            isForwarded: true,
                            mentionedJid: [m.sender],
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: "9999999@newsletter",
                                serverMessageId: null,
                                newsletterName: "Judi Game UbedBot"
                            },
                            externalAdReply: {
                                showAdAttribution: true,
                                title: "Game Judi by Ubed Bot",
                                mediaType: 1,
                                sourceUrl: "",
                                thumbnailUrl: "https://files.catbox.moe/4tizh9.jpg",
                                renderLargerThumbnail: true
                            }
                        },
                        nativeFlowMessage: {
                            buttons: [{
                                name: "single_select",
                                buttonParamsJson: JSON.stringify({
                                    title: "Pilih Jumlah Taruhan",
                                    sections: [{
                                        title: "Daftar Taruhan",
                                        highlight_label: "Judi Game",
                                        rows
                                    }]
                                })
                            }]
                        }
                    }
                }
            }
        },
        { quoted: m }
    );

    await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
};

handler.help = ["judi"];
handler.tags = ["game"];
handler.command = /^judigame$/i;

export default handler;