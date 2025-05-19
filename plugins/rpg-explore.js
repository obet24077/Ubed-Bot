let handler = async (m, { conn, command, args }) => {
let user = global.db.data.users[m.sender];
  let totalEksplorasi = user.sand || 0;
    let ekplorasiFormatted = totalEksplorasi.toLocaleString('en-US');
  const tag = '@' + m.sender.split`@`[0];

  const destinations = [
    'Desa Elf',
    'Desa Goblin',
    'Lost Temple',
    'Labirin Dark',
    'Kastil Naga',
    'Gua Troll',
    'Hutan Terlarang',
    'Pantai Berhantu',
    'Gunung Berapi',
    'Lembah Raksasa',
    'Pulau Harta',
    'Kuil Kuno',
    'Reruntuhan Ajaib',
    'Hutan Mistis',
    'Kota Hilang',
    'Danau Beku',
    'Dataran Guntur',
    'Gurun Pasir',
    'Benteng Batu',
    'Lembah Magis'
  ];

    let title = '';
    if (totalEksplorasi >= 1000) {
      title = 'Sang Legenda';
    } else if (totalEksplorasi >= 100) {
      title = 'Pecinta Alam';
    } else if (totalEksplorasi >= 25) {
      title = 'Penyelamat Alam';
    } else {
      title = 'Pemula';
    }
    
  // Function to randomly select three destinations
  function getRandomDestinations() {
    const shuffled = destinations.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }

  try {
    if (command === 'explore') {
    setTimeout(() => {
        if (user.tempDestinations) {
          delete user.tempDestinations; // Clear temp destinations
          conn.reply(m.chat, `${tag}, waktu untuk memilih destinasi explore telah habis. Silakan coba lagi.`, floc);
        }
      }, 60000); // 3 minutes
          // Setup cooldown (10 menit)
    let timing = (new Date - (user.lastbunga * 1)) * 1
if (timing < 600000) return conn.reply(m.chat, `👋 Hai Kak ${tag}\nKamu sudah lelah dan butuh istirahat, beristirahat lah terlebih dahulu\nTunggu Selama ${clockString(600000 - timing)}`, floc);
setTimeout(() => {
  conn.reply(`🧳 Hai Kak ${tag}\nWaktunya untuk explore dunia kembali`, floc)
}, 10 * 60 * 1000)
          // Select three random destinations and store them in user data
      const randomDestinations = getRandomDestinations();
      user.tempDestinations = randomDestinations;
      
      return conn.reply(m.chat, `◤───「 *STATISTIK* 」──✦
│🧑🏻‍💻 [ *Player :* ${tag}
│🌟 [ *Total Explore :* ${ekplorasiFormatted} kali
│🏆 [ *Title Saat ini :* ${title}
◣──────────❈

✦▣──┄╌╼〘 *EXPLORER* 〙╾╌┄──▣

◤───「 *DESTINASI* 」──✦
├⎆ 1. ${randomDestinations[0]}
├⎆ 2. ${randomDestinations[1]}
├⎆ 3. ${randomDestinations[2]}
├⎆ Contoh: .pilih 1
◣─────────────✦`, floc);
      } else if (command === 'pilih') {
      // Check if tempDestinations exists
      if (!user.tempDestinations) {
        return conn.reply(m.chat, `${tag}, silakan ketik .explore terlebih dahulu untuk mendapatkan pilihan destinasi.`, floc);
      }

      if (args.length === 0) {
        return conn.reply(m.chat, `${tag}, silakan pilih destinasi dengan mengetik .pilih <nomor>`, floc);
      }

      const pilihanIndex = parseInt(args[0]) - 1;
      const randomDestinations = user.tempDestinations;

      if (pilihanIndex < 0 || pilihanIndex >= randomDestinations.length) {
        return conn.reply(m.chat, `${tag}, pilihan tidak valid. Silakan ketik .pilih 1, .pilih 2, atau .pilih 3 untuk memilih destinasi yang diberikan`, floc);
      }

      const pilihan = randomDestinations[pilihanIndex];
      let hasil;
      switch (pilihan.toLowerCase()) {
        case 'desa elf':
          hasil = await exploreDesaElf(user);
          break;
        case 'desa goblin':
          hasil = await exploreDesaGoblin(user);
          break;
        case 'lost temple':
          hasil = await exploreLostTemple(user);
          break;
        case 'labirin dark':
          hasil = await exploreLabirinDark(user);
          break;
        case 'kastil naga':
          hasil = await exploreKastilNaga(user);
          break;
        case 'gua troll':
          hasil = await exploreGuaTroll(user);
          break;
        case 'hutan terlarang':
          hasil = await exploreHutanTerlarang(user);
          break;
        case 'pantai berhantu':
          hasil = await explorePantaiBerhantu(user);
          break;
        case 'gunung berapi':
          hasil = await exploreGunungBerapi(user);
          break;
        case 'lembah raksasa':
          hasil = await exploreLembahRaksasa(user);
          break;
        case 'pulau harta':
          hasil = await explorePulauHarta(user);
          break;
        case 'kuil kuno':
          hasil = await exploreKuilKuno(user);
          break;
        case 'reruntuhan ajaib':
          hasil = await exploreReruntuhanAjaib(user);
          break;
        case 'hutan mistis':
          hasil = await exploreHutanMistis(user);
          break;
        case 'kota hilang':
          hasil = await exploreKotaHilang(user);
          break;
        case 'danau beku':
          hasil = await exploreDanauBeku(user);
          break;
        case 'dataran guntur':
          hasil = await exploreDataranGuntur(user);
          break;
        case 'gurun pasir':
          hasil = await exploreGurunPasir(user);
          break;
        case 'benteng batu':
          hasil = await exploreBentengBatu(user);
          break;
        case 'lembah magis':
          hasil = await exploreLembahMagis(user);
          break;
        default:
          return conn.reply(m.chat, `${tag}, pilihan tidak valid. Silakan ketik .pilih 1, .pilih 2, atau .pilih 3 untuk memilih destinasi yang diberikan`, floc);
      }
      if (hasil) {
         setTimeout(() => {
            conn.reply(m.chat, `Hai ${tag} Ayo Explore kembali untuk menjelajahi dunia`, m)
            }, 600000)
          }

      // Clear temp destinations
      delete user.tempDestinations;
      // Update last explore time
      user.lastExploreTime = new Date();
      // Send the expedition result
      return conn.reply(m.chat, `◤───「 *STATISTIK* 」──✦
│🧑🏻‍💻 [ *Player :* ${tag}
│🌟 [ *Total Explore :* ${ekplorasiFormatted} kali
│🏆 [ *Title Saat ini :* ${title}
◣──────────❈

✦▣──┄╌╼〘 *EXPLORER* 〙╾╌┄──▣

◤───「 *🗺️ HASIL EXPLORER* 」──✦
├⎆ 🌍 *Destinasi:* ${pilihan}
${hasil}
◣─────────────✦
> Cek status akun Anda
> Ketik:  .akunxp`, floc);
      }
  } catch (err) {
    m.reply("📢: " + err);
  }
};

