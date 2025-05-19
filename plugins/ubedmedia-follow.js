const handler = async (m, { conn, command }) => {
  if (!global.db.data.ubedAccounts) global.db.data.ubedAccounts = {};

  const target = m.mentionedJid?.[0];
  if (!target) return m.reply(`Tag pengguna yang ingin kamu *${command === 'follow' ? 'ikuti' : 'berhenti ikuti'}*.`);

  if (target === m.sender) return m.reply('❌ Kamu tidak bisa follow/unfollow dirimu sendiri.');

  const senderName = await conn.getName(m.sender);
  const targetName = await conn.getName(target);

  // Pastikan akun ada
  if (!global.db.data.ubedAccounts[m.sender]) {
    global.db.data.ubedAccounts[m.sender] = {
      nama: senderName,
      followers: [],
      following: [],
    };
  }
  if (!global.db.data.ubedAccounts[target]) {
    global.db.data.ubedAccounts[target] = {
      nama: targetName,
      followers: [],
      following: [],
    };
  }

  const user = global.db.data.ubedAccounts[m.sender];
  const targetUser = global.db.data.ubedAccounts[target];

  // Pastikan array tidak undefined
  if (!Array.isArray(user.followers)) user.followers = [];
  if (!Array.isArray(user.following)) user.following = [];
  if (!Array.isArray(targetUser.followers)) targetUser.followers = [];
  if (!Array.isArray(targetUser.following)) targetUser.following = [];

  if (command === 'follow') {
    if (user.following.includes(target)) return m.reply('✅ Kamu sudah mengikuti pengguna ini.');

    user.following.push(target);
    if (!targetUser.followers.includes(m.sender)) targetUser.followers.push(m.sender);

    return m.reply(`✅ Kamu sekarang mengikuti *${targetUser.nama}*.`);
  }

  if (command === 'unfollow') {
    if (!user.following.includes(target)) return m.reply('❌ Kamu belum mengikuti pengguna ini.');

    user.following = user.following.filter(jid => jid !== target);
    targetUser.followers = targetUser.followers.filter(jid => jid !== m.sender);

    return m.reply(`✅ Kamu telah berhenti mengikuti *${targetUser.nama}*.`);
  }
};

handler.command = /^(follow|unfollow)$/i;
handler.tags = ['media'];
handler.help = ['follow @user', 'unfollow @user'];

export default handler;