import fetch from 'node-fetch';

// Fungsi untuk mendapatkan jadwal sholat dari API Aladhan
const getPrayerTimes = async (latitude, longitude, timezone) => {
    const url = `http://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2&school=1&timezonestring=${timezone}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            return data.data.timings;  // Mengembalikan data waktu sholat
        } else {
            throw new Error('Gagal mendapatkan jadwal sholat.');
        }
    } catch (error) {
        console.error('Error:', error.message);
        return null;
    }
};

// Handler untuk menampilkan jadwal sholat WIT dan WIB
const handler = async (m, { conn }) => {
    // Koordinat Jakarta untuk WIB
    const latitudeWIB = -6.2088;
    const longitudeWIB = 106.8456;
    const timezoneWIB = "Asia/Jakarta"; // Zona waktu untuk WIB (GMT +7)

    // Koordinat Jayapura untuk WIT
    const latitudeWIT = -2.5337;
    const longitudeWIT = 140.7181;
    const timezoneWIT = "Asia/Jayapura"; // Zona waktu untuk WIT (GMT +9)

    // Mengirim pesan sementara "Mengambil jadwal sholat..."
    const sentMessage = await conn.sendMessage(
        m.chat,
        { text: "Mengambil jadwal sholat..." },
        { quoted: m }
    );

    try {
        // Ambil jadwal sholat untuk WIB
        const prayerTimesWIB = await getPrayerTimes(latitudeWIB, longitudeWIB, timezoneWIB);
        // Ambil jadwal sholat untuk WIT
        const prayerTimesWIT = await getPrayerTimes(latitudeWIT, longitudeWIT, timezoneWIT);

        if (prayerTimesWIB && prayerTimesWIT) {
            const message = `
🌏 *Jadwal Sholat WIB (Jakarta)*:
- Subuh: ${prayerTimesWIB.Fajr}
- Dzuhur: ${prayerTimesWIB.Dhuhr}
- Ashar: ${prayerTimesWIB.Asr}
- Maghrib: ${prayerTimesWIB.Maghrib}
- Isya: ${prayerTimesWIB.Isha}

🌏 *Jadwal Sholat WIT (Jayapura)*:
- Subuh: ${prayerTimesWIT.Fajr}
- Dzuhur: ${prayerTimesWIT.Dhuhr}
- Ashar: ${prayerTimesWIT.Asr}
- Maghrib: ${prayerTimesWIT.Maghrib}
- Isya: ${prayerTimesWIT.Isha}
            `;

            // Mengedit pesan sementara dengan hasil jadwal sholat
            await conn.sendMessage(
                m.chat,
                { text: message, edit: sentMessage.key },
                { quoted: floc }
            );
        } else {
            await conn.sendMessage(
                m.chat,
                { text: 'Gagal mendapatkan jadwal sholat.', edit: sentMessage.key },
                { quoted: m }
            );
        }
    } catch (error) {
        console.error(error);
        await conn.sendMessage(
            m.chat,
            { text: 'Terjadi kesalahan saat memproses permintaan Anda.', edit: sentMessage.key },
            { quoted: m }
        );
    }
};

// Detail perintah handler
handler.command = ['jadwalsholat', 'sholat'];
handler.help = ['jadwalsholat'];
handler.tags = ['internet'];
handler.limit = true;

export default handler;