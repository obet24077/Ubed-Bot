const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = (await import("@adiwajshing/baileys")).default;
import axios from 'axios';
import cheerio from 'cheerio';

let handler = async (m, { conn, text, args, command, usedPrefix }) => {
    if (!text) throw 'Mana Kak Linknya?';

    await conn.sendMessage(m.chat, { react: { text: "🔍", key: m.key } });

    // Ganti URL utama dan URL cadangan sesuai kebutuhan
    let mainUrl = `https://dlpanda.com/id?url=${text}&token=G7eRpMaa`;
    let backupUrl = `https://dlpanda.com/id?url=${text}&token51=G32254GLM09MN89Maa`;
    let creator = 'Ubed Bot';
    let imgSrc = [];

    try {
        const getImages = async (url) => {
            try {
                const response = await axios.get(url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/117.0',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                        'Accept-Language': 'id,en-US;q=0.7,en;q=0.3',
                        'Accept-Encoding': 'gzip, deflate, br',
                        'Connection': 'keep-alive',
                        // 'Cookie': 'cookie-data-here', // Anda mungkin perlu mengisi cookie jika diperlukan
                        'Upgrade-Insecure-Requests': '1',
                        'Sec-Fetch-Dest': 'document',
                        'Sec-Fetch-Mode': 'navigate',
                        'Sec-Fetch-Site': 'same-origin',
                        'Sec-Fetch-User': '?1'
                    }
                });
                const html = response.data;
                const $ = cheerio.load(html);
                let images = [];
                $('div.col-md-12 > img').each((index, element) => {
                    images.push($(element).attr('src'));
                });
                return images;
            } catch (error) {
                console.error(`Gagal mengambil gambar dari ${url}:`, error);
                return [];
            }
        };

        imgSrc = await getImages(mainUrl);

        if (imgSrc.length === 0) {
            imgSrc = await getImages(backupUrl);
            if (imgSrc.length === 0) {
                await conn.sendMessage(m.chat, {
                    react: {
                        text: "❌",
                        key: m.key
                    }
                });
                throw 'Gagal mendapatkan gambar dari kedua URL.';
            }
        }

        let push = [];
        for (let img of imgSrc) {
            const media = await prepareWAMessageMedia(
                { image: { url: img } },
                { upload: conn.waUploadToServer }
            );

            push.push({
                header: proto.Message.InteractiveMessage.Header.fromObject({
                    title: `🖼️ TikTok Slide`, // Mengganti title agar sesuai
                    hasMediaAttachment: true,
                    ...media
                }),
                body: proto.Message.InteractiveMessage.Body.fromObject({
                    text: `Gambar dari TikTok Slide` // Teks body generik
                }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({
                    text: `Downloaded by ${creator}`
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                    buttons: [
                        {
                            name: "detail", // Nama button generik
                            buttonParamsJson: JSON.stringify({
                                display_text: "Lihat Gambar", // Teks button generik
                                url: "#" // URL placeholder karena tidak ada URL spesifik
                            })
                        }
                    ]
                })
            });
        }

        const msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    businessMessageForwardInfo: { businessOwnerJid: conn.decodeJid(conn.user.id) },
                    forwardingScore: 256,
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: proto.Message.InteractiveMessage.Body.create({
                            text: `🖼️ *TikTok Slide:* ${text}`
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.create({
                            text: `Total ${push.length} gambar | > ${creator}`
                        }),
                        carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                            cards: [...push]
                        })
                    })
                }
            }
        }, { userJid: m.chat, quoted: m });

        await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
        await conn.sendMessage(m.chat, {
            react: {
                text: "✅",
                key: m.key
            }
        });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(m.chat, {
            react: {
                text: "❌",
                key: m.key
            }
        });
        throw `Terjadi kesalahan saat mencoba mendownload gambar: ${e}`;
    }
};

handler.help = ['tiktokslide <url>'];
handler.tags = ['downloader'];
handler.command = /^(ttimg|tiktokimg|tiktokslide|ttslide)$/i;

export default handler;