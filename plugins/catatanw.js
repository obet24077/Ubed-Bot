let handler = async (m, { args, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender]
    if (!Array.isArray(user.catatan2)) user.catatan2 = []

    const subcmd = args[0]?.toLowerCase()
    const isi = args.slice(2).join(' ')
    const nomor = parseInt(args[1])

    switch (subcmd) {
        case undefined:
            if (user.catatan2.length == 0) return m.reply(`📓 Kamu belum memiliki catatan.\n\nGunakan:\n*${usedPrefix + command} buat isinya*`)
            return m.reply(`📚 *Daftar Catatanmu:*\n\n` + user.catatan2.map((c, i) => `${i + 1}. ${c}`).join('\n'))

        case 'buat':
            let teks = args.slice(1).join(' ')
            if (!teks) return m.reply(`⚠️ Harap isi catatan yang ingin disimpan.\nContoh:\n${usedPrefix + command} buat Belajar jam 8`)
            user.catatan2.push(teks)
            return m.reply(`✅ Catatan baru berhasil ditambahkan.`)

        case 'edit':
            if (isNaN(nomor) || nomor < 1 || nomor > user.catatan2.length)
                return m.reply(`⚠️ Nomor catatan tidak valid. Lihat daftarnya pakai *.${command}*`)
            if (!isi) return m.reply(`⚠️ Harap isi teks baru.\nContoh:\n${usedPrefix + command} edit 2 Ganti catatan`)
            user.catatan2[nomor - 1] = isi
            return m.reply(`✏️ Catatan nomor ${nomor} berhasil diedit.`)

        case 'hapus':
            if (isNaN(nomor) || nomor < 1 || nomor > user.catatan2.length)
                return m.reply(`⚠️ Nomor catatan tidak valid. Lihat daftarnya pakai *.${command}*`)
            user.catatan2.splice(nomor - 1, 1)
            return m.reply(`🗑️ Catatan nomor ${nomor} berhasil dihapus.`)

        default:
            return m.reply(`❓ Perintah tidak dikenal.\n\nGunakan:\n- *.${command}* → lihat semua catatan\n- *.${command} buat [isi]* → buat baru\n- *.${command} edit [nomor] [isi]* → edit\n- *.${command} hapus [nomor]* → hapus`)
    }
}

handler.help = ['catatan2', 'catatan2 buat', 'catatan2 edit', 'catatan2 hapus']
handler.tags = ['tools']
handler.command = /^catatan2$/i

export default handler