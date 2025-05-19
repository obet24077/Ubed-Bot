import levelling from '../lib/levelling.js'
import fs from 'fs'
import path from 'path'
import axios from 'axios'
import os from 'os'
import { platform } from 'node:process'
import moment from 'moment-timezone'
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@adiwajshing/baileys'
import { sizeFormatter } from 'human-readable'
import { createCanvas } from 'canvas'

const format = sizeFormatter({
  std: 'JEDEC',
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (literal, symbol) => `${literal} ${symbol}B`
})

const detectSize = size => format(size)

function createTagImage(text) {
  const width = 800, height = 200
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = '#000000'
  ctx.font = '50px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, width / 2, height / 2)
  return canvas.toBuffer()
}

const handler = async (m, { conn, args, usedPrefix, command }) => {
  let inputTag = (args[0] || '').toLowerCase()
  let arrayMenu = [
    'anonymous','main','fun','islami','info','ai','bug','jadibot','atlantic','store',
    'ephoto','ssh','clans','life','search','downloader','textprome','nsfw','convert',
    'premium','music','simulator','game','judi','group','panel','internet','stalking',
    'hengker','owner','rpg','crypto','diffusion','sticker','tools','anime','smm'
  ]
  if (!arrayMenu.includes(inputTag)) inputTag = 'menu'

  let tagLabel = {
    anonymous: 'ANONYMOUS', main: 'MAIN', fun: 'FUN', islami: 'ISLAMI',
    info: 'INFO', ai: 'AI', bug: 'BUG', jadibot: 'JADIBOT', atlantic: 'ATLANTIC',
    store: 'STORE', ephoto: 'EPHOTO', ssh: 'SSH', clans: 'CLANS', life: 'LIFE',
    search: 'SEARCH', downloader: 'DOWNLOADER', textprome: 'TEXTPROME', nsfw: 'NSFW',
    convert: 'CONVERT', premium: 'PREMIUM', music: 'MUSIC', simulator: 'SIMULATOR',
    game: 'GAME', judi: 'JUDI', group: 'GROUP', panel: 'PANEL', internet: 'INTERNET',
    stalking: 'STALKING', hengker: 'HENGKER', owner: 'OWNER', rpg: 'RPG',
    crypto: 'CRYPTO', diffusion: 'DIFFUSION', sticker: 'STICKER', tools: 'TOOLS',
    anime: 'ANIME', smm: 'SMM',
    menu: 'MENU'
  }

  let senderTag = m.sender.split('@')[0]

  if (inputTag === 'menu') {
    let caption = `Hai kak, @${senderTag} ✨
Aku *Prince Ryukaze*, asisten virtual buatan *Queen🪷* Aku siap membantu kakak menjawab pertanyaan, memberikan informasi, dan menemani harimu dengan fitur-fitur seru! 🪷

Ketik *menu* untuk melihat semua yang bisa aku lakukan ya 💝`
    let imageBuffer = (await axios.get('https://files.catbox.moe/sh8a9i.jpg', { responseType: 'arraybuffer' })).data
    await conn.sendMessage(m.key.remoteJid, {
      image: imageBuffer,
      caption: caption,
      footer: "Prince Ryukaze by Queen 🪷",
      buttons: [
        {
          buttonId: 'action',
          buttonText: { displayText: '🪷 Menu Prince Ryukaze 🪷' },
          type: 1,
          nativeFlowInfo: {
            name: 'single_select',
            paramsJson: JSON.stringify({
              title: 'Tap Hare!',
              sections: [
                {
                  title: 'Menu Prince Ryukaze',
                  highlight_label: 'Populer Plugins',
                  rows: [
                    { title: '⌜ 🪷 Download Feature ⌟', description: "Displays menu Download ( List Menu )", id: '.menu downloader' },
                    { title: '⌜ 🪷 Main Feature ⌟', description: "Displays menu Main ( List Menu )", id: '.menu main' },
                    { title: '⌜ 🪷 Info Feature ⌟', description: "Displays menu Info ( List Menu )", id: '.menu info' },
                    { title: '⌜ 🪷 Ai Feature ⌟', description: "Displays menu Ai ( List Menu )", id: '.menu ai' },
                    { title: '⌜ 🪷 Diffusion Feature ⌟', description: "Displays menu Diffusion ( List Menu )", id: '.menu diffusion' },
                    { title: '⌜ 🪷 Convert Feature ⌟', description: "Displays menu Convert ( List Menu )", id: '.menu convert' },
                    { title: '⌜ 🪷 Premium Feature ⌟', description: "Displays menu Premium ( List Menu )", id: '.menu premium' },
                    { title: '⌜ 🪷 Judi Feature ⌟', description: "Displays menu Judi ( List Menu )", id: '.menu judi' },
                    { title: '⌜ 🪷 Bug Feature ⌟', description: "Displays menu Bug ( List Menu )", id: '.menu bug' },
                    { title: '⌜ 🪷 Game Feature ⌟', description: "Displays menu Game ( List Menu )", id: '.menu game' },
                    { title: '⌜ 🪷 Fun Feature ⌟', description: "Displays menu Fun ( List Menu )", id: '.menu fun' },
                    { title: '⌜ 🪷 Music Feature ⌟', description: "Displays menu Music ( List Menu )", id: '.menu music' },
                    { title: '⌜ 🪷 Groups Feature ⌟', description: "Displays menu Groups ( List Menu )", id: '.menu group' },
                    { title: '⌜ 🪷 Atlantic Feature ⌟', description: "Displays menu Atlantic ( List Menu )", id: '.menu atlantic' },
                    { title: '⌜ 🪷 Smm Feature ⌟', description: "Displays menu Smm ( List Menu )", id: '.menu smm' },
                    { title: '⌜ 🪷 Store Feature ⌟', description: "Displays menu Store ( List Menu )", id: '.menu store' },
                    { title: '⌜ 🪷 Panel Feature ⌟', description: "Displays menu Panel ( List Menu )", id: '.menu panel' },
                    { title: '⌜ 🪷 Ssh Feature ⌟', description: "Displays menu Ssh ( List Menu )", id: '.menu ssh' },
                    { title: '⌜ 🪷 Jadibot Feature ⌟', description: "Displays menu Jadibot ( List Menu )", id: '.menu jadibot' },
                    { title: '⌜ 🪷 Internet Feature ⌟', description: "Displays menu Internet ( List Menu )", id: '.menu internet' },
                    { title: '⌜ 🪷 Hengker Feature ⌟', description: "Displays menu Hengker ( List Menu )", id: '.menu hengker' },
                    { title: '⌜ 🪷 Islami Feature ⌟', description: "Displays menu Islami ( List Menu )", id: '.menu islami' },
                    { title: '⌜ 🪷 Ephoto Feature ⌟', description: "Displays menu Ephoto ( List Menu )", id: '.menu ephoto' },
                    { title: '⌜ 🪷 Textprome Feature ⌟', description: "Displays menu Textprome ( List Menu )", id: '.menu textprome' },
                    { title: '⌜ 🪷 Owner Feature ⌟', description: "Displays menu Owner ( List Menu )", id: '.menu owner' },
                    { title: '⌜ 🪷 Rpg Feature ⌟', description: "Displays menu Rpg ( List Menu )", id: '.menu rpg' },
                    { title: '⌜ 🪷 Simulator Feature ⌟', description: "Displays menu Simulator ( List Menu )", id: '.menu simulator' },
                    { title: '⌜ 🪷 Sticker Feature ⌟', description: "Displays menu Sticker ( List Menu )", id: '.menu sticker' },
                    { title: '⌜ 🪷 Anonymous Feature ⌟', description: "Displays menu Anonymous ( List Menu )", id: '.menu anonymous' },
                    { title: '⌜ 🪷 Tools Feature ⌟', description: "Displays menu Tools ( List Menu )", id: '.menu tools' },
                    { title: '⌜ 🪷 Clans Feature ⌟', description: "Displays menu Clans ( List Menu )", id: '.menu clans' },
                    { title: '⌜ 🪷 Crypto Feature ⌟', description: "Displays menu Crypto ( List Menu )", id: '.menu crypto' },
                    { title: '⌜ 🪷 Life Feature ⌟', description: "Displays menu Life ( List Menu )", id: '.menu life' },
                    { title: '⌜ 🪷 Anime Feature ⌟', description: "Displays menu Anime ( List Menu )", id: '.menu anime' },
                    { title: '⌜ 🪷 Ns... ⌟', description: "Displays menu Nsfw ( List Menu )", id: '.menu nsfw' },
                  ]
                }
              ]
            })
          }
        }
      ],
      mentions: [m.sender]
    }, { quoted: m })
  }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['qmq']

export default handler