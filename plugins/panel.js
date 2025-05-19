let handler = async (m, { text, command }) => {
    const [name, tier, port] = text.split(" ");
    if (!name || !tier || !port) throw `Contoh: .createsv zahra unli 2001`;

    const axios = (await import('axios')).default;

    const PANEL_URL = 'https://obet.arlyyymodealimm.my.id';
    const API_KEY = 'ptla_bxi4jAvMZuEdBofgRyBfmecfzjvXq8kaJVOAnMcHeXw';

    const NODE_ID = 1;
    const EGG_ID = 15;
    const NEST_ID = 5;
    const USER_ID = 1;  // ID Admin atau user yang punya akses buat buat server
    const PORT = parseInt(port);

    const tierSettings = {
        '1gb': { memory: 1024, cpu: 100 },
        '5gb': { memory: 5120, cpu: 100 },
        '8gb': { memory: 8192, cpu: 200 },
        'unli': { memory: 0, cpu: 0 }
    };

    const limits = tierSettings[tier.toLowerCase()];
    if (!limits) throw `Tipe tidak valid. Gunakan: 1gb, 5gb, 8gb, unli`;

    try {
        // Mengecek apakah user sudah ada
        let { data } = await axios.get(`${PANEL_URL}/api/application/users`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Accept': 'application/json'
            }
        });

        // Cek apakah user sudah ada
        let user = data.data.find(u => u.attributes.username.toLowerCase() === name.toLowerCase());

        // Jika user tidak ada, buat user baru
        if (!user) {
            let newUserData = {
                username: name,
                email: `${name}@example.com`,
                first_name: name,
                last_name: name,
                language: 'en'
            };

            let newUserRes = await axios.post(`${PANEL_URL}/api/application/users`, newUserData, {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            user = newUserRes.data;
        }

        // Mengambil alokasi port
        let allocations = await axios.get(`${PANEL_URL}/api/application/nodes/${NODE_ID}/allocations`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Accept': 'application/json'
            }
        });

        const allocation = allocations.data.data.find(a => a.attributes.port == PORT);
        if (!allocation) throw `❌ Gagal mencari alokasi port ${PORT}`;

        // Membuat server untuk user yang baru dibuat atau yang sudah ada
        const payload = {
            name,
            user: user.id,  // Menggunakan ID user yang ditemukan atau dibuat
            egg: EGG_ID,
            docker_image: 'ghcr.io/pterodactyl/yolks:nodejs_18',
            startup: '{{CMD_RUN}}',
            environment: {
                GIT_ADDRESS: '',
                BRANCH: '',
                USERNAME: '',
                ACCESS_TOKEN: '',
                CMD_RUN: 'npm start'
            },
            limits: {
                memory: limits.memory,
                swap: 0,
                disk: 1024,
                io: 500,
                cpu: limits.cpu
            },
            feature_limits: {
                databases: 1,
                allocations: 1,
                backups: 0
            },
            allocation: {
                default: allocation.attributes.id
            },
            start_on_completion: true
        };

        let res = await axios.post(`${PANEL_URL}/api/application/servers`, payload, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        let server = res.data.attributes;
        if (!server.uuidShort) throw '❌ Gagal mendapatkan UUID server';

        // Kirim pesan server yang berhasil dibuat
        await m.reply(`✅ Server berhasil dibuat!\n\n📛 *Nama:* ${server.name}\n🗝️ *Password:* ${server.name}${Math.floor(Math.random() * 100000)}\n🔗 *Panel:* ${PANEL_URL}/server/${server.uuidShort}`);
    } catch (err) {
        console.error(err.response?.data || err);
        throw `❌ Gagal membuat server.\n\n${err.response?.data?.errors?.[0]?.detail || err.message}`;
    }
};

handler.help = ['panel <nama> <tipe> <port>'];
handler.tags = ['owner'];
handler.command = /^panel$/i;
handler.owner = true;

export default handler;