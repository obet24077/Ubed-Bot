import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

const handler = async (m, { conn, command, args }) => {
  if (command === 'ceknpm' && args.length > 0) {
    const packageName = args.join(' ');

    try {
      // Mengecek versi paket npm yang diminta
      const packageVersion = await execPromise(`npm show ${packageName} version`);
      
      const result = `
        *Versi dari ${packageName}:* ${packageVersion.stdout.trim()}
      `;

      conn.reply(m.chat, result, m);
    } catch (error) {
      conn.reply(m.chat, `Tidak dapat menemukan paket "${packageName}" atau terjadi kesalahan.` , m);
    }
  } else {
    conn.reply(m.chat, 'Silakan masukkan nama paket npm yang ingin dicek versinya. Contoh: `.ceknpm aki-api`', m);
  }
};

handler.help = ['ceknpm <nama_paket>'];
handler.tags = ['owner'];
handler.command = /^ceknpm$/i;

export default handler;