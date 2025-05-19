let handler = async (m, { conn, text, usedPrefix, command }) => {
  let users = global.db.data.users;
  let user = users[m.sender]; // Mengambil data pengguna yang mengirim pesan

  // Fitur untuk merampok
  if (command === 'merampok' || command === 'rob') {
    let target = m.mentionedJid[0] || text.split(' ')[1]; // Target yang akan dirampok
    if (!target) {
      return conn.reply(m.chat, `Tag orang yang ingin kamu rampok, misalnya: ${usedPrefix}merampok @user`, m);
    }
    if (typeof users[target] === 'undefined') {
      return conn.reply(m.chat, 'Pengguna yang kamu pilih tidak ditemukan!', m);
    }

    let targetUser = users[target];

    // Cek apakah target memiliki proteksi anti-rampok
    if (targetUser.antirampok) {
      return conn.reply(m.chat, 'Pengguna ini memiliki proteksi anti-rampok, saldo mereka tidak bisa dirampok!', m);
    }

    // Periksa apakah pengguna yang merampok sudah bisa merampok
    let __timers = (new Date - user.lastrob);
    let _timers = (3600000 - __timers);
    let timers = clockString(_timers);

    if (_timers > 0) {
      return conn.reply(m.chat, `Kamu sudah merampok sebelumnya, tunggu ${timers} untuk merampok lagi.`, m);
    }

    // Cek apakah target memiliki uang
    if (targetUser.money <= 10000) {
      return conn.reply(m.chat, 'Orang yang kamu tag tidak memiliki uang yang cukup untuk dirampok.', m);
    }

    // Tentukan jumlah uang yang akan dirampok secara acak
    let dapat = Math.floor(Math.random() * 100000);

    // Kurangi uang target dan tambahkan ke uang pengguna
    targetUser.money -= dapat;
    user.money += dapat;

    // Simpan waktu terakhir merampok
    user.lastrob = new Date * 1;

    conn.reply(m.chat, `Berhasil merampok Rp.${dapat} dari ${target}, saldo kamu sekarang: Rp.${user.money}`, m);
  }

  // Fitur untuk mengaktifkan atau menonaktifkan Anti-Rampok
  if (text === 'on') {
    if (user.antirampok) {
      return conn.reply(m.chat, 'Fitur Anti-Rampok sudah aktif!', m);
    }
    user.antirampok = true; // Mengaktifkan Anti-Rampok
    conn.reply(m.chat, 'Fitur Anti-Rampok berhasil diaktifkan! Saldo kamu tidak bisa dirampok.', m);
  } else if (text === 'off') {
    if (!user.antirampok) {
      return conn.reply(m.chat, 'Fitur Anti-Rampok sudah tidak aktif!', m);
    }
    user.antirampok = false; // Menonaktifkan Anti-Rampok
    conn.reply(m.chat, 'Fitur Anti-Rampok berhasil dinonaktifkan! Kamu sekarang bisa dirampok.', m);
  } else {
    conn.reply(m.chat, `Gunakan perintah *${usedPrefix}antirampok* on untuk mengaktifkan atau *${usedPrefix}antirampok* off untuk menonaktifkan Anti-Rampok.`, m);
  }
};

// Fungsi untuk menghitung timer
function clockString(ms) {
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000);
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24;
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
  return ['\n' + d, ' *Hari*\n ', h, ' *Jam*\n ', m, ' *Menit*\n ', s, ' *Detik* '].map(v => v.toString().padStart(2, 0)).join('');
}

handler.help = ['antirampok [on/off]', 'merampok [@user]'];
handler.tags = ['rpg'];
handler.command = /^antirampok$|^merampok$|^rob$/;
handler.limit = true;

export default handler;