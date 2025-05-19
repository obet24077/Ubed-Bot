import WSF from 'wa-sticker-formatter';
import axios from 'axios';

const handler = async (m, { conn, args, command }) => {
    const validColors = {
        pink: '#FFC0CB', red: '#FF0000', blue: '#0000FF', green: '#008000', yellow: '#FFFF00',
        black: '#000000', white: '#FFFFFF', orange: '#FFA500', purple: '#800080', brown: '#A52A2A',
        cyan: '#00FFFF', magenta: '#FF00FF', lime: '#00FF00', indigo: '#4B0082', violet: '#8A2BE2',
        gold: '#FFD700', silver: '#C0C0C0', beige: '#F5F5DC', teal: '#008080', navy: '#000080',
        maroon: '#800000', coral: '#FF7F50', turquoise: '#40E0D0', peach: '#FFDAB9', salmon: '#FA8072',
        mint: '#98FF98', lavender: '#E6E6FA', chartreuse: '#7FFF00', khaki: '#F0E68C', plum: '#DDA0DD',
        olive: '#808000', orchid: '#DA70D6', sienna: '#A0522D', tomato: '#FF6347', tan: '#D2B48C',
        snow: '#FFFAFA', azure: '#007FFF', slategray: '#708090', royalblue: '#4169E1', fuchsia: '#FF00FF',
        lavenderblush: '#FFF0F5'
    };

    if (args[0] === 'color') {
        return m.reply(`Daftar warna yang tersedia:\n\n` + 
            Object.keys(validColors).map((color, index) => `${index + 1}. ${color}`).join("\n"));
    }

    let text = args.length > 1 ? args.slice(1).join(" ") : (args.length === 1 ? args[0] : m.quoted?.text);

    if (!text) {
        return m.reply(`Contoh penggunaan: .${command} Halo Dunia\n\nGunakan .${command} Color <Text> Untuk Melihat Daftar Warna Ketik .qc color`);
    }

    // Ganti warna latar belakang menjadi mint
    let backgroundColor = '#98FF98';  // Mint

    // Teks nama warna mint dan kalimat warna putih
    let nameColor = '#98FF98';  // Mint
    let textColor = '#FFFFFF';  // Putih

    let pp = await conn.profilePictureUrl(m.sender, 'image').catch(() => 'https://telegra.ph/file/320b066dc81928b782c7b.png');

    const obj = {
        type: "quote",
        format: "png",
        backgroundColor: backgroundColor, // Mint
        width: 512,
        height: 768,
        scale: 2,
        messages: [{
            entities: [],
            avatar: true,
            from: {
                id: 1,
                name: m.name || "Pengguna",
                photo: { url: pp },
                textColor: nameColor // Nama berwarna mint
            },
            text: text,
            textColor: textColor, // Kalimat berwarna putih
            replyMessage: {}
        }]
    };

    try {
        const json = await axios.post('https://qc.botcahx.eu.org/generate', obj, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (!json.data.result || !json.data.result.image) {
            throw new Error("Gagal mendapatkan gambar dari API.");
        }

        const buffer = Buffer.from(json.data.result.image, 'base64');
        let stiker = await sticker5(buffer, false, global.packname, global.author);
        if (stiker) {
            return conn.sendFile(m.chat, stiker, 'Quotly.webp', '', m);
        } else {
            return m.reply("Gagal membuat stiker.");
        }
    } catch (error) {
        console.error(error);
        return m.reply("Terjadi kesalahan saat membuat stiker. Coba lagi nanti.");
    }
};

handler.help = ['qc25'];
handler.tags = ['sticker'];
handler.command = /^(qc25)$/i;

export default handler;

async function sticker5(img, url, packname, author, categories = ['']) {
    try {
        const stickerMetadata = { type: 'full', pack: packname, author, categories };
        return await new WSF.Sticker(img ? img : url, stickerMetadata).build();
    } catch (error) {
        console.error("Gagal membuat stiker:", error);
        return null;
    }
}