// Functions for each expedition destination
function exploreDesaElf(user) {
  const randomEris = Math.floor(Math.random() * (500000 - 100 + 1)) + 100;
  const randomExp = Math.floor(Math.random() * (200 - 50 + 1)) + 50;
  const randomDiamond = Math.floor(Math.random() * (25 - 1 + 1)) + 5;
  const randomUncommon = Math.floor(Math.random() * (25 - 1 + 1)) + 5;
  user.eris += randomEris;
  user.exp += randomExp;
  user.diamond += randomDiamond;
  user.uncommon += randomUncommon;
  user.sand += 1;
  user.lastbunga = new Date * 1
  return `├⎆ 🎉 Selamat! Anda berhasil mendapatkan\n├⎆ 💰 *Money:* +${randomEris}\n├⎆ ⭐ *EXP:* +${randomExp}\n├⎆ 💎 *Diamond:* +${randomDiamond}\n├⎆ 📦 *Uncommon:* +${randomUncommon}`;
}

function exploreDesaGoblin(user) {
  const randomEris = Math.floor(Math.random() * (300000 - 50 + 1)) + 50;
  const randomExp = Math.floor(Math.random() * (150 - 30 + 1)) + 30;
  const randomDiamond = Math.floor(Math.random() * (25 - 1 + 1)) + 5;
  const randomUncommon = Math.floor(Math.random() * (25 - 1 + 1)) + 5;
  user.eris += randomEris;
  user.exp += randomExp;
  user.diamond += randomDiamond;
  user.uncommon += randomUncommon;
  user.sand += 1;
  user.lastbunga = new Date * 1
  return `├⎆ 🎉 Anda menemukan harta karun!\n├⎆ 💰 *Money:* +${randomEris}\n├⎆ ⭐ *EXP:* +${randomExp}\n├⎆ 💎 *Diamond:* +${randomDiamond}\n├⎆ 📦 *Uncommon:* +${randomUncommon}`;
}

