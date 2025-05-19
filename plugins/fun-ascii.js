import figlet from 'figlet';

let handler = async (m, { text }) => {
  let styles = figlet.fontsSync();

  if (!text) {
    let list = styles.map(v => '- ' + v).join('\n');
    return m.reply(`Kirim perintah dengan format:\n.ascii <teks> | <style>\n\nContoh:\n.ascii ubed | Slant\n\nDaftar Style:\n${list}`);
  }

  let [kata, style] = text.split('|').map(v => v.trim());

  // Default ke "Standard" kalau style tidak ditentukan
  style = style || 'Standard';

  if (!styles.includes(style)) {
    return m.reply(`Style "${style}" tidak ditemukan!\nGunakan salah satu dari style berikut:\n\n${styles.join(', ')}`);
  }

  try {
    let hasil = figlet.textSync(kata, { font: style });
    m.reply('```' + hasil + '```');
  } catch (e) {
    m.reply('Gagal membuat ASCII. Coba lagi dengan teks yang berbeda.');
  }
};

handler.help = ['ascii <teks> | <style>'];
handler.tags = ['fun'];
handler.command = /^ascii$/i;

export default handler;