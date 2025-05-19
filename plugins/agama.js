const { generateWAMessageFromContent } = (await import("@adiwajshing/baileys")).default;

let handler = async (m, { conn }) => {
    let oya = `Pilih Agama Kamu`;

    let agamaList = [
        ["🕌", "Islam"],
        ["✝️", "Kristen"],
        ["✝️", "Katolik"],
        ["🕉️", "Hindu"],
        ["☸️", "Buddha"],
        ["🕎", "Yahudi"],
        ["⛩️", "Shinto"],
        ["🧘‍♂️", "Konghucu"],
        ["❓", "Lainnya"]
    ];

    let rows = agamaList.map(([icon, name]) => ({
        header: "",
        title: `${icon} ${name}`,
        description: "Pilih agama ini",
        id: `.editprofile agama ${name}`
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
                        footer: { text: "© Ubed Bot 2025" },
                        header: {
                            title: "",
                            subtitle: "Pilih Agama",
                            hasMediaAttachment: false
                        },
                        contextInfo: {
                            forwardingScore: 2024,
                            isForwarded: true,
                            mentionedJid: [m.sender],
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: "9999999@newsletter",
                                serverMessageId: null,
                                newsletterName: "© Ubed Bot 2025"
                            }
                        },
                        nativeFlowMessage: {
                            buttons: [{
                                name: "single_select",
                                buttonParamsJson: JSON.stringify({
                                    title: "Pilih Agama Kamu",
                                    sections: [{
                                        title: "Daftar Agama",
                                        highlight_label: "RPG",
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

handler.help = ["agama"];
handler.tags = ["rpg"];
handler.command = /^agama$/i;

export default handler;