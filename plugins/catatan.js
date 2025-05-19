let handler = async (m, { args, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender]
    if (!user.catatan) user.catatan = ''

    const subcmd = args[0]?.toLowerCase()
    const isi = args.slice(1).join(' ')

    switch (subcmd) {
        case undefined:
            if (!user.catatan) return m.reply(`📓 Kamu belum memiliki catatan.\n\nGunakan:\n*${usedPrefix + command} buat isinya*`)
            return m.reply(`📓 *Catatanmu:*\n\n${user.catatan}`)
        
        case 'buat':
            if (!isi) return m.reply('⚠️ Harap isi catatan yang ingin disimpan.\n\nContoh:\n.catatan buat Ini catatan pertama saya')
            user.catatan = isi
            return m.reply('✅ Catatan baru telah disimpan.')

        case 'edit':
            if (!user.catatan) return m.reply('⚠️ Kamu belum memiliki catatan untuk diedit.')
            if (!isi) return m.reply('⚠️ Harap isi teks baru untuk mengedit catatan.\n\nContoh:\n.catatan edit Ganti catatanku ya!')
            user.catatan = isi
            return m.reply('✏️ Catatanmu berhasil diedit.')

        case 'hapus':
            if (!user.catatan) return m.reply('⚠️ Tidak ada catatan yang bisa dihapus.')
            user.catatan = ''
            return m.reply('🗑️ Catatanmu telah dihapus.')
        
        default:
            return m.reply(`❓ Perintah tidak dikenal.\n\nGunakan:\n- *.catatan* → lihat\n- *.catatan buat [isi]* → buat baru\n- *.catatan edit [isi]* → edit\n- *.catatan hapus* → hapus`)
    }
}

handler.help = ['catatan', 'catatan buat', 'catatan edit', 'catatan hapus']
handler.tags = ['tools']
handler.command = /^catatan$/i

export default handler