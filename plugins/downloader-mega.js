import { File } from "megajs";
import { fileTypeFromBuffer } from "file-type";
import fetch from "node-fetch";

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0])
    return m.reply(
      `Masukkan URL!\n\nContoh :\n${usedPrefix + command} https://mega.nz/file/FltHDCzD#oNm8SD_e9oFTCczmnEW4zB9gsakSGzVaVtd9euj7yK8`,
    );

  let file = File.fromURL(args[0]);
  try {
    file = await file.loadAttributes();
    let data = await file.downloadBuffer();
    let mimetype = await fileTypeFromBuffer(data);
    await conn.sendMessage(
      m.chat,
      { document: data, fileName: file.name, mimetype },
      { quoted: m },
    );
  } catch (e) {
    throw e;
  }
};
handler.help = ["mega"];
handler.tags = ["downloader"];
handler.command = /^mega(dl)?$/i;
handler.limit = true;

export default handler;