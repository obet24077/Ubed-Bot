const { generateWAMessageFromContent } = (await import("@adiwajshing/baileys")).default;

let handler = async (m, { conn }) => {
    let teks = `Pilih Tanggal Lahir Kamu`;

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
                        body: { text: teks },
                        footer: { text: "© Ubed Bot 2025" },
                        header: {
                            title: "",
                            subtitle: "Tanggal Lahir",
                            hasMediaAttachment: false
                        },
                        contextInfo: {
                            forwardingScore: 2024,
                            isForwarded: true,
                            mentionedJid: [m.sender]
                        },
                        nativeFlowMessage: {
                            buttons: [{
                                name: "single_select",
                                buttonParamsJson: JSON.stringify({
                                    title: "Pilih Tanggal",
                                    sections: [{
                                        title: "Tanggal Lahir (1–31)",
                                        highlight_label: "TTL",
                                        rows: Array.from({ length: 31 }, (_, i) => {
                                            let tgl = i + 1;
                                            return {
                                                header: "",
                                                title: `${tgl}`,
                                                description: "",
                                                id: `.editprofile ttl ${tgl}`
                                            };
                                        })
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

handler.help = ["pilihtanggal"];
handler.tags = ["rpg"];
handler.command = /^pilihtanggal$/i;

export default handler;