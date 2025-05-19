const handler = async (m, { conn, command }) => {
  const now = new Date();
  const offset = 7;
  const wibTime = new Date(now.getTime() + offset * 60 * 60 * 1000);

  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const day = dayNames[wibTime.getUTCDay()];
  const date = wibTime.getUTCDate();
  const month = monthNames[wibTime.getUTCMonth()];
  const year = wibTime.getUTCFullYear();
  const hour = String(wibTime.getUTCHours()).padStart(2, '0');
  const minute = String(wibTime.getUTCMinutes()).padStart(2, '0');
  const second = String(wibTime.getUTCSeconds()).padStart(2, '0');

  const formattedDate = `🗓 Tanggal: ${day}, ${date} ${month} ${year}
⏰ Waktu: ${hour}:${minute}:${second} WIB`;

  await conn.sendMessage(m.chat, { text: formattedDate }, { quoted: m });
};

handler.command = /^(date|tanggal)$/i;

export default handler;