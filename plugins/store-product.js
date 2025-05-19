import fs from 'fs';
import { promises as fsPromises } from 'fs';
import uploadImage from '../lib/uploadImage.js';
import path from 'path';
const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = (await import("@adiwajshing/baileys")).default;

const productPath = './src/product.json';
const productDir = './src/product';

let handler = async (m, { conn, args, usedPrefix, command, groupMetadata }) => {
    let groupId = m.chat;
    let groupAdmins = groupMetadata.participants.filter((p) => p.admin).map((p) => p.id);
    let isAdmin = groupAdmins.includes(m.sender);

    async function readProductData() {
        try {
            const data = await fsPromises.readFile(productPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            await fsPromises.writeFile(productPath, '{}', 'utf8');
            return {};
        }
    }

    async function writeProductData(data) {
        await fsPromises.writeFile(productPath, JSON.stringify(data, null, 2), 'utf8');
    }

    if (!fs.existsSync(productDir)) {
        fs.mkdirSync(productDir, { recursive: true });
    }

    let productData = await readProductData();
    if (!productData[groupId]) productData[groupId] = [];

    if (command === 'addlist') {
        if (!isAdmin) throw 'Perintah ini hanya bisa dipake admin grup, Senpai!';
        if (!args[0]) throw `Cara pake: ${usedPrefix + command} <judul>|<isi>[|urlfoto]`;
        let [judul, isi, urlFoto] = args.join(' ').split('|');
        if (!judul || !isi) throw 'Format salah! Pake <judul>|<isi>[|urlfoto] ya!';

        let imageUrl = null;
        let imagePath = null;
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';

        if (/image/.test(mime)) {
            m.reply('Proses gambar dulu ya, tunggu bentar, Senpai...');
            let media = await q.download();
            if (!media) throw 'Gambar gak bisa diunduh, coba lagi!';
            imageUrl = await uploadImage(media);
            imagePath = path.join(productDir, `${judul}.png`);
            await fsPromises.writeFile(imagePath, media);
        } else if (urlFoto && urlFoto.startsWith('http')) {
            imageUrl = urlFoto;
        }

        productData[groupId].push({
            judul,
            isi,
            imageUrl: imageUrl || null,
            imagePath: imagePath || null
        });

        await writeProductData(productData);
        m.reply(`Produk udah ditambah! ${imageUrl ? 'Gambar juga udah masuk!' : ''} 🎉`);
    }

    if (command === 'dellist') {
        if (!isAdmin) throw 'Admin grup doang yang bisa pake ini, Senpai!';
        if (!args[0]) throw `Cara pake: ${usedPrefix + command} <id> (contoh: ${usedPrefix + command} 1)`;
        let id = parseInt(args[0]) - 1;
        if (id < 0 || id >= productData[groupId].length) throw 'ID produk gak valid!';
        let produk = productData[groupId][id];
        if (produk.imagePath && fs.existsSync(produk.imagePath)) {
            await fsPromises.unlink(produk.imagePath);
        }
        productData[groupId].splice(id, 1);
        await writeProductData(productData);
        m.reply('Produk udah dihapus, Senpai! 🚫');
    }

    if (command === 'updatelist') {
        if (!isAdmin) throw 'Cuma admin grup yang bisa update, Senpai!';
        if (!args[0]) throw `Cara pake: ${usedPrefix + command} <id> <judul>|<isi>`;
        let id = parseInt(args[0]) - 1;
        if (id < 0 || id >= productData[groupId].length) throw 'ID produk gak valid!';
        let [judul, isi] = args.slice(1).join(' ').split('|');
        if (!judul || !isi) throw 'Format salah! Pake <judul>|<isi> ya!';
        if (args[1].startsWith('-add')) {
            isi = args.slice(2).join(' ');
            productData[groupId][id].isi += '\n' + isi;
        } else {
            let oldProduk = productData[groupId][id];
            if (oldProduk.imagePath && judul !== oldProduk.judul) {
                let newImagePath = path.join(productDir, `${judul}.png`);
                if (fs.existsSync(oldProduk.imagePath)) {
                    await fsPromises.rename(oldProduk.imagePath, newImagePath);
                }
                productData[groupId][id].imagePath = newImagePath;
            }
            productData[groupId][id].judul = judul;
            productData[groupId][id].isi = isi;
        }
        await writeProductData(productData);
        m.reply('Produk udah diupdate, Senpai! 📝');
    }

    if (command === 'product') {
        if (args.length > 0) {
            let id = parseInt(args[0]) - 1;
            if (isNaN(id) || id < 0 || id >= productData[groupId].length) {
                throw `ID produk gak valid, Senpai! Pake angka dari 1 sampe ${productData[groupId].length}, atau ketik ${usedPrefix}product buat liat daftar!`;
            }
            let produk = productData[groupId][id];
            let teks = `Judul: ${produk.judul}\nIsi:\n${produk.isi}`;
            if (produk.imageUrl) {
                await conn.sendMessage(m.chat, {
                    image: { url: produk.imageUrl },
                    caption: teks
                }, { quoted: m });
            } else {
                m.reply(teks);
            }
        } else {
            if (productData[groupId].length === 0) {
                return m.reply('Belum ada produk di grup ini, Senpai! Tambah dulu pake .addlist ya!');
            }
            let pp = await conn.profilePictureUrl(m.sender, 'image').catch(() => 'https://telegra.ph/file/8904062b17875a2ab2984.jpg');

            let sections = [];
            for (let i = 0; i < productData[groupId].length; i++) {
                sections.push({
                    title: '',
                    rows: [{
                        header: '',
                        title: productData[groupId][i].judul,
                        description: '',
                        id: `.product ${i + 1}`
                    }]
                });
            }

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
                                body: { text: 'Pilih produk yang ada, Senpai:' },
                                footer: { text: wm || ' ' },
                                header: {
                                    title: '',
                                    subtitle: 'Daftar Produk',
                                    hasMediaAttachment: true,
                                    ...(await prepareWAMessageMedia(
                                        {
                                            document: { url: 'https://chat.whatsapp.com/CZy0SzJKnfoLib7ICMjS4e' },
                                            mimetype: 'image/webp',
                                            fileName: `[ Hello ${m.name} ]`,
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
                                        newsletterJid: '9999999@newsletter',
                                        serverMessageId: null,
                                        newsletterName: ' ',
                                    },
                                    externalAdReply: {
                                        showAdAttribution: true,
                                        title: '🪷🌷🌸',
                                        body: '',
                                        mediaType: 1,
                                        sourceUrl: '',
                                        thumbnailUrl: global.thumb || 'https://telegra.ph/file/8904062b17875a2ab2984.jpg',
                                        renderLargerThumbnail: true,
                                    },
                                },
                                nativeFlowMessage: {
                                    buttons: [{
                                        name: 'single_select',
                                        buttonParamsJson: JSON.stringify({
                                            title: 'Pilih Produk',
                                            sections: sections
                                        })
                                    }],
                                },
                            },
                        },
                    },
                },
                { quoted: m }
            );

            await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
        }
    }
};

handler.help = [
    'addlist <judul>|<isi>[|urlfoto]',
    'dellist <id>',
    'updatelist <id> <judul>|<isi> (opsional: -add buat nambah isi)',
    'product (opsional: <id>)'
];
handler.tags = ['store'];
handler.command = /^addlist|dellist|updatelist|product$/i;
handler.owner = false;
handler.group = true;

export default handler;