//Ubed Bot
//ubah global.device

import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import moment from 'moment-timezone'
import { group } from 'console'
import PhoneNumber from 'awesome-phonenumber'

/*============= WAKTU =============*/
let wibh = moment.tz('Asia/Jakarta').format('HH')
let wibm = moment.tz('Asia/Jakarta').format('mm')
let wibs = moment.tz('Asia/Jakarta').format('ss')
let wktuwib = `${wibh} H ${wibm} M ${wibs} S`

let d = new Date(new Date + 3600000)
let locale = 'id'
let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
let week = d.toLocaleDateString(locale, { weekday: 'long' })
let date = d.toLocaleDateString(locale, {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})
const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

global.tele_token = '7647598365:AAF5nSoJGfTmewL_C4V96p_nUjTwybqfvZw' // Untuk bot tele auto AI

/// Setting Dari Sini
global.owner = [
  ['6285147777105', 'Ubed', true],
  ['6281399172380', 'zahra', true],
]
global.mods = ['']
global.devicename = 'UBEDUBED' //buat pairing kode kamu bang
global.ubedkey = 'Ubed2407'
global.owner2 = ['']
global.prems = []
global.nomorbot = '6285248500955'
global.nomorown = '6285147777105'
global.nomorown1 = '-'
global.nomorown2 = '-'
global.nomorwa = '-'
global.pushowner = 'https://wa.me/6285147777105'
global.readMore = readMore
global.author = 'Ubed'
global.namebot = 'Ubed Bot'
global.wm = `©${global.namebot} By ubed`
global.watermark = wm
global.wm2 = `©${global.namebot} By ubed`
global.botdate = `Date: ${week} ${date}\nTime: ${wktuwib}`
global.bottime = `Time: ${wktuwib}`
global.titlebot = `🍏`
global.stickpack = `©${global.namebot}`
global.stickauth = `By ubed\nNo Bot: ${global.nomorbot}`
global.week = `${week} ${date}`
global.wibb = `${wktuwib}`
global.nameown1 = 'Ubed' // Optional
global.nameown2 = 'zahra' // Optional
global.thumb = 'https://files.catbox.moe/ts09qh.jpg' // gambar di menu
global.registrasi = 'https://files.catbox.moe/ts09qh.jpg'
global.thumb2 = 'https://files.catbox.moe/ts09qh.jpg' // GAMBAR MENU 2
global.leave = 'https://i.postimg.cc/yxvn10Ls/ssstik-io-1689170610318.jpg' /// Untuk BG leave
global.floc = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": "0@s.whatsapp.net",
        "fromMe": false,
        "id": "Halo",
    },
    "message": {
        "conversation": `*Ubed*`,
    }
};
//Link Social Media Ganti Aja Kalau Ga Punya Biarin Aja
global.myweb = 'https://chat.whatsapp.com/EfPjvlM7WIkBTfE5C2mNG1' //website
global.sig = 'https://www.instagram.com/24.Obey' //instagram
global.sgh = 'https://chat.whatsapp.com/EfPjvlM7WIkBTfE5C2mNG1' //github
global.sgc = 'https://chat.whatsapp.com/EfPjvlM7WIkBTfE5C2mNG1' //group whatsapp
global.backupsc = '' // Masukan id gc untuk file backup sc
global.sdc = '-' //discord
global.yt = '-' 
global.tt = '-'

global.pdana = '-' // Dana
global.povo = '-' // Ovo
global.pgopay = '-' // Gopay

/*============== CREATE PANEL ==============*/
global.domain = 'https://hariz.mypanel.fun' // ISI LINK DOMAIN
global.apikey = 'ptla_NFTkgtqSCCpOJJ09HWnuW1KGWbcqhJ86UiySt7Sr7tD' // ISI APIKEY PTLA
global.capikey = 'ptlc_Ta1n6GU0hNxg4YWiVgdGBLycCR4i6s1akaSf3zFRMKw' // ISI APIKEY PTLC

/// Api keys
global.clayza = '' // https://api.clayzaaubert.my.id
global.MaelynKEY = 'ubed2407' // Daftar Di https://api.maelyn.my.id
global.MaelynKEY2 = 'S7yFknv5Kr' 
global.lol = 'ubed2407'
global.before = 'ubed2407'
global.xyro = '5dRkJDWvIG'
global.lolkey = 'a8e86232771f9bc1826742c1'
global.ubed = 'ubed2407'
global.btc = 'IAXBPHme'
global.skizoweb = 'https://skizoasia.xyz'

