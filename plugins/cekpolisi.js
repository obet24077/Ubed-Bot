import fs from "fs";

let dataFile = "./database/polisiData.json";
let data = fs.existsSync(dataFile) ? JSON.parse(fs.readFileSync(dataFile)) : { polisi: [] };

let handler = async (m, { conn }) => {
    if (data.polisi.length === 0) return m.reply("🚨 Tidak ada polisi yang terdaftar!");

    let listPolisi = data.polisi.map((polisi, index) => `*${index + 1}.* @${polisi.split("@")[0]}`).join("\n");

    let caption = `🚔 *Daftar Polisi Terdaftar* 🚔\n\n${listPolisi}`;

    await conn.sendMessage(m.chat, { text: caption, mentions: data.polisi });
};

handler.help = ["listpolisi"];
handler.tags = ["rpg"];
handler.command = /^(listpolisi|cekpolisi)$/i;

export default handler;