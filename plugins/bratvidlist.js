const handler = async (m, { conn }) => {
    const bratvidList = `
*BRATVID - Daftar Warna Background & Teks:*
✅ bratvid – Normal
✅ bratvid2 – Normal text Kecil
✅ bratvid4 – Background Hijau, Teks Hitam
✅ bratvid5 – Background Merah, Teks Putih
✅ bratvid6 – Background Biru, Teks Putih
✅ bratvid7 – Background Kuning, Teks Hitam
✅ bratvid8 – Background Ungu, Teks Putih
✅ bratvid9 – Background Oranye, Teks Hitam
✅ bratvid10 – Background Cyan, Teks Hitam
✅ bratvid11 – Background Abu-Abu, Teks Putih
✅ bratvid12 – Background Coklat, Teks Putih
✅ bratvid13 – Background Pink, Teks Hitam
✅ bratvid14 – Background Hijau Tua, Teks Putih
✅ bratvid15 – Background Emas, Teks Hitam
✅ bratvid16 – Background Navy, Teks Putih
✅ bratvid17 – Background Lavender, Teks Hitam
✅ bratvid18 – Background Magenta, Teks Putih
✅ bratvid19 – Background Teal, Teks Putih
✅ bratvid20 – Background Hitam, Teks Putih

🔹 *Fitur Unggulan:*
✨ 19 Pilihan Warna
✨ Teks Animasi Berjalan Bertahap
✨ Mudah Digunakan! Ketik .bratvid5 <teks>
    `.trim();

    await conn.sendMessage(m.chat, { text: bratvidList }, { quoted: m });
};

handler.command = /^bratvidlist$/i;
handler.tags = ['info'];
handler.help = ['bratvidlist'];
export default handler;