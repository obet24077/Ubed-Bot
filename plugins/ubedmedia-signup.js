const handler = async (m, { command, args, text }) => {
  global.db.data.ubedAccounts ??= {};
  global.db.data.ubedSessions ??= {};

  const sender = m.sender;
  const accounts = global.db.data.ubedAccounts;
  const sessions = global.db.data.ubedSessions;

  const forbiddenSymbols = ['🅥', '✔️', '✅', '☑️']; // Tambahkan simbol lain jika perlu

  switch (command) {
    case 'signupubed': {
      if (sessions[sender]) return m.reply('⚠️ Kamu sudah login. Logout dulu dengan *.logoutubed*');

      const [name, pass] = text.split('|') || [];
      if (!name || !pass) return m.reply('❗ Format salah!\nContoh: *.signupubed ubed|12345*');

      const isForbidden = forbiddenSymbols.some(symbol => name.includes(symbol));
      if (isForbidden) return m.reply('❌ Username tidak boleh mengandung simbol verifikasi seperti 🅥 atau lainnya.');

      const exists = Object.values(accounts).find(u => u.username === name);
      if (exists) return m.reply('❗ Nama pengguna sudah digunakan.');

      accounts[sender] = {
        username: name,
        password: pass,
        created: Date.now()
      };
      sessions[sender] = name;

      m.reply(`✅ Akun berhasil dibuat!\nSelamat datang, *${name}* di Ubed Media.`);
      break;
    }

    case 'loginubed': {
      if (sessions[sender]) return m.reply('⚠️ Kamu sudah login. Logout dulu dengan *.logoutubed*');

      const [name, pass] = text.split('|') || [];
      if (!name || !pass) return m.reply('❗ Format salah!\nContoh: *.loginubed ubed|12345*');

      const entry = Object.entries(accounts).find(([_, data]) => data.username === name && data.password === pass);
      if (!entry) return m.reply('❌ Nama pengguna atau kata sandi salah.');

      sessions[sender] = name;
      m.reply(`✅ Login berhasil!\nSelamat datang kembali, *${name}*!`);
      break;
    }

    case 'logoutubed': {
      if (!sessions[sender]) return m.reply('❗ Kamu belum login.');
      delete sessions[sender];
      m.reply('✅ Kamu telah logout dari Ubed Media.');
      break;
    }

    case 'lupasandiubed': {
      const name = text.trim();
      if (!name) return m.reply('❗ Format salah!\nContoh: *.lupasandiubed ubed*');

      const user = Object.entries(accounts).find(([jid, u]) => u.username === name);
      if (!user) return m.reply('❌ Akun tidak ditemukan.');

      const [jid, data] = user;
      const newPass = Math.floor(Math.random() * 90000 + 10000).toString();
      accounts[jid].password = newPass;

      m.reply(`✅ Kata sandi berhasil direset!\nUsername: *${name}*\nPassword baru: *${newPass}*`);
      break;
    }
  }
};

handler.command = /^(signupubed|loginubed|logoutubed|lupasandiubed)$/i;
handler.tags = ['media'];
handler.help = [
  'signupubed nama|sandi',
  'loginubed nama|sandi',
  'logoutubed',
  'lupasandiubed nama'
];

export default handler;