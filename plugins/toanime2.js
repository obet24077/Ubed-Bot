import axios from "axios";
import CryptoJS from "crypto-js";
import fs from "fs";

// Handler utama buat convert gambar ke anime
let handler = async (m, { conn, text, usedPrefix: prefix, command: cmd }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || "";
    
    // Cek apakah inputnya gambar
    if (!/image/.test(mime)) {
        return await conn.reply(m.chat, `Eh Senpai, kok ga kirim gambar? Kirim atau reply gambar dong pake caption:\n> _*${prefix + cmd} [1/2/3/4]*_ (buat pilih style anime-nya)`, m);
    }

    let style = text && !isNaN(text) ? Number(text) : 2; // Default style 2 kalo ga ada input
    await m.reply("Sabar ya Senpai, aku proses dulu nih...");

    try {
        const aiease = new Aiease({ debug: true });
        const image = await q.download(); // Download gambar dari pesan
        const result = await aiease.generateImage("filter", image, { style });

        if (!result) {
            await conn.reply(m.chat, "Yah, gagal bikin anime-nya, Senpai! Sabar ya, kita coba lagi nanti.", m);
            return await conn.sendMessage(m.chat, { react: { delete: m.key, key: m.key } });
        }

        const { origin } = result[0]; // Ambil URL gambar hasil
        await conn.sendMessage(m.chat, {
            image: { url: origin },
            mimetype: "image/jpeg",
            caption: "Jadi deh, Senpai! Keren kan? 😎",
        }, { quoted: m });

    } catch (err) {
        // Hiburan kalo error
        await conn.reply(m.chat, `Oops, error nih Senpai! Log-nya: \`\`\`${err.message}\`\`\`\nTenang, jangan panik, aku bantu cek. Mungkin server-nya lagi ngambek, coba lagi yuk!`, m);
    }
};

handler.help = ["jadianime2"];
handler.tags = ["ai"];
handler.command = ["jadianime2", "toanime2"];
handler.premium = true;

export default handler;

// Class Aiease yang udah aku bikin lebih simpel dan rapi
class Aiease {
    constructor({ debug = false } = {}) {
        this.DEBUG = debug;
        this.AUTH_TOKEN = null;
        this.api = {
            uploader: "https://www.aiease.ai/api/api/id_photo/s",
            genImg2Img: "https://www.aiease.ai/api/api/gen/img2img",
            taskInfo: "https://www.aiease.ai/api/api/id_photo/task-info",
            token: "https://www.aiease.ai/api/api/user/visit",
        };
        this.headers = {
            json: {
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0",
                "Authorization": null,
                "Accept": "application/json",
            },
            image: {
                "Content-Type": "image/jpeg",
                "Host": "pub-static.aiease.ai",
                "Origin": "https://www.aiease.ai",
                "Referer": "https://www.aiease.ai/",
                "User-Agent": "Mozilla/5.0",
                "Accept": "*/*",
            },
        };
        this.payloadFilter = {
            gen_type: "ai_filter",
            ai_filter_extra_data: {
                img_url: null,
                style_id: null,
            },
        };
        this.constants = { maxRetry: 40, retryDelay: 3000 };
        const { useEncrypt, useDecrypt } = this._setupEncryption();
        this.useEncrypt = useEncrypt;
        this.useDecrypt = useDecrypt;
    }

    // Setup enkripsi, aku bikin simpel tapi aman
    _setupEncryption() {
        const key = CryptoJS.SHA256("Q@D24=oueV%]OBS8i,%eK=5I|7WU$PeE").toString(CryptoJS.enc.Hex);
        const encryptionKey = CryptoJS.enc.Hex.parse(key);

        return {
            useEncrypt: (text) => {
                const iv = CryptoJS.lib.WordArray.random(16);
                const encrypted = CryptoJS.AES.encrypt(encodeURIComponent(text), encryptionKey, {
                    iv,
                    mode: CryptoJS.mode.CFB,
                    padding: CryptoJS.pad.NoPadding,
                });
                return CryptoJS.enc.Base64.stringify(iv.concat(encrypted.ciphertext));
            },
            useDecrypt: (encryptedText) => {
                const bytes = CryptoJS.enc.Base64.parse(encryptedText);
                const iv = CryptoJS.lib.WordArray.create(bytes.words.slice(0, 4), 16);
                const ciphertext = CryptoJS.lib.WordArray.create(bytes.words.slice(4), bytes.sigBytes - 16);
                const decrypted = CryptoJS.AES.decrypt({ ciphertext }, encryptionKey, {
                    iv,
                    mode: CryptoJS.mode.CFB,
                    padding: CryptoJS.pad.NoPadding,
                });
                return decodeURIComponent(decrypted.toString(CryptoJS.enc.Utf8));
            },
        };
    }

    // Upload gambar ke server
    async uploadImage(input) {
        if (!this.AUTH_TOKEN) await this.getToken();
        const buffer = Buffer.isBuffer(input) ? input : fs.existsSync(input) ? fs.readFileSync(input) : Buffer.from(input);
        const metadata = {
            length: buffer.length,
            filetype: "image/jpeg",
            filename: `IMG-${Date.now()}-WA${Math.random().toString(36).slice(2, 6)}.jpg`,
        };

        const encryptedMetadata = this.useEncrypt(JSON.stringify(metadata));
        const response = await axios.post(`${this.api.uploader}?time=${Date.now()}`, { t: encryptedMetadata }, { headers: this.headers.json });
        const uploadUrl = this.useDecrypt(response.data.result);

        await axios.put(uploadUrl, buffer, { headers: { "Content-Length": buffer.length, ...this.headers.image } });
        return uploadUrl.split("?")[0];
    }

    // Generate gambar anime
    async generateImage(type, input, { style = 2 } = {}) {
        if (!this.AUTH_TOKEN) await this.getToken();
        const imgUrl = await this.uploadImage(input);
        const payload = { ...this.payloadFilter };
        payload.ai_filter_extra_data.img_url = imgUrl;
        payload.ai_filter_extra_data.style_id = style;

        const response = await axios.post(this.api.genImg2Img, payload, { headers: this.headers.json });
        const taskId = response.data.result.task_id;
        return await this.checkTaskStatus(taskId);
    }

    // Cek status task sampai selesai
    async checkTaskStatus(taskId) {
        let attempts = 0;
        while (attempts < this.constants.maxRetry) {
            const response = await axios.get(`${this.api.taskInfo}?task_id=${taskId}`, { headers: this.headers.json });
            const status = response.data.result.data.queue_info.status;

            if (status === "success") return response.data.result.data.results;
            if (response.data.code === 450) throw new Error("Gambar gagal diproses, coba lagi ya Senpai!");

            attempts++;
            await new Promise((resolve) => setTimeout(resolve, this.constants.retryDelay));
        }
        throw new Error("Waktu habis, server-nya lambat banget nih!");
    }

    // Ambil token autentikasi
    async getToken() {
        const response = await axios.post(this.api.token, {}, { headers: this.headers.json });
        if (response.data.code === 200) {
            this.AUTH_TOKEN = `JWT ${response.data.result.user.token}`;
            this.headers.json.Authorization = this.AUTH_TOKEN;
        } else {
            throw new Error("Gagal ambil token, internetnya bermasalah kali ya?");
        }
    }
}