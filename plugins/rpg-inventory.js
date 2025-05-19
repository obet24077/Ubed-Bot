let handler = async (m, { conn, usedPrefix }) => {
let mentionedJid = [m.sender]
let health = global.db.data.users[m.sender].health.toLocaleString()
    let balance = global.db.data.users[m.sender].balance.toLocaleString()
    let armor = global.db.data.users[m.sender].armor.toLocaleString()
    let viewers = global.db.data.users[m.sender].viewers.toLocaleString()
    let like = global.db.data.users[m.sender].like.toLocaleString()
    let subscribers = global.db.data.users[m.sender].subscribers.toLocaleString()
    let tiketcn = global.db.data.users[m.sender].tiketcn.toLocaleString()
    let pistol = global.db.data.users[m.sender].pistol
    let peluru = global.db.data.users[m.sender].peluru.toLocaleString()
    let armordurability = global.db.data.users[m.sender].armordurability.toLocaleString()
    let sworddurability = global.db.data.users[m.sender].sworddurability.toLocaleString()
    let katanadurability = global.db.data.users[m.sender].katanadurability.toLocaleString()
    let katana = global.db.data.users[m.sender].katana
    let pet = global.db.data.users[m.sender].pet.toLocaleString()
    let kucing = global.db.data.users[m.sender].kucing
    let _kucing = global.db.data.users[m.sender].anakkucing
    let title2 = global.db.data.users[m.sender].title2
    let rubah = global.db.data.users[m.sender].rubah
    let shield = global.db.data.users[m.sender].shield
    let shieldDurability = global.db.data.users[m.sender].shieldDurability
    let _rubah = global.db.data.users[m.sender].anakrubah
    let serigala = global.db.data.users[m.sender].serigala
    let _serigala = global.db.data.users[m.sender].anakserigala
    let naga = global.db.data.users[m.sender].naga
    let _naga = global.db.data.users[m.sender].anaknaga
    let anjing = global.db.data.users[m.sender].anjing
    let _anjing = global.db.data.users[m.sender].anakanjing
    let kuda = global.db.data.users[m.sender].kuda
    let _kuda = global.db.data.users[m.sender].anakkuda
    let phonix = global.db.data.users[m.sender].phonix
    let _phonix = global.db.data.users[m.sender].anakphonix
    let griffin = global.db.data.users[m.sender].griffin
    let _griffin = global.db.data.users[m.sender].anakgriffin
    let kyubi = global.db.data.users[m.sender].kyubi
    let _kyubi = global.db.data.users[m.sender].anakkyubi
    let centaur = global.db.data.users[m.sender].centaur
    let _centaur = global.db.data.users[m.sender].anakcentaur
    let warn = global.db.data.users[m.sender].warn.toLocaleString()
    let diamond = global.db.data.users[m.sender].diamond.toLocaleString()
    let trash = global.db.data.users[m.sender].trash.toLocaleString()
    let ayambakar = global.db.data.users[m.sender].ayambakar.toLocaleString()
    let lelebakar = global.db.data.users[m.sender].lelebakar.toLocaleString()
    let aqua = global.db.data.users[m.sender].aqua.toLocaleString()
    let ayamgoreng = global.db.data.users[m.sender].ayamgoreng.toLocaleString()
    let rendang = global.db.data.users[m.sender].rendang.toLocaleString()
    let steak = global.db.data.users[m.sender].steak.toLocaleString()
    let babipanggang = global.db.data.users[m.sender].babipanggang.toLocaleString()
    let gulaiayam = global.db.data.users[m.sender].gulaiayam.toLocaleString()
    let oporayam = global.db.data.users[m.sender].oporayam.toLocaleString()
    let vodka = global.db.data.users[m.sender].vodka.toLocaleString()
    let sushi = global.db.data.users[m.sender].sushi.toLocaleString()
    let bandage = global.db.data.users[m.sender].bandage.toLocaleString()
    let ganja = global.db.data.users[m.sender].ganja.toLocaleString()
    let soda = global.db.data.users[m.sender].soda.toLocaleString()
    let roti = global.db.data.users[m.sender].roti.toLocaleString()
    let ikanbakar = global.db.data.users[m.sender].ikanbakar.toLocaleString()
    let nilabakar = global.db.data.users[m.sender].nilabakar.toLocaleString()
    let bawalbakar = global.db.data.users[m.sender].bawalbakar.toLocaleString()
    let udangbakar = global.db.data.users[m.sender].udangbakar.toLocaleString()
    let pausbakar = global.db.data.users[m.sender].pausbakar.toLocaleString()
    let kepitingbakar = global.db.data.users[m.sender].kepitingbakar.toLocaleString()
    let wood = global.db.data.users[m.sender].wood.toLocaleString()
    let coal = global.db.data.users[m.sender].coal.toLocaleString()
    let rock = global.db.data.users[m.sender].rock.toLocaleString()
    let emerald = global.db.data.users[m.sender].emerald.toLocaleString()
    let gold = global.db.data.users[m.sender].gold.toLocaleString()
    let potion = global.db.data.users[m.sender].potion.toLocaleString()
    let common = global.db.data.users[m.sender].common.toLocaleString()
    let uncommon = global.db.data.users[m.sender].uncommon.toLocaleString()
    let mythic = global.db.data.users[m.sender].mythic.toLocaleString()
    let petfood = global.db.data.users[m.sender].petfood.toLocaleString()
    let legendary = global.db.data.users[m.sender].legendary.toLocaleString()
    let gardenboxs = global.db.data.users[m.sender].gardenboxs.toLocaleString()
    let superior = global.db.data.users[m.sender].superior.toLocaleString()
    let cupon = global.db.data.users[m.sender].cupon.toLocaleString()
    let stamina = global.db.data.users[m.sender].stamina.toLocaleString()
    let level = global.db.data.users[m.sender].level.toLocaleString()
    let eris = global.db.data.users[m.sender].eris.toLocaleString()
    let exp = global.db.data.users[m.sender].exp.toLocaleString()
    let nabung = global.db.data.users[m.sender].nabung
    let bank = global.db.data.users[m.sender].bank.toLocaleString()
    let limit = global.db.data.users[m.sender].limit.toLocaleString()
    let iron = global.db.data.users[m.sender].iron.toLocaleString()
    let sword = global.db.data.users[m.sender].sword.toLocaleString()
    let string = global.db.data.users[m.sender].string.toLocaleString()
    let umpan = global.db.data.users[m.sender].umpan.toLocaleString()
    let apel = global.db.data.users[m.sender].apel.toLocaleString()
    let jeruk = global.db.data.users[m.sender].jeruk.toLocaleString()
    let anggur = global.db.data.users[m.sender].anggur.toLocaleString()
    let mangga = global.db.data.users[m.sender].mangga.toLocaleString()
    let pisang = global.db.data.users[m.sender].pisang.toLocaleString()
    let banteng = global.db.data.users[m.sender].banteng.toLocaleString()
    let harimau = global.db.data.users[m.sender].harimau.toLocaleString()
    let gajah = global.db.data.users[m.sender].gajah.toLocaleString()
    let kambing = global.db.data.users[m.sender].kambing.toLocaleString()
    let panda = global.db.data.users[m.sender].panda.toLocaleString()
    let buaya = global.db.data.users[m.sender].buaya.toLocaleString()
    let kerbau = global.db.data.users[m.sender].kerbau.toLocaleString()
    let sapi = global.db.data.users[m.sender].sapi.toLocaleString()
    let monyet = global.db.data.users[m.sender].monyet.toLocaleString()
    let babihutan = global.db.data.users[m.sender].babihutan.toLocaleString()
    let babi = global.db.data.users[m.sender].babi.toLocaleString()
    let ayam = global.db.data.users[m.sender].ayam.toLocaleString()
    let bibitapel = global.db.data.users[m.sender].bibitapel.toLocaleString()
    let bibitjeruk = global.db.data.users[m.sender].bibitjeruk.toLocaleString()
    let bibitpisang = global.db.data.users[m.sender].bibitpisang.toLocaleString()
    let bibitanggur = global.db.data.users[m.sender].bibitanggur.toLocaleString()
    let bibitmangga = global.db.data.users[m.sender].bibitmangga.toLocaleString()
    let hiu = global.db.data.users[m.sender].hiu.toLocaleString()
    let paus = global.db.data.users[m.sender].paus.toLocaleString()
    let orca = global.db.data.users[m.sender].orca.toLocaleString()
    let dory = global.db.data.users[m.sender].dory.toLocaleString()
    let lumba = global.db.data.users[m.sender].lumba.toLocaleString()
    let fruits = global.db.data.users[m.sender].fruits.toLocaleString()
    let buntal = global.db.data.users[m.sender].buntal.toLocaleString()
    let gurita = global.db.data.users[m.sender].gurita.toLocaleString()
    let cumi = global.db.data.users[m.sender].cumi.toLocaleString()
    let udang = global.db.data.users[m.sender].udang.toLocaleString()
    let lobster = global.db.data.users[m.sender].lobster.toLocaleString()
    let kepiting = global.db.data.users[m.sender].kepiting.toLocaleString()
    let tiketcoin = global.db.data.users[m.sender].tiketcoin.toLocaleString()
    let tiketm = global.db.data.users[m.sender].healtmonster.toLocaleString()
    let hero = global.db.data.users[m.sender].hero
    let exphero = global.db.data.users[m.sender].exphero.toLocaleString()
    let botol = global.db.data.users[m.sender].botol.toLocaleString()
    let aerozine = global.db.data.users[m.sender].aerozine.toLocaleString()
    let kaleng = global.db.data.users[m.sender].kaleng.toLocaleString()
    let kardus = global.db.data.users[m.sender].kardus.toLocaleString()
    let gelas = global.db.data.users[m.sender].gelas.toLocaleString()
    let plastik = global.db.data.users[m.sender].plastik.toLocaleString()
    let ramuan = global.db.data.users[m.sender].ramuan.toLocaleString()
    let pancingan = global.db.data.users[m.sender].pancingan
    let role = global.db.data.users[m.sender].role
    let skill = global.db.data.users[m.sender].skill
    let damage = global.db.data.users[m.sender].damage.toLocaleString()
    let attack = global.db.data.users[m.sender].attack.toLocaleString()
    let pickaxe = global.db.data.users[m.sender].pickaxe
    let pickaxedurability = global.db.data.users[m.sender].pickaxedurability.toLocaleString()
    let pancingandurability = global.db.data.users[m.sender].pancingandurability.toLocaleString()
    let herbal = global.db.data.users[m.sender].herbs.toLocaleString()
    let crystal = global.db.data.users[m.sender].crystal.toLocaleString()
    let feathers = global.db.data.users[m.sender].feathers.toLocaleString()
    let jamur = global.db.data.users[m.sender].mushrooms.toLocaleString()
    let who = m.sender
    let pp = await conn.profilePictureUrl(who, 'image').catch(_ => './src/avatar_contact.png')
    let name = m.sender
    let sortederis = Object.entries(global.db.data.users).sort((a, b) => b[1].eris - a[1].eris)
    let sortedgardenboxs = Object.entries(global.db.data.users).sort((a, b) => b[1].gardenboxs - a[1].gardenboxs) 
    let sortedlevel = Object.entries(global.db.data.users).sort((a, b) => b[1].level - a[1].level)
    let sorteddiamond = Object.entries(global.db.data.users).sort((a, b) => b[1].diamond - a[1].diamond)
    let sortedpotion = Object.entries(global.db.data.users).sort((a, b) => b[1].potion - a[1].potion)
    let sortedtrash = Object.entries(global.db.data.users).sort((a, b) => b[1].trash - a[1].trash)
    let sortedcommon = Object.entries(global.db.data.users).sort((a, b) => b[1].common - a[1].common)
    let sorteduncommon = Object.entries(global.db.data.users).sort((a, b) => b[1].uncommon - a[1].uncommon)
    let sortedmythic = Object.entries(global.db.data.users).sort((a, b) => b[1].mythic - a[1].mythic)
    let sortedlegendary = Object.entries(global.db.data.users).sort((a, b) => b[1].legendary - a[1].legendary)
    let userseris = sortederis.map(v => v[0])
    let str = 
    conn.sendMessage(m.chat, {
text: `*[ _I n v e n t o r y_ ]*

👒 *\`Character Stats\`*
👤 User:    @${m.sender.replace(/@.+/, '')}
❤ Health:    ${health} | ${armor == 0 ? '500' : '' || armor == 1 ? '550' : '' || armor == 2 ? '600' : '' || armor == 3 ? '650' : '' || armor == 4 ? '700' : '' || armor == 5 ? '750' : '' || armor == 6 ? '900' : '' || armor == 7 ? '1200' : '' || armor == 8 ? '1500' : ''}
🌀 Stamina:    ${stamina} | 250
🧪 Potion:    ${potion}
🧪 Ramuan:    ${ramuan}
🌿 Herbal:    ${herbal}

---

🛠 *\`Equipment & Weapon\`*
🧥 Armor:    ${armor == 0 ? 'Tidak Punya' : '' || armor == 1 ? 'Leather Armor' : '' || armor == 2 ? 'Iron Armor' : '' || armor == 3 ? 'Gold Armor' : '' || armor == 4 ? 'Diamond Armor' : '' || armor == 5 ? 'Netherite Armor' : '' || armor == 6 ? 'Dragonplate' : '' || armor == 7 ? 'Celestial' : '' || armor == 8 ? 'Stormbringer' : ''}
\r\r\r╰╼ Durability:    ${armordurability} | ${armor == 0 ? '0' : '' || armor == 1 ? '50' : '' || armor == 2 ? '100' : '' || armor == 3 ? '150' : '' || armor == 4 ? '200' : '' || armor == 5 ? '250' : '' || armor == 6 ? '400' : '' || armor == 7 ? '550' : '' || armor == 8 ? '750' : ''}
⚔️ Sword:    ${sword == 0 ? 'Tidak Punya' : '' || sword == 1 ? 'Wooden Sword' : '' || sword == 2 ? 'Iron Sword' : '' || sword == 3 ? 'Gold Sword' : '' || sword == 4 ? 'Diamond Sword' : '' || sword == 5 ? 'Netherite Sword' : '' || sword == 6 ? 'Shadowbane' : '' || sword == 7 ? 'Stormbringer' : '' || sword == 8 ? 'Excalibur' : ''}
\r\r\r╰╼ Durability:    ${sworddurability} | ${sword == 0 ? '0' : '' || sword == 1 ? '50' : '' || sword == 2 ? '100' : '' || sword == 3 ? '150' : '' || sword == 4 ? '200' : '' || sword == 5 ? '250' : '' || sword == 6 ? '400' : '' || sword == 7 ? '550' : '' || sword == 8 ? '750' : ''}
🗡️ Katana:    ${katana == 0 ? 'Tidak Punya' : '' || katana == 1 ? 'Fubuki' : '' || katana == 2 ? 'Koyuki' : '' || katana == 3 ? 'Mizore' : '' || katana == 4 ? 'Shigure' : '' || katana == 5 ? 'Yukikaze' : ''}
\r\r\r╰╼ Durability:    ${katanadurability} | ${katana == 0 ? '0' : '' || katana == 1 ? '50' : '' || katana == 2 ? '100' : '' || katana == 3 ? '150' : '' || katana == 4 ? '200' : '' || katana == 5 ? '250' : ''}

---

🪚 *\`Tools\`*
🔫 Pistol:    ${pistol ? 'Use ✅' : 'Tidak Punya'}
\r\r\r╰╼ Peluru:    ${peluru}
⛏️ Pickaxe:    ${pickaxe ? 'Use ✅' : 'Tidak Punya'}
🎣 Pancingan:    ${pancingan ? 'Use ✅' : 'Tidak Punya'}
\r\r\r├╼ Umpan:    ${umpan}
\r\r\r╰╼ Durability:    ${pancingandurability} | 250
🛡 Shield:    ${shield ? 'Aktif' : 'Tidak Punya'}
\r\r\r╰╼ Tersisa:    ${shieldDurability}

---

🏛 *\`Financially Stats\`*
💰 Money:    Rp.${eris}
🪙 Balance:    Bc.${balance}
🔖 Limit:    ${limit}

---
‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎
📈 *\`Your Ranking\`*
🎖️ Role:    ${role}
🏷️ Title:    ${title2 || 'Noob'}
📊 Level:    ${level}
🎗️ Skill:    ${skill}
🧪 Exp:    ${exp}
💥 Attack:    ${attack}
\r\r\r╰╼ Damage:    ${damage}

---

📪 *\`Treasure Inventory\`*
📦 Common:    ${common}
📦 Uncommon:    ${uncommon}
👑 Mythic:    ${mythic}
💎 Legendary:    ${legendary}
💍 Gardenboxs:    ${gardenboxs}
🏷 Superior:    ${superior}
🐶 Pet:    ${pet}
🏷 Cupon:    ${cupon}
⛽ Aerozine:    ${aerozine}

---

⛏️ *\`Mining Inventory\`*
💎 Diamond:    ${diamond}
🪙 Gold:    ${gold}
💚 Emerald:    ${emerald}
🗑️ Trash:    ${trash}
🪵 Wood:    ${wood}
⚙️ Iron:    ${iron}
🪨 Rock:    ${rock}
🧶 String:    ${string}
⚫ Coal:    ${coal}
🧊 Kristal   : ${crystal}

---

🥣 *\`Pet Food\`*
🦴 Petfood:    ${petfood}

---

♻️ *\`Waste Storage\`*
🍼 Botol:    ${botol}
🍾 Kaleng:    ${kaleng}
📦 Kardus:    ${kardus}
🍶 Gelas:    ${gelas}
🥡 Plastik:    ${plastik}

---

🍽 *\`Food & Drink\`*
🥤 Aqua:    ${aqua}
🍗 Ayam Bakar:    ${ayambakar}
🍢 Lele Bakar:    ${lelebakar}
🥩 Steak:    ${steak}
🍣 Sushi:    ${sushi}
🐟 Ikan Bakar:    ${ikanbakar}
🍄 Jamur:    ${jamur}
🪶 Feathers:    ${feathers}
🍯 Madu:    ${fruits}

---

🧩 *\`Fruit Inventory\`*
🍎 Apel:    ${apel}
🍊 Jeruk:    ${jeruk}
🍌 Pisang:    ${pisang}
🍇 Anggur:    ${anggur}
🥭 Mangga:    ${mangga}

---

🍥 *\`Seed Inventory\`*
🌾 Bibit Apel:    ${bibitapel}
🌾 Bibit Jeruk:    ${bibitjeruk}
🌾 Bibit Pisang:    ${bibitpisang}
🌾 Bibit Anggur:    ${bibitanggur}
🌾 Bibit Mangga:    ${bibitmangga}

---

🐸 *\`Animal Inventory\`*
🐂 Banteng:    ${banteng}
🐅 Harimau:    ${harimau}
🐘 Gajah:    ${gajah}
🐐 Kambing:    ${kambing}
🐼 Panda:    ${panda}
🐊 Buaya:    ${buaya}
🐃 Kerbau:    ${kerbau}
🐄 Sapi:    ${sapi}
🐒 Monyet:    ${monyet}
🐖 Babi Hutan:    ${babihutan}
🐖 Babi:    ${babi}
🐓 Ayam:    ${ayam}

---

🐚 *\`Fish Inventory\`*
🦈 Hiu:    ${hiu}
🐋 Paus:    ${paus}
🐳 Orca:    ${orca}
🐬 Dory:    ${dory}
🐬 Lumba:    ${lumba}
🐡 Buntal:    ${buntal}
🐙 Gurita:    ${gurita}
🐙 Cumi:    ${cumi}
🦐 Udang:    ${udang}
🦞 Lobster:    ${lobster}
🦀 Kepiting:    ${kepiting}

--- 

👑 *\`Hero Inventory\`*
🤺 My Hero:    *${hero == 0 ? 'Tidak Punya' : '' || hero == 1 ? 'Level 1' : '' || hero == 2 ? 'Level 2' : '' || hero == 3 ? 'Level 3' : '' || hero == 4 ? 'Level 4' : '' || hero == 5 ? 'Level 5' : '' || hero == 6 ? 'Level 6' : '' || hero == 7 ? 'Level 7' : '' || hero == 8 ? 'Level 8' : '' || hero == 9 ? 'Level 9' : '' || hero == 10 ? 'Level 10' : '' || hero == 11 ? 'Level 11' : '' || hero == 12 ? 'Level 12' : '' || hero == 13 ? 'Level 13' : '' || hero == 14 ? 'Level 14' : '' || hero == 15 ? 'Level 15' : '' || hero == 16 ? 'Level 16' : '' || hero == 17 ? 'Level 17' : '' || hero == 18 ? 'Level 18' : '' || hero == 19 ? 'Level 19' : '' || hero == 20 ? 'Level 20' : '' || hero == 21 ? 'Level 21' : '' || hero == 22 ? 'Level 22' : '' || hero == 23 ? 'Level 23' : '' || hero == 24 ? 'Level 24' : '' || hero == 25 ? 'Level 25' : '' || hero == 26 ? 'Level 26' : '' || hero == 27 ? 'Level 27' : '' || hero == 28 ? 'Level 28' : '' || hero == 29 ? 'Level 29' : '' || hero == 30 ? 'Level 30' : '' || hero == 31 ? 'Level 31' : '' || hero == 32 ? 'Level 32' : '' || hero == 33 ? 'Level 33' : '' || hero == 34 ? 'Level 34' : '' || hero == 35 ? 'Level 35' : '' || hero == 36 ? 'Level 36' : '' || hero == 37 ? 'Level 37'  : '' || hero == 38 ? 'Level 38' : '' || hero == 39 ? 'Level 39' : '' || hero == 40 ? 'Level MAX' : ''}*

🪶 *\`Pet Inventory\`*
🐱 Kucing:    *${kucing == 0 ? 'Tidak Punya' : '' || kucing == 1 ? 'Level 1' : '' || kucing == 2 ? 'Level 2' : '' || kucing == 3 ? 'Level 3' : '' || kucing == 4 ? 'Level 4' : '' || kucing == 5 ? 'Level 5' : '' || kucing == 6 ? 'Level 6' : '' || kucing == 7 ? 'Level 7' : '' || kucing == 8 ? 'Level 8' : '' || kucing == 9 ? 'Level 9' : '' || kucing == 10 ? 'Level 10' : '' || kucing == 11 ? 'Level 11' : '' || kucing == 12 ? 'Level 12' : '' || kucing == 13 ? 'Level 13' : '' || kucing == 14 ? 'Level 14' : '' || kucing == 15 ? 'Level MAX' : ''}*
\r\r\r╰╼ Exp: ${kucing === 0 
    ? 'Tidak Punya' 
    : kucing === 15 
        ? '*Max Level*' 
        : `${_kucing} ••> ${kucing * 100}`}
🐴 Kuda:    *${kuda == 0 ? 'Tidak Punya' : '' || kuda == 1 ? 'Level 1' : '' || kuda == 2 ? 'Level 2' : '' || kuda == 3 ? 'Level 3' : '' || kuda == 4 ? 'Level 4' : '' || kuda == 5 ? 'Level 5' : '' || kuda == 6 ? 'Level 6' : '' || kuda == 7 ? 'Level 7' : '' || kuda == 8 ? 'Level 8' : '' || kuda == 9 ? 'Level 9' : '' || kuda == 10 ? 'Level 10' : '' || kuda == 11 ? 'Level 11' : '' || kuda == 12 ? 'Level 12' : '' || kuda == 13 ? 'Level 13' : '' || kuda == 14 ? 'Level 14' : '' || kuda == 15 ? 'Level MAX' : ''}*
\r\r\r╰╼ Exp: ${kuda === 0 
    ? 'Tidak Punya' 
    : kuda === 15 
        ? '*Max Level*' 
        : `${_kuda} ••> ${kuda * 100}`}
🐉 Naga:    *${naga == 0 ? 'Tidak Punya' : '' || naga == 1 ? 'Level 1' : '' || naga == 2 ? 'Level 2' : '' || naga == 3 ? 'Level 3' : '' || naga == 4 ? 'Level 4' : '' || naga == 5 ? 'Level 5' : '' || naga == 6 ? 'Level 6' : '' || naga == 7 ? 'Level 7' : '' || naga == 8 ? 'Level 8' : '' || naga == 9 ? 'Level 9' : '' || naga == 10 ? 'Level 10' : '' || naga == 11 ? 'Level 11' : '' || naga == 12 ? 'Level 12' : '' || naga == 13 ? 'Level 13' : '' || naga == 14 ? 'Level 14' : '' || naga == 15 ? 'Level MAX' : ''}*
\r\r\r╰╼ Exp: ${naga === 0 
    ? 'Tidak Punya' 
    : naga === 15 
        ? '*Max Level*' 
        : `${_naga} ••> ${naga * 100}`}
🦊 Kyubi:    *${kyubi == 0 ? 'Tidak Punya' : '' || kyubi == 1 ? 'Level 1' : '' || kyubi == 2 ? 'Level 2' : '' || kyubi == 3 ? 'Level 3' : '' || kyubi == 4 ? 'Level 4' : '' || kyubi == 5 ? 'Level 5' : '' || kyubi == 6 ? 'Level 6' : '' || kyubi == 7 ? 'Level 7' : '' || kyubi == 8 ? 'Level 8' : '' || kyubi == 9 ? 'Level 9' : '' || kyubi == 10 ? 'Level 10' : '' || kyubi == 11 ? 'Level 11' : '' || kyubi == 12 ? 'Level 12' : '' || kyubi == 13 ? 'Level 13' : '' || kyubi == 14 ? 'Level 14' : '' || kyubi == 15 ? 'Level MAX' : ''}*
\r\r\r╰╼ Exp: ${kyubi === 0 
    ? 'Tidak Punya' 
    : kyubi === 15 
        ? '*Max Level*' 
        : `${_kyubi} ••> ${kyubi * 100}`}
🐕 Anjing:    *${anjing == 0 ? 'Tidak Punya' : '' || anjing == 1 ? 'Level 1' : '' || anjing == 2 ? 'Level 2' : '' || anjing == 3 ? 'Level 3' : '' || anjing == 4 ? 'Level 4' : '' || anjing == 5 ? 'Level 5' : '' || anjing == 6 ? 'Level 6' : '' || anjing == 7 ? 'Level 7' : '' || anjing == 8 ? 'Level 8' : '' || anjing == 9 ? 'Level 9' : '' || anjing == 10 ? 'Level 10' : '' || anjing == 11 ? 'Level 11' : '' || anjing == 12 ? 'Level 12' : '' || anjing == 13 ? 'Level 13' : '' || anjing == 14 ? 'Level 14' : '' || anjing == 15 ? 'Level MAX' : ''}*
\r\r\r╰╼ Exp: ${anjing === 0 
    ? 'Tidak Punya' 
    : anjing === 15 
        ? '*Max Level*' 
        : `${_anjing} ••> ${anjing * 100}`}`, 
contextInfo: {
mentionedJid,
externalAdReply: {
title: `Name: ${await conn.getName(name)}`,
body: `Level:  ${level}`,
thumbnailUrl: 'https://telegra.ph/file/b2a74fc0b6ef732c398f4.png', 
sourceUrl: "https://whatsapp.com/channel/0029VaAAkwOIN9ii1Tc6Mz1X/124",
mediaType: 1,
renderLargerThumbnail: true
}
}})
}
handler.help = ['inventory2']
handler.tags = ['rpg']
handler.command = /^(inv|inventory2|🪪)$/i
handler.group = true
handler.register = true
export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)