function exploreLostTemple(user) {
  const randomEris = Math.floor(Math.random() * (700000 - 150 + 1)) + 150;
  const randomExp = Math.floor(Math.random() * (300 - 70 + 1)) + 70;
  const randomDiamond = Math.floor(Math.random() * (25 - 1 + 1)) + 5;
  const randomUncommon = Math.floor(Math.random() * (25 - 1 + 1)) + 5;
  user.eris += randomEris;
  user.exp += randomExp;
  user.diamond += randomDiamond;
  user.uncommon += randomUncommon;
  user.sand += 1;
  user.lastbunga = new Date * 1
  return `├⎆ 🎉 Anda menjelajahi Lost Temple!\n├⎆ 💰 *Money:* +${randomEris}\n├⎆ ⭐ *EXP:* +${randomExp}\n├⎆ 💎 *Diamond:* +${randomDiamond}\n├⎆ 📦 *Uncommon:* +${randomUncommon}`;
}

function exploreLabirinDark(user) {
  const randomEris = Math.floor(Math.random() * (600000 - 120 + 1)) + 120;
  const randomExp = Math.floor(Math.random() * (250 - 60 + 1)) + 60;
  const randomDiamond = Math.floor(Math.random() * (25 - 1 + 1)) + 5;
  const randomUncommon = Math.floor(Math.random() * (25 - 1 + 1)) + 5;
  user.eris += randomEris;
  user.exp += randomExp;
  user.diamond += randomDiamond;
  user.uncommon += randomUncommon;
  user.sand += 1;
  user.lastbunga = new Date * 1
  return `├⎆ 🎉 Anda berhasil keluar dari Labirin Dark!\n├⎆ 💰 *Money:* +${randomEris}\n├⎆ ⭐ *EXP:* +${randomExp}\n├⎆ 💎 *Diamond:* +${randomDiamond}\n├⎆ 📦 *Uncommon:* +${randomUncommon}`;
}

function exploreKastilNaga(user) {
  const randomEris = Math.floor(Math.random() * (800000 - 200 + 1)) + 200;
  const randomExp = Math.floor(Math.random() * (400 - 100 + 1)) + 100;
  const randomDiamond = Math.floor(Math.random() * (25 - 1 + 1)) + 5;
  const randomUncommon = Math.floor(Math.random() * (25 - 1 + 1)) + 5;
  user.eris += randomEris;
  user.exp += randomExp;
  user.diamond += randomDiamond;
  user.uncommon += randomUncommon;
  user.sand += 1;
  user.lastbunga = new Date * 1
  return `├⎆ 🎉 Anda menaklukkan Kastil Naga!\n├⎆ 💰 *Money:* +${randomEris}\n├⎆ ⭐ *EXP:* +${randomExp}\n├⎆ 💎 *Diamond:* +${randomDiamond}\n├⎆ 📦 *Uncommon:* +${randomUncommon}`;
}

