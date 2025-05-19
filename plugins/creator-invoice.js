const handler = async (m, { conn, text }) => {
  try {
    if (!text) {
      return await conn.sendMessage(m.chat, { text: 'Masukkan format teks: produk, jumlah, username, refid, waktu. Contoh: DM 180, 1, LoL Human, LoL-123, Hari Ini, 32 Senin Masehi.' });
    }

    // Memisahkan input pengguna menjadi bagian yang sesuai
    const [produk, jumlah, username, refid, waktu] = text.split(',').map(item => item.trim());

    // Memastikan semua parameter telah dimasukkan
    if (!produk || !jumlah || !username || !refid || !waktu) {
      return await conn.sendMessage(m.chat, { text: 'Semua parameter (produk, jumlah, username, refid, waktu) harus diisi. Format: produk, jumlah, username, refid, waktu.' });
    }

    // Membuat URL API dengan data yang dimasukkan pengguna
    const invoiceUrl = `https://api.lolhuman.xyz/api/creator/invoice?apikey=ubed2407&produk=${encodeURIComponent(produk)}&id=12345678&jumlah=${encodeURIComponent(jumlah)}&username=${encodeURIComponent(username)}&refid=${encodeURIComponent(refid)}&waktu=${encodeURIComponent(waktu)}`;

    // Mengirimkan reaksi emoji untuk menunjukkan bahwa proses sedang berlangsung
    await conn.sendMessage(m.chat, { react: { text: '💳', key: m.key } });

    // Mengirimkan gambar dengan caption yang berisi informasi dari pengguna
    await conn.sendMessage(m.chat, {
      image: { url: invoiceUrl },
      caption: `Invoice untuk:\nProduk: ${produk}\nJumlah: ${jumlah}\nUsername: ${username}\nRefid: ${refid}\nWaktu: ${waktu}\nDibuat oleh Ubed Bot`
    }, { quoted: m });

    // Mengirimkan reaksi emoji ✅ setelah pengiriman berhasil
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (err) {
    // Jika terjadi kesalahan, kirimkan reaksi emoji ❌ dan pesan kesalahan
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    await conn.sendMessage(m.chat, {
      text: `Terjadi kesalahan: ${err.message || err}`
    }, { quoted: m });
  }
};

handler.help = ['invoice <produk, jumlah, username, refid, waktu>'];
handler.tags = ['creator'];
handler.command = ['invoice'];
handler.limit = true;

export default handler;