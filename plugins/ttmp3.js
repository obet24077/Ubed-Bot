import fetch from 'node-fetch';
import moment from 'moment-timezone';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `📌 Gunakan contoh: *${usedPrefix}${command} https://vt.tiktok.com/xxxxxx*`;

    if (!text.includes('tiktok.com')) throw `❌ Link yang kamu berikan bukan link TikTok!`;

    await conn.sendMessage(m.chat, {
        react: {
            text: "⏳",
            key: m.key
        }
    });

    try {
        const apiUrl = `https://flowfalcon.dpdns.org/download/tiktok?url=${encodeURIComponent(text)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data?.status || !data.result?.data) {
            await conn.sendMessage(m.chat, {
                react: {
                    text: "❌",
                    key: m.key
                }
            });
            throw '❌ Gagal mengambil data TikTok.';
        }

        const res = data.result.data;
        const {
            title,
            music
        } = res;

        if (music) {
            await conn.sendMessage(m.chat, {
                audio: { url: music },
                mimetype: 'audio/mpeg',
                fileName: `${title?.replace(/[^a-z0-9]/gi, '_') || 'tiktok_audio'}.mp3`,
                caption: '🎶 *Audio TikTok*'
            }, { quoted: m });
            await conn.sendMessage(m.chat, {
                react: {
                    text: "✅",
                    key: m.key
                }
            });
        } else {
            await conn.sendMessage(m.chat, {
                react: {
                    text: "⚠️",
                    key: m.key
                }
            });
            throw '⚠️ Tidak ada audio yang ditemukan dalam video TikTok ini.';
        }

    } catch (e) {
        console.error('[TIKTOK AUDIO ERROR]', e);
        await conn.sendMessage(m.chat, {
            react: {
                text: "❌",
                key: m.key
            }
        });
        throw `❌ Gagal mengunduh audio TikTok.\n\n*Error Log:* ${e.message || e}`;
    }
};

handler.help = ['tiktokaudio', 'ttaudio'].map(v => v + ' <link>');
handler.tags = ['downloader'];
handler.command = /^(tiktokaudio|ttaudio|ttmp3|tiktokmp3)$/i;
handler.limit = true;

export default handler;