function exploreGuaTroll(user) {
  const randomEris = Math.floor(Math.random() * (400000 - 80 + 1)) + 80;
  const randomExp = Math.floor(Math.random() * (200 - 50 + 1)) + 50;
  const randomDiamond = Math.floor(Math.random() * (25 - 1 + 1)) + 5;
  const randomUncommon = Math.floor(Math.random() * (25 - 1 + 1)) + 5;
  user.eris += randomEris;
  user.exp += randomExp;
  user.diamond += randomDiamond;
  user.uncommon += randomUncommon;
  user.sand += 1;
  user.lastbunga = new Date * 1
  return `├⎆ 🎉 Anda mengeksplorasi Gua Troll!\n├⎆ 💰 *Money:* +${randomEris}\n├⎆ ⭐ *EXP:* +${randomExp}\n├⎆ 💎 *Diamond:* +${randomDiamond}\n├⎆ 📦 *Uncommon:* +${randomUncommon}`;
}

function exploreHutanTerlarang(user) {
  const randomEris = Math.floor(Math.random() * (500000 - 100 + 1)) + 100;
  const randomExp = Math.floor(Math.random() * (200 - 50 + 1)) + 50;
  const randomDiamond = Math.floor(Math.random() * (25 - 1 + 1)) + 5;
  const randomUncommon = Math.floor(Math.random() * (25 - 1 + 1)) + 5;
  user.eris += randomEris;
  user.exp += randomExp;
  user.diamond += randomDiamond;
  user.uncommon += randomUncommon;
  user.sand += 1;
  user.lastbunga = new Date * 1
  return `├⎆ 🎉 Anda menjelajahi Hutan Terlarang!\n├⎆ 💰 *Money:* +${randomEris}\n├⎆ ⭐ *EXP:* +${randomExp}\n├⎆ 💎 *Diamond:* +${randomDiamond}\n├⎆ 📦 *Uncommon:* +${randomUncommon}`;
}

function explorePantaiBerhantu(user) {
  const randomEris = Math.floor(Math.random() * (450000 - 90 + 1)) + 90;
  const randomExp = Math.floor(Math.random() * (180 - 45 + 1)) + 45;
  const randomDiamond = Math.floor(Math.random() * (25 - 1 + 1)) + 5;
  const randomUncommon = Math.floor(Math.random() * (25 - 1 + 1)) + 5;
  user.eris += randomEris;
  user.exp += randomExp;
  user.diamond += randomDiamond;
  user.uncommon += randomUncommon;
  user.sand += 1;
  user.lastbunga = new Date * 1
  return `├⎆ 🎉 Anda berani menjelajahi Pantai Berhantu!\n├⎆ 💰 *Money:* +${randomEris}\n├⎆ ⭐ *EXP:* +${randomExp}\n├⎆ 💎 *Diamond:* +${randomDiamond}\n├⎆ 📦 *Uncommon:* +${randomUncommon}`;
}

function exploreGunungBerapi(user) {
  const randomEris = Math.floor(Math.random() * (700000 - 150 + 1)) + 150;
  const randomExp = Math.floor(Math.random() * (300 - 70 + 1)) + 70;
  const randomDiamond = Math.floor(Math.random() * (25 - 1 + 1)) + 5;
  const randomUncommon = Math.floor(Math.random() * (25 - 1 + 1)) + 5;
  user.eris += randomEris;
  user.exp += randomExp;
  user.diamond += randomDiamond;
  user.uncommon += randomUncommon;
  user.sand += 1;
  user.lastbunga = new Date * 1
  return `├⎆ 🎉 Anda selamat dari Gunung Berapi!\n├⎆ 💰 *Money:* +${randomEris}\n├⎆ ⭐ *EXP:* +${randomExp}\n├⎆ 💎 *Diamond:* +${randomDiamond}\n├⎆ 📦 *Uncommon:* +${randomUncommon}`;
}

