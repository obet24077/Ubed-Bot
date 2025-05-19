let handler = async (m, { text }) => {
    const name = text.trim();
    if (!name) throw `Contoh: .deletesv <nama>`;

    const axios = (await import('axios')).default;

    const PANEL_URL = 'https://obet.arlyyymodealimm.my.id';
    const API_KEY = 'ptla_bxi4jAvMZuEdBofgRyBfmecfzjvXq8kaJVOAnMcHeXw';

    try {
        // Mengambil daftar server
        let { data } = await axios.get(`${PANEL_URL}/api/application/servers`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Accept': 'application/json'
            }
        });

        // Mencari server dengan nama yang diberikan
        const server = data.data.find(s => s.attributes.name.toLowerCase() === name.toLowerCase());
        if (!server) throw `❌ Server dengan nama ${name} tidak ditemukan`;

        // Menghapus server berdasarkan ID
        await axios.delete(`${PANEL_URL}/api/application/servers/${server.id}`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Accept': 'application/json'
            }
        });

        await m.reply(`✅ Server dengan nama *${name}* berhasil dihapus!`);
    } catch (err) {
        console.error(err.response?.data || err);
        throw `❌ Gagal menghapus server.\n\n${err.response?.data?.errors?.[0]?.detail || err.message}`;
    }
};

handler.help = ['deletesv <nama>'];
handler.tags = ['owner'];
handler.command = /^deletesv$/i;
handler.owner = true;

export default handler;