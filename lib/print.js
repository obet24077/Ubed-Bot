import { WAMessageStubType } from '@adiwajshing/baileys';
import PhoneNumber from 'awesome-phonenumber';
import chalk from 'chalk';
import { watchFile } from 'fs';

const terminalImage = global.opts['img'] ? require('terminal-image') : '';
const urlRegex = (await import('url-regex-safe')).default({ strict: false });

export default async function (m, conn = { user: {} }) {
    // Mendapatkan nama dan nomor pengirim
    let _name = await conn.getName(m.sender);
    let sender = PhoneNumber('+' + m.sender.replace('@s.whatsapp.net', '')).getNumber('international') + (_name ? ' ~' + _name : '');
    let chat = await conn.getName(m.chat);

    // Mengambil gambar jika ada
    let img;
    try {
        if (global.opts['img']) {
            img = /sticker|image/gi.test(m.mtype) ? await terminalImage.buffer(await m.download()) : false;
        }
    } catch (e) {
        console.error(e);
    }

    // Menghitung ukuran file atau panjang teks
    let filesize = (
        m.msg ?
            m.msg.vcard ? m.msg.vcard.length :
            m.msg.fileLength ? m.msg.fileLength.low || m.msg.fileLength :
            m.msg.axolotlSenderKeyDistributionMessage ? m.msg.axolotlSenderKeyDistributionMessage.length :
            m.text ? m.text.length : 0
        : m.text ? m.text.length : 0
    ) || 0;

    // Mengambil informasi pengguna
    let user = global.DATABASE.data.users[m.sender];
    let me = PhoneNumber('+' + (conn.user?.jid).replace('@s.whatsapp.net', '')).getNumber('international');
    let type = m.isGroup ? "GROUP CHAT" : "PRIVATE CHAT";
    let txt = m.text && m.text.length >= 30 ? m.text.slice(0, 29) + "..." : m.text || '';
    let isBot = m.isBaileys ? "YA" : "NO";
    let plugin = m.plugin || '';

    // Header Informasi
    // Header
let headers = chalk.yellow.bold(`┌────────────────────────────────────────────┐
│              ${chalk.cyanBright('CHAT INFORMATION')}              │
└────────────────────────────────────────────┘`);

// Body
let body = `
${chalk.green('• Type        :')} ${chalk.bold(type)}
${chalk.green('• From        :')} ${chalk.bold(chat)}
${chalk.green('• Number      :')} ${chalk.bold(sender)}
${chalk.green('• Chatbot     :')} ${chalk.bold(isBot)}
${chalk.green('• Plugin      :')} ${chalk.bold(plugin || '-')}
${chalk.green('• Exp         :')} ${chalk.bold(user?.exp ?? '?')}
${chalk.green('• Level       :')} ${chalk.bold(user?.level ?? '?')}
${chalk.green('• MIME Type   :')} ${chalk.black.bgGreen(m.messageStubType ? WAMessageStubType[m.messageStubType] : m.mtype)}
`.trim();

// Command
let command = `
${chalk.greenBright('┌───────────────────[ CMD ]───────────────────┐')}
${chalk.reset(m.isCommand ? chalk.yellowBright('→ ' + txt) : m.error ? chalk.redBright('× ' + txt) : txt)}
${chalk.greenBright('└─────────────────────────────────────────────┘')}
`;

// Footer
let footer = chalk.bgRedBright.blue.bold('   UBED BOT MD - INI PUNYA UBED   ');

// Tampilkan ke console
console.log(`${headers}\n${body}\n${command}\n${footer}`);

    // Menampilkan gambar jika ada
    if (img) console.log(img.trimEnd());

    // Memformat teks untuk terminal
    if (typeof m.text === 'string' && m.text) {
        let log = m.text.replace(/\u200e+/g, '');
        let mdRegex = /(?<=(?:^|[\s\n])\S?)(?:([*_~])(.+?)\1|```((?:.||[\n\r])+?)```)(?=\S?(?:[\s\n]|$))/g;
        let mdFormat = (depth = 4) => (_, type, text, monospace) => {
            let types = { _: 'italic', '*': 'bold', '~': 'strikethrough' };
            text = text || monospace;
            let formatted = !types[type] || depth < 1 ? text : chalk[types[type]](text.replace(mdRegex, mdFormat(depth - 1)));
            return formatted;
        };

        if (log.length < 4096)
            log = log.replace(urlRegex, (url, i, text) => {
                let end = url.length + i;
                return i === 0 || end === text.length || (/^\s$/.test(text[end]) && /^\s$/.test(text[i - 1])) ? chalk.redBright(url) : url;
            });

        log = log.replace(mdRegex, mdFormat(4));
        if (m.mentionedJid) {
            for (let user of m.mentionedJid) {
                log = log.replace('@' + user.split`@`[0], chalk.redBright('@' + await conn.getName(user)));
            }
        }
        console.log(m.error != null ? chalk.red(log) : m.isCommand ? chalk.yellow(log) : log);
    }

    // Menampilkan informasi tambahan jika ada
    if (m.messageStubParameters) {
        console.log(m.messageStubParameters.map(jid => {
            jid = conn.decodeJid(jid);
            let name = conn.getName(jid);
            return chalk.gray(PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international') + (name ? ' ~' + name : ''));
        }).join(', '));
    }

    // Menampilkan jenis media jika ada
    if (/document/i.test(m.mtype)) console.log(`🗂️ ${m.msg.fileName || m.msg.displayName || 'Document'}`);
    else if (/ContactsArray/i.test(m.mtype)) console.log(`👨‍👩‍👧‍👦 ${' ' || ''}`);
    else if (/contact/i.test(m.mtype)) console.log(`👨 ${m.msg.displayName || ''}`);
    else if (/audio/i.test(m.mtype)) {
        const duration = m.msg.seconds;
        console.log(`${m.msg.ptt ? '🎤 (PTT ' : '🎵 ('}AUDIO) ${Math.floor(duration / 60).toString().padStart(2, 0)}:${(duration % 60).toString().padStart(2, 0)}`);
    }

    console.log();

    // Cek fitur Anti-Bot
    let chatData = global.DATABASE.data.chats[m.sender];
    if (m.isGroup) {
        if (chatData && chatData.antiBot) {
            if (m.isBaileys || m.id.startsWith("3EB0")) {
                if (!m.fromMe) {
                    await conn.sendMessage(m.chat, { text: `*[ System notice ]* Detect another bot, I will kick you` });
                    await conn.groupParticipantsUpdate(m.chat, [m.sender], "remove");
                    await conn.delay(2000);
                }
            }
        }
    }
}

// Menjaga agar perubahan langsung terdeteksi
let file = global.__filename(import.meta.url);
watchFile(file, () => {
    console.log(chalk.redBright("Update 'lib/print.js'"));
});