function exploreLembahRaksasa(user) {
  const randomEris = Math.floor(Math.random() * (500000 - 100 + 1)) + 100;
  const randomExp = Math.floor(Math.random() * (200 - 50 + 1)) + 50;
  const randomDiamond = Math.floor(Math.random() * (25 - 1 + 1)) + 5;
  const randomUncommon = Math.floor(Math.random() * (25 - 1 + 1)) + 5;
  user.eris += randomEris;
  user.exp += randomExp;
  user.diamond += randomDiamond;
  user.uncommon += randomUncommon;
  user.sand += 1;
  user.lastbunga = new Date * 1
  return `├⎆ 🎉 Anda menjelajahi Lembah Raksasa!\n├⎆ 💰 *Money:* +${randomEris}\n├⎆ ⭐ *EXP:* +${randomExp}\n├⎆ 💎 *Diamond:* +${randomDiamond}\n├⎆ 📦 *Uncommon:* +${randomUncommon}`;
}

function explorePulauHarta(user) {
  const randomEris = Math.floor(Math.random() * (800000 - 200 + 1)) + 200;
  const randomExp = Math.floor(Math.random() * (400 - 100 + 1)) + 100;
  const randomDiamond = Math.floor(Math.random() * (25 - 1 + 1)) + 5;
  const randomUncommon = Math.floor(Math.random() * (25 - 1 + 1)) + 5;
  user.eris += randomEris;
  user.exp += randomExp;
  user.diamond += randomDiamond;
  user.uncommon += randomUncommon;
  user.sand += 1;
  user.lastbunga = new Date * 1
  return `├⎆ 🎉 Anda menemukan harta karun di Pulau Harta!\n├⎆ 💰 *Money:* +${randomEris}\n├⎆ ⭐ *EXP:* +${randomExp}\n├⎆ 💎 *Diamond:* +${randomDiamond}\n├⎆ 📦 *Uncommon:* +${randomUncommon}`;
}

function exploreKuilKuno(user) {
  const randomEris = Math.floor(Math.random() * (600000 - 120 + 1)) + 120;
  const randomExp = Math.floor(Math.random() * (250 - 60 + 1)) + 60;
  const randomDiamond = Math.floor(Math.random() * (25 - 1 + 1)) + 5;
  const randomUncommon = Math.floor(Math.random() * (25 - 1 + 1)) + 5;
  user.eris += randomEris;
  user.exp += randomExp;
  user.diamond += randomDiamond;
  user.uncommon += randomUncommon;
  user.sand += 1;
  user.lastbunga = new Date * 1
  return `├⎆ 🎉 Anda menjelajahi Kuil Kuno!\n├⎆ 💰 *Money:* +${randomEris}\n├⎆ ⭐ *EXP:* +${randomExp}\n├⎆ 💎 *Diamond:* +${randomDiamond}\n├⎆ 📦 *Uncommon:* +${randomUncommon}`;
}

function exploreReruntuhanAjaib(user) {
  const randomEris = Math.floor(Math.random() * (700000 - 150 + 1)) + 150;
  const randomExp = Math.floor(Math.random() * (300 - 70 + 1)) + 70;
  const randomDiamond = Math.floor(Math.random() * (25 - 1 + 1)) + 5;
  const randomUncommon = Math.floor(Math.random() * (25 - 1 + 1)) + 5;
  user.eris += randomEris;
  user.exp += randomExp;
  user.diamond += randomDiamond;
  user.uncommon += randomUncommon;
  user.sand += 1;
  user.lastbunga = new Date * 1
  return `├⎆ 🎉 Anda menemukan misteri di Reruntuhan Ajaib!\n├⎆ 💰 *Money:* +${randomEris}\n├⎆ ⭐ *EXP:* +${randomExp}\n├⎆ 💎 *Diamond:* +${randomDiamond}\n├⎆ 📦 *Uncommon:* +${randomUncommon}`;
}

