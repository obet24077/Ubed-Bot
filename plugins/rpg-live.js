let handler = async (m, { conn, command, args }) => {
  let user = global.db.data.users[m.sender];
  const tag = '@' + m.sender.split`@`[0];

  try {
    if (command === 'live') {
      // Check if the user has a YouTube account
      if (!user.youtube_account) {
        return conn.reply(m.chat, `Hey Kamu Iya Kamu ${tag}\nBuat akun terlebih dahulu\nKetik: .createakun`, floc);
      }

      // Check if the title is provided
      let title = args.join(' ');
      if (!title) {
        return conn.reply(m.chat, `${tag} Silakan berikan judul untuk live Anda.`, floc);
      }

      // Setup cooldown (10 minutes)
      const cooldownTime = 600000; // 10 minutes in milliseconds

      const lastLiveTime = user.lastLiveTime || 0;
      const timeSinceLastLive = new Date() - lastLiveTime;

      if (timeSinceLastLive < cooldownTime) {
        const remainingCooldown = cooldownTime - timeSinceLastLive;
        const formattedCooldown = msToTime(remainingCooldown);
        throw `Kamu sudah live baru-baru ini. Tunggu selama\n${formattedCooldown} sebelum bisa live lagi.`;
      }

      setTimeout(() => {
        conn.reply(m.chat, `👋 Hai Kak ${tag}, subscribermu sudah tidak sabar menunggu!\nWaktunya live streaming lagi!`, floc);
      }, cooldownTime);

      // Simulate live streaming results with more variation
      const randomSubscribers = Math.floor(Math.random() * (5000 - 50 + 1)) + 50;
      const randomLike = Math.floor(Math.random() * (2000 - 100 + 1)) + 100;
      const randomViewers = Math.floor(Math.random() * (1000000 - 500 + 1)) + 500;
      const randomDonation = Math.floor(Math.random() * (500000 - 50000 + 1)) + 50000;
      const subscriberBoost = user.subscribers > 50000 ? Math.floor(randomSubscribers * 1.2) : randomSubscribers;

      // Format numbers using the new formatter
      const formattedSubscribers = formatNumber(user.subscribers + subscriberBoost);
      const formattedLike = formatNumber(user.like + randomLike);
      const formattedViewers = formatNumber(user.viewers + randomViewers);
      const formattedDonation = formatNumber(randomDonation);

      // Update user information
      user.subscribers += subscriberBoost;
      user.like += randomLike;
      user.viewers += randomViewers;
      user.eris += randomDonation;
      user.lastLiveTime = new Date();

      // Implement subscriber milestones for rewards
      const milestones = [
        { count: 1000000, reward: 1000000, exp: 5000, playButton: 'Diamond', threshold: 3 },
        { count: 100000, reward: 500000, exp: 2500, playButton: 'Gold', threshold: 2 },
        { count: 10000, reward: 250000, exp: 500, playButton: 'Silver', threshold: 1 }
      ];

      for (let milestone of milestones) {
        if (user.subscribers >= milestone.count && user.playButton < milestone.threshold) {
          user.playButton += 1;
          user.eris += Math.floor(Math.random() * (milestone.reward - milestone.reward / 2 + 1)) + milestone.reward / 2;
          user.exp += milestone.exp;
          conn.reply(m.chat, `📢 Selamat! ${tag} telah mencapai milestone ${formatNumber(milestone.count)} subscribers dan mendapatkan *🥇 ${milestone.playButton} PlayButton*!\n🎁 Hadiah: Eris Rp.${formatNumber(user.eris)}, EXP +${milestone.exp}.`, floc);
        }
      }

      // Send live streaming result message
      conn.reply(m.chat, `[ 🎦 ] Hasil Live Streaming Terbaru

🧑🏻‍💻 *Streamer:* ${tag}
📹 *Judul Live:* ${title}
📈 *Subscriber Baru:* +${formatNumber(subscriberBoost)}
👍🏻 *Like Baru:* +${formatNumber(randomLike)}
👁️ *Viewers Baru:* +${formatNumber(randomViewers)}
💰 *Donasi:* Rp.${formattedDonation}

> Cek Progresmu: .akunyt`, floc);
    }
  } catch (err) {
    m.reply("📢: " + err);
  }
};

// Function to format large numbers (e.g. 1k, 1M, 1JT)
function formatNumber(num) {
    if (num >= 100000000) return (num / 10000000).toFixed(1).replace(/\.0$/, '') + 'T'; // 1M, 10.0M, 100.0M
    if (num >= 10000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'; // 1JT, 10.0JT, 100.0JT
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'JT'; // 1M, 10.0M, 100.0M
    if (num >= 100000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k'; // 100.0k
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k'; // 1k, 10.0k
    return num.toString();
}
// Function to convert milliseconds to a readable time format
function msToTime(duration) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  const formattedTime = [];
  if (hours > 0) {
    formattedTime.push(`${hours} jam`);
  }
  if (minutes > 0) {
    formattedTime.push(`${minutes} menit`);
  }
  if (seconds > 0 || (hours === 0 && minutes === 0)) {
    formattedTime.push(`${seconds} detik`);
  }

  return formattedTime.join(' ');
}

// Define help, tags, command, and registration for RPG command handler
handler.help = ['live'];
handler.tags = ['rpg'];
handler.command = /^(live|streaming)/i;
handler.register = true;
handler.group = true;
handler.limit = 1;

// Export RPG command handler
export default handler;