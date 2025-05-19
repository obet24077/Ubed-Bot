import fs from "fs";
import path from "path";
import url from "url";

const pluginFolder = "./plugins/";
const daysLimit = 7 * 24 * 60 * 60 * 1000; // 7 hari dalam milidetik

const handler = async (m, { conn }) => {
    let now = Date.now();
    let files = fs.readdirSync(pluginFolder).filter(file => file.endsWith(".js"));
    let categorizedPlugins = {}; // Objek untuk menyimpan plugin berdasarkan tags

    for (let file of files) {
        let filePath = path.join(pluginFolder, file);
        let stats = fs.statSync(filePath);
        let lastModified = stats.mtimeMs;

        if (now - lastModified <= daysLimit) {
            try {
                let modulePath = url.pathToFileURL(filePath).href;
                let plugin = await import(modulePath);
                if (plugin.default && plugin.default.tags) {
                    let tags = plugin.default.tags;
                    for (let tag of tags) {
                        if (!categorizedPlugins[tag]) {
                            categorizedPlugins[tag] = [];
                        }
                        categorizedPlugins[tag].push({
                            name: file.replace(".js", ""),
                            modified: new Date(lastModified).toLocaleString("id-ID"),
                        });
                    }
                }
            } catch (error) {
                console.error(`❌ Gagal memuat plugin ${file}:`, error);
            }
        }
    }

    if (Object.keys(categorizedPlugins).length === 0) {
        return m.reply("✅ Tidak ada fitur baru atau pembaruan dalam 7 hari terakhir.");
    }

    let message = "📌 **Daftar Fitur Baru/Fix (7 Hari Terakhir):**\n\n";
    for (let tag in categorizedPlugins) {
        message += `🗂 **${tag.toUpperCase()}**\n`;
        categorizedPlugins[tag].forEach((plugin, index) => {
            message += `🔹 *${plugin.name}*\n📅 Update: ${plugin.modified}\n\n`;
        });
    }

    m.reply(message);
};

handler.command = ["updatefitur"];
handler.tags = ["main"];
handler.help = ["updatefitur"];

export default handler;