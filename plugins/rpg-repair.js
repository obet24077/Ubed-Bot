let { MessageType } = (await import('@adiwajshing/baileys')).default

let handler  = async (m, { conn, command, args, usedPrefix, DevMode }) => {
  let type = (args[0] || '').toLowerCase()
  let _type = (args[0] || '').toLowerCase()
  let user = global.db.data.users[m.sender]
  global.db.data.users[m.sender].pickaxe = global.db.data.users[m.sender].pickaxe || 0
  global.db.data.users[m.sender].pedang = global.db.data.users[m.sender].pedang || 0
  global.db.data.users[m.sender].pancingan = global.db.data.users[m.sender].pancingan || 0
  let botol = global.botwm

let lgocraft = `
*「 R E P A I R 」*`

  let caption = `
*「 R E P A I R 」*
━━━━━━━━━━━━
Contoh: .repair swordexcalibur

\`Category\`

* Pickaxe
* Armor
* Sword
* Katana
* Pancingan
━━━━━━━━━━━━
\`Armor\`

* Armor Leather
* Armor Iron
* Armor Gold
* Armor Diamond
* Armor Netherite
* Armor Dragonplate
* Armor Celestial
* Armor Stormbringer
━━━━━━━━━━━━
\`Sword\`

* Sword Wooden
* Sword Iron
* Sword Gold
* Sword Diamond
* Sword Netherite
* Sword Shadowbane
* Sword Stormbringer
* Sword Excalibur
━━━━━━━━━━━━
`
  try {
    if (/repair/i.test(command)) {
      const count = args[1] && args[1].length > 0 ? Math.min(99999999, Math.max(parseInt(args[1]), 1)) : !args[1] || args.length < 3 ? 1 : Math.min(1, count)
        switch (type) {
          case 'pickaxe':
          if (user.pickaxedurability > 99) return m.reply('Pickaxe Kamu Belum Memiliki Kerusakan')
          if (user.pickaxe == 0) return m.reply('Kamu Belum Memilik Pickaxe')
            if(user.diamond < 1 || user.rock < 3 || user.wood < 5 || user.iron < 3 ) return m.reply(`Bahan Untuk Repair Tiidak Cukup!\nDiamond 1\nRock 3\nWood 5`)
             user.rock -= 3
             user.wood -= 5
             user.iron -= 3
             user.diamond -= 1
             user.pickaxedurability = 100
            m.reply("Sukses Memperbaiki Pickaxe")
            break
          case 'pancingan':
          if (user.pancingandurability > 250) return m.reply('Pancingan Kamu Belum Memiliki Kerusakan')
          if (user.pancingan == 0) return m.reply('Kamu Belum Memilik Pancingan')
            if(user.iron < 5 || user.wood < 15 ) return m.reply(`Bahan Untuk Repair Tiidak Cukup!\nIron 5\nWood 15`)
             user.iron -= 5
             user.wood -= 15
             user.pancingandurability = 250
            m.reply("Sukses Memperbaiki Pancingan")
            break
          case 'katana':
          if (user.katanadurability > 250) return m.reply('Katana Kamu Belum Memiliki Kerusakan')
          if (user.katana == 0) return m.reply('Kamu Belum Memilik Katana')
            if(user.diamond < 1 || user.wood < 5 || user.iron < 3 ) return m.reply(`Bahan Untuk Repair Tiidak Cukup!\nDiamond 1\nWood 5\nIron 3`)
             user.iron -= 3
             user.wood -= 5
             user.diamond -= 1
             user.katanadurability = 250
            m.reply("Sukses Memperbaiki Katana")
            break
          case 'swordwooden':
          if (user.sworddurability > 50) return m.reply('Sword Kamu Belum Memiliki Kerusakan')
          if (user.sword == 0) return m.reply('Kamu Belum Memilik Sword')
          if (user.sword > 1) return m.reply('Level Sword Kamu Bukan Wooden Sword')
            if(user.wood < 5 || user.iron < 2 ) return m.reply(`Bahan Untuk Repair Tidak Cukup!\nWood 5\nIron 2`)
             user.wood -= 5
             user.iron -= 2
             //user.diamond -= 1
             user.sworddurability = 50
            m.reply("Sukses Memperbaiki Wooden Sword")
            break
            case 'swordiron':
          if (user.sworddurability > 100) return m.reply('Sword Kamu Belum Memiliki Kerusakan')
          if (user.sword == 0) return m.reply('Kamu Belum Memilik Sword')
          if (user.sword > 2) return m.reply('Level Sword Kamu Bukan Iron Sword')
            if(user.wood < 11 || user.iron < 5 ) return m.reply(`Bahan Untuk Repair Tidak Cukup!\nWood 11\nIron 5`)
             user.wood -= 11
             user.iron -= 5
             //user.diamond -= 1
             user.sworddurability = 100
            m.reply("Sukses Memperbaiki Iron Sword")
            break
            case 'swordgold':
          if (user.sworddurability > 150) return m.reply('Sword Kamu Belum Memiliki Kerusakan')
          if (user.sword == 0) return m.reply('Kamu Belum Memilik Sword')
          if (user.sword > 3) return m.reply('Level Sword Kamu Bukan Gold Sword')
            if(user.wood < 22 || user.string < 19 || user.gold < 8 ) return m.reply(`Bahan Untuk Repair Tidak Cukup!\nWood 22\nString 19\nGold 8`)
             user.wood -= 22
             user.string -= 19
             user.gold -= 8
             user.sworddurability = 150
            m.reply("Sukses Memperbaiki Gold Sword")
            break
            case 'sworddiamond':
          if (user.sworddurability > 200) return m.reply('Sword Kamu Belum Memiliki Kerusakan')
          if (user.sword == 0) return m.reply('Kamu Belum Memilik Sword')
          if (user.sword > 4) return m.reply('Level Sword Kamu Bukan Diamond Sword')
            if(user.wood < 40 || user.iron < 20 || user.diamond < 10 ) return m.reply(`Bahan Untuk Repair Tidak Cukup!\nWood 40\nIron 20\nDiamond 10`)
             user.wood -= 40
             user.iron -= 20
             user.diamond -= 10
             user.sworddurability = 200
            m.reply("Sukses Memperbaiki Diamond Sword")
            break
            case 'swordnetherite':
          if (user.sworddurability > 250) return m.reply('Sword Kamu Belum Memiliki Kerusakan')
          if (user.sword == 0) return m.reply('Kamu Belum Memilik Sword')
          if (user.sword > 5) return m.reply('Level Sword Kamu Bukan Netherite Sword')
            if(user.wood < 80 || user.iron < 40 || user.diamond < 25 ) return m.reply(`Bahan Untuk Repair Tidak Cukup!\nWood 80\nIron 40\nDiamond 25`)
             user.wood -= 80
             user.iron -= 40
             user.diamond -= 25
             user.sworddurability = 250
            m.reply("Sukses Memperbaiki Netherite Sword")
            break
            case 'swordshadowbane':
          if (user.sworddurability > 400) return m.reply('Sword Kamu Belum Memiliki Kerusakan')
          if (user.sword == 0) return m.reply('Kamu Belum Memilik Sword')
          if (user.sword > 6) return m.reply('Level Sword Kamu Bukan Shadowbane')
            if(user.wood < 140 || user.iron < 80 || user.diamond < 50 ) return m.reply(`Bahan Untuk Repair Tidak Cukup!\nWood 140\nIron 80\nDiamond 50`)
             user.wood -= 140
             user.iron -= 80
             user.diamond -= 50
             user.sworddurability = 400
            m.reply("Sukses Memperbaiki Sword Shadowbane")
            break
case 'swordstormbringer':
          if (user.sworddurability > 550) return m.reply('Sword Kamu Belum Memiliki Kerusakan')
          if (user.sword == 0) return m.reply('Kamu Belum Memilik Sword')
          if (user.sword > 7) return m.reply('Level Sword Kamu Bukan Stormbringer')
            if(user.wood < 150 || user.iron < 150 || user.diamond < 50 ) return m.reply(`Bahan Untuk Repair Tidak Cukup!\nWood 150\nIron 150\nDiamond 50`)
             user.wood -= 150
             user.iron -= 150
             user.diamond -= 50
             user.sworddurability = 550
            m.reply("Sukses Memperbaiki Sword Stormbringer")
            break
case 'swordexcalibur':
          if (user.sworddurability > 750) return m.reply('Sword Kamu Belum Memiliki Kerusakan')
          if (user.sword == 0) return m.reply('Kamu Belum Memilik Sword')
          if (user.sword > 8) return m.reply('Level Sword Kamu Bukan Excalibur')
            if(user.wood < 300 || user.iron < 150 || user.diamond < 100 ) return m.reply(`Bahan Untuk Repair Tidak Cukup!\nWood 300\nIron 150\nDiamond 100`)
             user.wood -= 300
             user.iron -= 150
             user.diamond -= 100
             user.sworddurability = 750
            m.reply("Sukses Memperbaiki Sword Excalibur")
            break
            case 'armorleather':
          if (user.armordurability > 50) return m.reply('Armor Kamu Belum Memiliki Kerusakan')
          if (user.armor == 0) return m.reply('Kamu Belum Memilik Armor')
          if (user.armor > 1) return m.reply('Level Armor Kamu Bukan Leather Armor')
            if(user.iron < 5 || user.string < 5 ) return m.reply(`Bahan Untuk Repair Tidak Cukup!\nIron 5\nString 5`)
             //user.wood -= 80
             user.iron -= 5
             user.string -= 5
             user.armordurability = 50
            m.reply("Sukses Memperbaiki Leather Armor")
            break
case 'armoriron':
          if (user.armordurability > 100) return m.reply('Armor Kamu Belum Memiliki Kerusakan')
          if (user.armor == 0) return m.reply('Kamu Belum Memilik Armor')
          if (user.armor > 2) return m.reply('Level Armor Kamu Bukan Iron Armor')
            if(user.iron < 9 || user.string < 9 ) return m.reply(`Bahan Untuk Repair Tidak Cukup!\nIron 9\nString 9`)
             //user.wood -= 80
             user.iron -= 9
             user.string -= 9
             user.armordurability = 100
            m.reply("Sukses Memperbaiki Iron Armor")
            break
case 'armorgold':
          if (user.armordurability > 150) return m.reply('Armor Kamu Belum Memiliki Kerusakan')
          if (user.armor == 0) return m.reply('Kamu Belum Memilik Armor')
          if (user.armor > 3) return m.reply('Level Armor Kamu Bukan Gold Armor')
            if(user.gold < 8 || user.iron < 19 || user.string < 19 ) return m.reply(`Bahan Untuk Repair Tidak Cukup!\nGold 8\nIron 19\nString 19`)
             user.emas -= 8
             user.iron -= 19
             user.string -= 19
             user.armordurability = 150
            m.reply("Sukses Memperbaiki Gold Armor")
            break
case 'armordiamond':
          if (user.armordurability > 200) return m.reply('Armor Kamu Belum Memiliki Kerusakan')
          if (user.armor == 0) return m.reply('Kamu Belum Memilik Armor')
          if (user.armor > 4) return m.reply('Level Armor Kamu Bukan Diamond Armor')
            if(user.diamond < 15 || user.iron < 35 || user.string < 35 ) return m.reply(`Bahan Untuk Repair Tidak Cukup!\nDiamond 15\nIron 35\nString 35`)
             user.diamond -= 15
             user.iron -= 35
             user.string -= 35
             user.armordurability = 200
            m.reply("Sukses Memperbaiki Diamond Armor")
            break
case 'armornetherite':
          if (user.armordurability > 250) return m.reply('Armor Kamu Belum Memiliki Kerusakan')
          if (user.armor == 0) return m.reply('Kamu Belum Memilik Armor')
          if (user.armor > 5) return m.reply('Level Armor Kamu Bukan Netherite Armor')
            if(user.diamond < 35 || user.iron < 80 || user.string < 80 ) return m.reply(`Bahan Untuk Repair Tidak Cukup!\nDiamond 35\nIron 80\nString 80`)
             user.diamond -= 35
             user.iron -= 80
             user.string -= 80
             user.armordurability = 250
            m.reply("Sukses Memperbaiki Netherite Armor")
            break
case 'armordragonplate':
          if (user.armordurability > 400) return m.reply('Armor Kamu Belum Memiliki Kerusakan')
          if (user.armor == 0) return m.reply('Kamu Belum Memilik Armor')
          if (user.armor > 6) return m.reply('Level Armor Kamu Bukan Dragonplate')
            if(user.diamond < 70 || user.iron < 160 || user.string < 160 ) return m.reply(`Bahan Untuk Repair Tidak Cukup!\nDiamond 70\nIron 160\nString 160`)
             user.diamond -= 70
             user.iron -= 160
             user.string -= 160
             user.armordurability = 400
            m.reply("Sukses Memperbaiki Armor Dragonplate")
            break
case 'armorcelestial':
          if (user.armordurability > 550) return m.reply('Armor Kamu Belum Memiliki Kerusakan')
          if (user.armor == 0) return m.reply('Kamu Belum Memilik Armor')
          if (user.armor > 7) return m.reply('Level Armor Kamu Bukan Celestial')
            if(user.diamond < 114 || user.iron < 330 || user.string < 330 ) return m.reply(`Bahan Untuk Repair Tidak Cukup!\nDiamond 114\nIron 330\nString 330`)
             user.diamond -= 114
             user.iron -= 330
             user.string -= 330
             user.armordurability = 550
            m.reply("Sukses Memperbaiki Armor Celestial")
            break
case 'armorstormbringer':
          if (user.armordurability > 750) return m.reply('Armor Kamu Belum Memiliki Kerusakan')
          if (user.armor == 0) return m.reply('Kamu Belum Memilik Armor')
          if (user.armor > 8) return m.reply('Level Armor Kamu Bukan Stormbringer')
            if(user.diamond < 114 || user.iron < 430 || user.string < 430 ) return m.reply(`Bahan Untuk Repair Tidak Cukup!\nDiamond 114\nIron 430\nString 430`)
             user.diamond -= 114
             user.iron -= 430
             user.string -= 430
             user.armordurability = 750
            m.reply("Sukses Memperbaiki Armor Stormbringer")
            break
          default:
            return await conn.reply(m.chat, caption, m)
        }
    } else if (/enchant|enchan/i.test(command)) {
      const count = args[2] && args[2].length > 0 ? Math.min(99999999, Math.max(parseInt(args[2]), 1)) : !args[2] || args.length < 4 ? 1 :Math.min(1, count)
      switch (_type) {
        case 't':
          break
        case '':
          break

        default:
          return conn.reply(m.chat, caption, m)
      }
    }
  } catch (err) {
    m.reply("Error\n\n\n" + err.stack)
  }
}

handler.help = ['repair']
handler.tags = ['rpg']
handler.command = /^(repair)/i
handler.register = true

export default handler