function exploreHutanMistis(user) {
  const randomEris = Math.floor(Math.random() * (450000 - 90 + 1)) + 90;
  const randomExp = Math.floor(Math.random() * (180 - 45 + 1)) + 45;
  const randomDiamond = Math.floor(Math.random() * (25 - 1 + 1)) + 5;
  const randomUncommon = Math.floor(Math.random() * (25 - 1 + 1)) + 5;
  user.eris += randomEris;
  user.exp += randomExp;
  user.diamond += randomDiamond;
  user.uncommon += randomUncommon;
  user.sand += 1;
  user.lastbunga = new Date * 1
  return `├⎆ 🎉 Anda menjelajahi Hutan Mistis!\n├⎆ 💰 *Money:* +${randomEris}\n├⎆ ⭐ *EXP:* +${randomExp}\n├⎆ 💎 *Diamond:* +${randomDiamond}\n├⎆ 📦 *Uncommon:* +${randomUncommon}`;
}

function exploreKotaHilang(user) {
  const randomEris = Math.floor(Math.random() * (600000 - 120 + 1)) + 120;
  const randomExp = Math.floor(Math.random() * (250 - 60 + 1)) + 60;
  const randomDiamond = Math.floor(Math.random() * (25 - 1 + 1)) + 5;
  const randomUncommon = Math.floor(Math.random() * (25 - 1 + 1)) + 5;
  user.eris += randomEris;
  user.exp += randomExp;
  user.diamond += randomDiamond;
  user.uncommon += randomUncommon;
  user.sand += 1;
  user.lastbunga = new Date * 1
  return `├⎆ 🎉 Anda menemukan Kota Hilang!\n├⎆ 💰 *Money:* +${randomEris}\n├⎆ ⭐ *EXP:* +${randomExp}\n├⎆ 💎 *Diamond:* +${randomDiamond}\n├⎆ 📦 *Uncommon:* +${randomUncommon}`;
}

function exploreDanauBeku(user) {
  const randomEris = Math.floor(Math.random() * (500000 - 100 + 1)) + 100;
  const randomExp = Math.floor(Math.random() * (200 - 50 + 1)) + 50;
  const randomDiamond = Math.floor(Math.random() * (25 - 1 + 1)) + 5;
  const randomUncommon = Math.floor(Math.random() * (25 - 1 + 1)) + 5;
  user.eris += randomEris;
  user.exp += randomExp;
  user.diamond += randomDiamond;
  user.uncommon += randomUncommon;
  user.sand += 1;
  user.lastbunga = new Date * 1
  return `├⎆ 🎉 Anda menjelajahi Danau Beku!\n├⎆ 💰 *Money:* +${randomEris}\n├⎆ ⭐ *EXP:* +${randomExp}\n├⎆ 💎 *Diamond:* +${randomDiamond}\n├⎆ 📦 *Uncommon:* +${randomUncommon}`;
}

function exploreDataranGuntur(user) {
  const randomEris = Math.floor(Math.random() * (650000 - 130 + 1)) + 130;
  const randomExp = Math.floor(Math.random() * (270 - 60 + 1)) + 60;
  const randomDiamond = Math.floor(Math.random() * (25 - 1 + 1)) + 5;
  const randomUncommon = Math.floor(Math.random() * (25 - 1 + 1)) + 5;
  user.eris += randomEris;
  user.exp += randomExp;
  user.diamond += randomDiamond;
  user.uncommon += randomUncommon;
  user.sand += 1;
  user.lastbunga = new Date * 1
  return `├⎆ 🎉 Anda menjelajahi Dataran Guntur!\n├⎆ 💰 *Money:* +${randomEris}\n├⎆ ⭐ *EXP:* +${randomExp}\n├⎆ 💎 *Diamond:* +${randomDiamond}\n├⎆ 📦 *Uncommon:* +${randomUncommon}`;
}

