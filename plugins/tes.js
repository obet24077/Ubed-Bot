import PhoneNumber from 'awesome-phonenumber'
import moment from 'moment'
import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'
import { promises, readFileSync } from 'fs'
import fs from 'fs'
import jimp from 'jimp';
import { join } from 'path'
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let handler  = async (m, { conn, isOwner}) => {
   let user = global.db.data.users[m.sender]    
   let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
   let { premium, owner, level, limit, exp, lastclaim, registered, regTime, age, pasangan, skill, name } = global.db.data.users[m.sender]
    let username = conn.getName(who)
    var now = new Date() * 1
    const tag = '@' + m.sender.split`@`[0];
    let ppnya = await conn.profilePictureUrl(m.sender, "image").catch(() => 'https://telegra.ph/file/6880771a42bad09dd6087.jpg')
    let bjir = 'https://telegra.ph/file/6880771a42bad09dd6087.jpg'
    let fload = { key : { remoteJid: 'status@broadcast', participant : '0@s.whatsapp.net' }, message: { orderMessage: { itemCount : 999, status: 404, surface : 404, message: `® Yue Bot`, orderTitle: ``, thumbnailUrl: ppnya, sellerJid: '0@s.whatsapp.net' }}}
 const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = (await import("@adiwajshing/baileys")).default
let msgs = generateWAMessageFromContent(m.chat, {
  viewOnceMessage: {
    message: {
        "messageContextInfo": {
          "deviceListMetadata": {},
          "deviceListMetadataVersion": 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({
            text: `\`Y O U R  S T A T U S\`

> - *Nama:* ${tag}
> - *Nomor:* ${PhoneNumber('+' + who.replace('@s.whatsapp.net', '')).getNumber('international')}
> - *Premium:* ${premium ? "Aktif" :"Tidak"}
> - *Limit:* ${user.limit}
> - *Money:* ${user.eris}
> - *Role:* ${user.role}
> - *Level:* ${user.level}
> - *Xp:* ${user.exp}
> -  *Register:* ${registered ? 'Terdaftar': 'Tidak'}.
> - *Owner:* ${isOwner ? "Ya" :"Tidak"}
 
\`B O T  S T A T U S\`
> _LAIN KALI_


_JANGAN LUPA *DAFTAR* AGAR BOT DAPAT MENGINGAT ANDA SELALU ୧⍤⃝_


> _*YUE IN HERE*_
`,
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: "~ [ *List Menu* ] ~",
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            title: "",
            subtitle: namebot,
            hasMediaAttachment: true,...(await prepareWAMessageMedia({ image: { url: "https://telegra.ph/file/fe5fee05be44a91678ccc.jpg" }}, { upload: conn.waUploadToServer }))
          }),
contextInfo: { 
        	isForwarded: true, 
	        forwardedNewsletterMessageInfo: {
			newsletterJid: '120363199602506586@newsletter',
			newsletterName: namebot, 
			serverMessageId: -1
		}
          }, 
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
{                "name": "quick_reply",
                "buttonParamsJson": "{\"display_text\":\"🌐AllMenu\",\"id\":\"Oallmenu\"}"
},
{
                "name": "quick_reply",
                "buttonParamsJson": "{\"display_text\":\"🎮Menu Game\",\"id\":\"Omenulist\"}"
},
{
                "name": "quick_reply",
                "buttonParamsJson": "{\"display_text\":\"🔰Menu Rpg\",\"id\":\"Omenurg\"}"
},
 {
                "name": "quick_reply",
                "buttonParamsJson": "{\"display_text\":\"🤖Menu Ai\",\"id\":\"Omenuai\"}"
},
{
                "name": "quick_reply",
                "buttonParamsJson": "{\"display_text\":\"👾Menu Fun\",\"id\":\"Omenufun\"}"
},
{
                "name": "quick_reply",
                "buttonParamsJson": "{\"display_text\":\"👥Menu Group\",\"id\":\"Omenugroup\"}"
},
{
                "name": "quick_reply",
                "buttonParamsJson": "{\"display_text\":\"🪪Menu Owner\",\"id\":\"Omenuowner\"}"
},
{
                "name": "quick_reply",
                "buttonParamsJson": "{\"display_text\":\"🔞Menu Nsfw\",\"id\":\"Omenunsfw\"}"
},
{
                "name": "quick_reply",
                "buttonParamsJson": "{\"display_text\":\"🧛‍♀️Menu Anime\",\"id\":\"Omenuanime\"}"
}
           ],
          })
        })
    }
  }
}, {})

return await conn.relayMessage(m.key.remoteJid, msgs.message, {
  messageId: m.key.id
})
}
handler.command = /^(tes)$/i;

export default handler

    function timeConvertA(input) {
    var now = new Date().getTime();
    var timeleft = input - now;

    var days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
    var hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

    return {day: days, hour: hours, minute: minutes, second: seconds}
}

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function msToDate(ms) {
    let temp = ms
    let days = Math.floor(ms / (24 * 60 * 60 * 1000));
    let daysms = ms % (24 * 60 * 60 * 1000);
    let hours = Math.floor((daysms) / (60 * 60 * 1000));
    let hoursms = ms % (60 * 60 * 1000);
    let minutes = Math.floor((hoursms) / (60 * 1000));
    let minutesms = ms % (60 * 1000);
    let sec = Math.floor((minutesms) / (1000));
    return days + " Hari\n" + hours + " Jam\n" + minutes + " Menit";
    // +minutes+":"+sec;
}
async function reSize(url, width, height, referer = null) {
    try {
        const fetchOptions = {
            redirect: 'follow',
            headers: {},
        };

        if (referer) {
            fetchOptions.headers['Referer'] = referer;
        }

        const response = await fetch(url, fetchOptions);

        if (response.ok) {
            const finalUrl = response.url;
            const arrayBuffer = await response.arrayBuffer();
            return await jimp.read(Buffer.from(arrayBuffer)).then(image => image.resize(width, height).getBufferAsync(jimp.MIME_JPEG));
        } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error:', error.message);

        try {
            const undiciFetchOptions = {
                redirect: 'follow',
                headers: {},
            };

            if (referer) {
                undiciFetchOptions.headers['Referer'] = referer;
            }

            const arrayBuffer = await undiciFetch(url, undiciFetchOptions).then(response => response.arrayBuffer());
            return await jimp.read(Buffer.from(arrayBuffer)).then(image => image.resize(width, height).getBufferAsync(jimp.MIME_JPEG));
        } catch (retryError) {
            console.error('Retry Error:', retryError.message);
            return Buffer.from([]);
        }
    }
}