let now = Date.now()
let spp = user.sekolah?.spp || 0
let deadline = user.sekolah?.terakhirBayar || 0

if ((now - deadline) > 7 * 24 * 60 * 60 * 1000 && spp < 1000000) { // lewat 7 hari, belum bayar 1jt total
  user.exp = Math.max(user.exp - 500, 0)
  user.money = Math.max(user.money - 50000, 0)
  m.reply('Kamu mendapat hukuman karena menunggak SPP lebih dari 7 hari!\n-500 EXP\n-50.000 Money')
  user.sekolah.terakhirBayar = now
}