let handler = async (m, { conn, text, usedPrefix }) => {
  const ownerJid = ['6281399172380@s.whatsapp.net','6285147777105@s.whatsapp.net']; // Daftar Owner

  // Menyimpan data user (email, password, status, gambar, like, komentar)
  let userDB = './userData.json'; // File untuk menyimpan data user
  let statusDB = './statusData.json'; // File untuk status dan gambar

  // Membaca data user dan status
  const loadUserData = () => {
    try {
      return JSON.parse(readFileSync(userDB));
    } catch (e) {
      return {};
    }
  };

  const loadStatusData = () => {
    try {
      return JSON.parse(readFileSync(statusDB));
    } catch (e) {
      return {};
    }
  };

  // Sign up pengguna baru
  if (text.startsWith('.signup')) {
    const [cmd, email, password] = text.split(' ');
    if (!email || !password) {
      m.reply('Email dan Password tidak boleh kosong!');
      return;
    }

    let userData = loadUserData();
    if (userData[email]) {
      m.reply('Email sudah terdaftar!');
      return;
    }

    userData[email] = { email, password, status: '', image: '', likes: {}, comments: {} };
    writeFileSync(userDB, JSON.stringify(userData));

    m.reply('Sign-up berhasil! Silakan login untuk melanjutkan.');
    return;
  }

  // Login pengguna
  if (text.startsWith('.login')) {
    const [cmd, email, password] = text.split(' ');
    if (!email || !password) {
      m.reply('Email dan Password tidak boleh kosong!');
      return;
    }

    let userData = loadUserData();
    const user = userData[email];
    if (!user || user.password !== password) {
      m.reply('Email atau password salah!');
      return;
    }

    m.reply('Login berhasil!');
    // Setelah login berhasil, simpan penggunanya
    m.sender = email; // Menyimpan email yang sedang login sebagai m.sender
    return;
  }

  // Menyimpan status dan gambar hanya setelah login
  let userData = loadUserData();
  let user = userData[m.sender];
  if (!user) return; // Jika tidak ada user yang login, tidak ada proses

  // Update status
  if (text.startsWith('.status')) {
    const [cmd, ...statusText] = text.split(' ');
    if (!statusText.length) {
      m.reply('Status tidak boleh kosong!');
      return;
    }

    user.status = statusText.join(' ');
    writeFileSync(userDB, JSON.stringify(userData));

    m.reply('Status Anda berhasil diperbarui!');
    return;
  }

  // Upload gambar status (Hanya Owner)
  if (text.startsWith('.uploadstatus') && ownerJid.includes(m.sender)) {
    const [cmd, ...imageDescription] = text.split(' ');
    if (!imageDescription.length) {
      m.reply('Deskripsi gambar tidak boleh kosong!');
      return;
    }

    let statusData = loadStatusData();
    statusData[m.sender] = {
      description: imageDescription.join(' '),
      image: 'URL_untuk_image', // Ganti dengan URL gambar yang diupload
    };
    writeFileSync(statusDB, JSON.stringify(statusData));

    m.reply('Gambar status berhasil diupload!');
    return;
  }

  // Melihat status orang (gambar)
  if (text.startsWith('.viewstatusimg')) {
    const mentionedUser = text.split(' ')[1]; // Mendapatkan @user yang disebut
    if (!mentionedUser) {
      m.reply('Harap menyebutkan pengguna untuk melihat status gambar!');
      return;
    }

    let statusData = loadStatusData();
    const userStatus = statusData[mentionedUser];

    if (!userStatus) {
      m.reply('Pengguna ini tidak memiliki status gambar!');
      return;
    }

    m.reply(`Gambar status dari ${mentionedUser}: ${userStatus.image}`);
    return;
  }

  // Like pada status
  if (text.startsWith('.like')) {
    const mentionedUser = text.split(' ')[1]; // Mendapatkan @user yang disebut
    if (!mentionedUser) {
      m.reply('Harap menyebutkan pengguna yang statusnya ingin dilike!');
      return;
    }

    let statusData = loadStatusData();
    const userStatus = statusData[mentionedUser];

    if (!userStatus) {
      m.reply('Pengguna ini tidak memiliki status gambar!');
      return;
    }

    user.likes[mentionedUser] = (user.likes[mentionedUser] || 0) + 1;
    writeFileSync(userDB, JSON.stringify(userData));

    m.reply(`Anda telah memberi like pada status ${mentionedUser}`);
    return;
  }

  // Komentar pada status
  if (text.startsWith('.comment')) {
    const [cmd, mentionedUser, ...commentText] = text.split(' ');
    if (!mentionedUser || !commentText.length) {
      m.reply('Harap menyebutkan pengguna dan komentar!');
      return;
    }

    let statusData = loadStatusData();
    const userStatus = statusData[mentionedUser];

    if (!userStatus) {
      m.reply('Pengguna ini tidak memiliki status gambar!');
      return;
    }

    user.comments[mentionedUser] = user.comments[mentionedUser] || [];
    user.comments[mentionedUser].push(commentText.join(' '));
    writeFileSync(userDB, JSON.stringify(userData));

    m.reply(`Komentar Anda berhasil dikirim ke status ${mentionedUser}`);
    return;
  }
};

handler.help = ['signup', 'login', 'status', 'uploadstatus', 'viewstatusimg', 'like', 'comment'];
handler.tags = ['rpg'];
handler.command = /^(signup|login|status|uploadstatus|viewstatusimg|like|comment)$/i;

export default handler;