function exploreGurunPasir(user) {
  const randomEris = Math.floor(Math.random() * (600000 - 120 + 1)) + 120;
  const randomExp = Math.floor(Math.random() * (250 - 60 + 1)) + 60;
  const randomDiamond = Math.floor(Math.random() * (25 - 1 + 1)) + 5;
  const randomUncommon = Math.floor(Math.random() * (25 - 1 + 1)) + 5;
  user.eris += randomEris;
  user.exp += randomExp;
  user.diamond += randomDiamond;
  user.uncommon += randomUncommon;
  user.sand += 1;
  user.lastbunga = new Date * 1
  return `├⎆ 🎉 Anda menjelajahi Gurun Pasir!\n├⎆ 💰 *Money:* +${randomEris}\n├⎆ ⭐ *EXP:* +${randomExp}\n├⎆ 💎 *Diamond:* +${randomDiamond}\n├⎆ 📦 *Uncommon:* +${randomUncommon}`;
}

function exploreBentengBatu(user) {
  const randomEris = Math.floor(Math.random() * (700000 - 150 + 1)) + 150;
  const randomExp = Math.floor(Math.random() * (300 - 70 + 1)) + 70;
  const randomDiamond = Math.floor(Math.random() * (25 - 1 + 1)) + 5;
  const randomUncommon = Math.floor(Math.random() * (25 - 1 + 1)) + 5;
  user.eris += randomEris;
  user.exp += randomExp;
  user.diamond += randomDiamond;
  user.uncommon += randomUncommon;
  user.sand += 1;
  user.lastbunga = new Date * 1
  return `├⎆ 🎉 Anda menaklukkan Benteng Batu!\n├⎆ 💰 *Money:* +${randomEris}\n├⎆ ⭐ *EXP:* +${randomExp}\n├⎆ 💎 *Diamond:* +${randomDiamond}\n├⎆ 📦 *Uncommon:* +${randomUncommon}`;
}

function exploreLembahMagis(user) {
  const randomEris = Math.floor(Math.random() * (800000 - 200 + 1)) + 200;
  const randomExp = Math.floor(Math.random() * (400 - 100 + 1)) + 100;
  const randomDiamond = Math.floor(Math.random() * (25 - 1 + 1)) + 5;
  const randomUncommon = Math.floor(Math.random() * (25 - 1 + 1)) + 5;
  user.eris += randomEris;
  user.exp += randomExp;
  user.diamond += randomDiamond;
  user.uncommon += randomUncommon;
  user.sand += 1;
  user.lastbunga = new Date * 1
  return `├⎆ 🎉 Anda menjelajahi Lembah Magis!\n├⎆ 💰 *Money:* +${randomEris}\n├⎆ ⭐ *EXP:* +${randomExp}\n├⎆ 💎 *Diamond:* +${randomDiamond}\n├⎆ 📦 *Uncommon:* +${randomUncommon}`;
}

// Define help, tags, command, and register for the RPG command handler
handler.help = ['explore'];
handler.tags = ['rpg'];
handler.command = /^(explore|pilih)$/i;
handler.register = true;
handler.group = true;
handler.limit = 2;

// Export the RPG command handler
export default handler;

function clockString(ms) {
    let d = Math.floor(ms / 86400000)
    let h = Math.floor(ms / 3600000) % 24
    let m = Math.floor(ms / 60000) % 60
    let s = Math.floor(ms / 1000) % 60
    return ['\n' + d, ' *Hari* ', h, ' *Jam* ', m, ' *Menit* ', s, ' *Detik* '].map(v => v.toString().padStart(2, 0)).join('')
}