global.lumunai = 'https://luminai.my.id'
global.GoogleApi = 'AIzaSyCM_jlBX7v_vuowWLBEypf5bn_BwWVLdmc'; // API Key Google Anda Link: https://developers.google.com/custom-search/v1/overview
global.GoogleCx = 'd31a4791c1c264bfc'; // CX (Custom Search Engine ID) Anda Link Sama kayak global.GoogleApi

global.stalkyt = 'AIzaSyCUZO8fjmLsVuS3RR1iuq9SNKRihdp1YvE'; // Untuk Fitur Stalk YouTube 

global.APIKeys = { // APIKey Here
  // 'https://website': 'apikey'
  //'https://api.lolhuman.xyz': 'GataDios', //lolhuman
  'https://api.ubed.my.id': 'ubed2407', //skizo
  'https://api.betabotz.org': 'p8ADYJib', //betabotz
  'https://api.xyroinee.xyz': '3WIq7q3CWt' //xyroin
}

/// TEXT
global.eror = "🍎 Error......."
global.stiker_wait = '*Memuat sticker 🍏*'
global.yue = '*🍋 Loading...*'
global.wait = '_Processing, Please Wait...._'
global.eror = 'Eror, Mohon Coba Lagi Nanti'
global.mengetik = 50;
global.lopr = '' //LOGO PREMIUM ON MENU.JS
global.lolm = '' //LOGO LIMIT/FREE ON MENU.JS
global.multiplier = 69

/*============== VERSION ==============*/
global.version = '8.5'
global.hwaifu = ['https://i.pinimg.com/originals/ed/34/f8/ed34f88af161e6278993e1598c29a621.jpg']

global.flaaa = [
  'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=water-logo&script=water-logo&fontsize=90&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextColor=%23000&shadowGlowColor=%23000&backgroundColor=%23000&text=',
  'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=crafts-logo&fontsize=90&doScale=true&scaleWidth=800&scaleHeight=500&text=',
  'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=amped-logo&doScale=true&scaleWidth=800&scaleHeight=500&text=',
  'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=sketch-name&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextType=1&fillTextPattern=Warning!&text=',
  'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=sketch-name&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextType=1&fillTextPattern=Warning!&fillColor1Color=%23f2aa4c&fillColor2Color=%23f2aa4c&fillColor3Color=%23f2aa4c&fillColor4Color=%23f2aa4c&fillColor5Color=%23f2aa4c&fillColor6Color=%23f2aa4c&fillColor7Color=%23f2aa4c&fillColor8Color=%23f2aa4c&fillColor9Color=%23f2aa4c&fillColor10Color=%23f2aa4c&fillOutlineColor=%23f2aa4c&fillOutline2Color=%23f2aa4c&backgroundColor=%23101820&text=']

global.schedules = {}

// The higher, The harder levelup
global.rpg = {
  emoticon(string) {
    string = string.toLowerCase()
    let emot = {
      agility: '🤸‍♂️',
      arc: '🏹',
      damage: '💥',
      armor: '🥼',
      bank: '🏦',
      bibitanggur: '🍇',
      bibitapel: '🍎',
      bibitjeruk: '🍊',
      bibitmangga: '🥭',
      bibitpisang: '🍌',
      bow: '🏹',
      bull: '🐃',
      cat: '🐈',
      chicken: '🐓',
      common: '📦',
      cow: '🐄',
      crystal: '🔮',
      darkcrystal: '♠️',
      diamond: '💎',
      dog: '🐕',
      dragon: '🐉',
      elephant: '🐘',
      emerald: '💚',
      exp: '✉️',
      fishingrod: '🎣',
      fox: '🦊',
      gems: '🍀',
      giraffe: '🦒',
      gold: '👑',
      health: '❤️',
      horse: '🐎',
      intelligence: '🧠',
      iron: '⛓️',
      keygold: '🔑',
      keyiron: '🗝️',
      knife: '🔪',
      legendary: '🗃️',
      level: '🧬',
      limit: '🌌',
      lion: '🦁',
      magicwand: '⚕️',
      mana: '🪄',
      eris: '💵',
      mythic: '🗳️',
      pet: '🎁',
      petFood: '🍖',
      pickaxe: '⛏️',
      pointxp: '📧',
      potion: '🥤',
      rock: '🪨',
      snake: '🐍',
      stamina: '⚡',
      strength: '🦹‍♀️',
      string: '🕸️',
      superior: '💼',
      sword: '⚔️',
      tiger: '🐅',
      trash: '🗑',
      uncommon: '🎁',
      upgrader: '🧰',
      wood: '🪵'
    }
    let results = Object.keys(emot).map(v => [v, new RegExp(v, 'gi')]).filter(v => v[1].test(string))
    if (!results.length) return ''
    else return emot[results[0][0]]
  }
}

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})