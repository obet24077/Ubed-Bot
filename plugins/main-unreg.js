import { createHash } from 'crypto';

let handler = async function (m, { args }) {
  // Fetch user data from the database
  let user = global.db.data.users[m.sender];

  // Check if the user has enough limit and eris
  if (user.limit < 15) throw 'Anda tidak memiliki cukup limit untuk unreg. Minimal limit 15.';
  if (user.eris < 15000) throw 'Anda tidak memiliki cukup Money untuk unreg. Minimal Money Kamu 15,000.';

  // Ensure a serial number is provided
  if (!args[0]) throw 'Masukkan Serial Nomor, kalau tidak tahu ketik .ceksn';

  // Extract SN part from the URL if it matches the pattern
  let snInput = args[0].match(/https:\/\/pontaceksn\.com\/sn\/([a-f0-9]{32})/i);
  if (!snInput) throw 'Format Serial Nomor tidak valid';

  let inputSn = snInput[1]; // Get the SN part from the URL
  let sn = createHash('md5').update(m.sender).digest('hex'); // Generate SN based on the user's ID

  // Check if the input SN matches the generated SN
  if (inputSn !== sn) throw 'Serial Nomor salah';

  // Unregister the user
  user.registered = false;

  // Deduct limit and eris
  user.limit -= 15; // Deduct 15 from user limit
  user.eris -= 15000; // Deduct 15,000 from user eris

  // Notify user of success and indicate that values have been consumed
  m.reply(`Sukses Unreg!\n* Limit:  -15\n* Money:  -15,000`);
};

handler.help = ['unregister'];
handler.tags = ['main'];
handler.command = /^unreg(ister)?$/i;
handler.register = true;

export default handler;