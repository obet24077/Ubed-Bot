import fs from 'fs';
import path from 'path';
import moment from 'moment-timezone';

const __dirname = path.resolve();
const dbFile = path.join(__dirname, './lib/sahabat.json');
if (!fs.existsSync('./lib')) fs.mkdirSync('./lib');
if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, '{}');

let sahabat = JSON.parse(fs.readFileSync(dbFile));
const saveSahabat = () => fs.writeFileSync(dbFile, JSON.stringify(sahabat, null, 2));

const ajakan = [
  "Mau nggak jadi sahabatku selamanya?",
  "Aku rasa kita cocok jadi sahabat. Gimana?",
  "Ayo jadi sahabat! Kita bisa saling jaga.",
  "Mau nggak nemenin hari-hariku sebagai sahabat?",
  "Kamu terlihat seperti sahabat sejati yang ku cari."
];

const putus = [
  "Sepertinya jalan kita cukup sampai di sini...",
  "Maaf, tapi aku ingin sendiri dulu.",
  "Terima kasih sudah menjadi sahabatku, tapi aku ingin mengakhiri ini.",
  "Kita sudah tidak cocok lagi sebagai sahabat.",
  "Sahabat juga bisa berpisah, kan?"
];

const pendingAjakan = {}; // session memory

const handler = async (m, { conn, args, command }) => {
  const sender = m.sender.replace(/[^0-9]/g, '');
  const mention = m.mentionedJid?.[0];

  // .sahabat
  if (command === 'sahabat') {
    if (!mention) return m.reply('Tag seseorang untuk diajak jadi sahabat.');
    const target = mention.replace(/[^0-9]/g, '');
    if (target === sender) return m.reply('Kamu tidak bisa ngajak dirimu sendiri.');
    if (sahabat[sender]?.[target]) return m.reply('Kalian sudah bersahabat!');

    pendingAjakan[target] = pendingAjakan[target] || [];
    if (!pendingAjakan[target].includes(sender)) pendingAjakan[target].push(sender);

    const teks = `${await conn.getName(m.sender)} mengajak ${await conn.getName(mention)} untuk menjadi sahabat.\n\n📩 Pesan: *"${ajakan[Math.floor(Math.random() * ajakan.length)]}"*\n\nKetik *.terimasahabat* untuk menerima.`;
    return conn.sendMessage(m.chat, { text: teks }, { quoted: m });
  }

  // .terimasahabat
  if (command === 'terimasahabat') {
    const pending = pendingAjakan[sender];
    if (!pending || pending.length === 0) return m.reply('Tidak ada yang mengajakmu jadi sahabat.');

    let teks = '*Kamu sekarang bersahabat dengan:*\n';
    for (let jid of pending) {
      sahabat[sender] = sahabat[sender] || {};
      sahabat[jid] = sahabat[jid] || {};
      const waktu = new Date().toISOString();

      sahabat[sender][jid] = waktu;
      sahabat[jid][sender] = waktu;

      teks += `- @${jid} (sejak ${moment(waktu).tz('Asia/Jakarta').format('DD MMMM YYYY, HH:mm')})\n`;
    }

    delete pendingAjakan[sender];
    saveSahabat();

    return conn.sendMessage(m.chat, {
      text: teks,
      mentions: Object.keys(sahabat[sender]).map(j => j + '@s.whatsapp.net')
    }, { quoted: m });
  }

  // .putussahabat
  if (command === 'putussahabat') {
    if (!mention) return m.reply('Tag sahabat yang ingin kamu putuskan.');

    const target = mention.replace(/[^0-9]/g, '');
    if (!sahabat[sender]?.[target]) return m.reply('Kalian bukan sahabat.');

    delete sahabat[sender][target];
    delete sahabat[target]?.[sender];
    if (Object.keys(sahabat[sender]).length === 0) delete sahabat[sender];
    if (sahabat[target] && Object.keys(sahabat[target]).length === 0) delete sahabat[target];

    saveSahabat();

    return conn.sendMessage(m.chat, {
      text: `@${target} ${putus[Math.floor(Math.random() * putus.length)]}`,
      mentions: [mention]
    }, { quoted: m });
  }

  // .daftarsahabat
  if (command === 'daftarsahabat') {
    const daftar = sahabat[sender];
    if (!daftar || Object.keys(daftar).length === 0) return m.reply('Kamu belum punya sahabat.');

    let teks = '*Daftar Sahabatmu:*\n';
    for (let jid in daftar) {
      const waktu = daftar[jid];
      let name = await conn.getName(jid + '@s.whatsapp.net');
      teks += `- ${name} (sejak ${moment(waktu).tz('Asia/Jakarta').format('DD MMM YYYY, HH:mm')})\n`;
    }

    return m.reply(teks.trim());
  }
};

handler.command = ['sahabat', 'terimasahabat', 'putussahabat', 'daftarsahabat'];
handler.group = true;
handler.tags = ["fun"];

export default handler;