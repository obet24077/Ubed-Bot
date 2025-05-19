const { generateWAMessageFromContent } = (await import("@adiwajshing/baileys")).default

let handler = async (m, { conn, command, args, text }) => {
    global.db.data.ptv = global.db.data.ptv || {}
    const data = global.db.data.ptv
    const input = text.trim()

    switch (command) {
        case 'ptvbuat':
            if (!input.includes('|')) throw 'Format salah!\nContoh: .ptvbuat Judul Keren|https://video.url'
            const [judul, url] = input.split('|').map(v => v.trim())
            if (!judul || !url) throw 'Judul dan URL tidak boleh kosong.'
            if (!url.startsWith('http')) throw 'URL tidak valid!'
            data[judul.toLowerCase()] = url
            m.reply(`✅ Berhasil menyimpan PTV dengan judul: *${judul}*`)
            break

        case 'ptvlist':
            const list = Object.keys(data)
            if (list.length === 0) return m.reply('❌ Belum ada PTV yang disimpan.')

            const rows = list.map((judul, i) => ({
                header: "",
                title: judul,
                description: "Klik untuk memutar PTV ini",
                id: `.ptv ${judul}`
            }))

            const oya = "Pilih PTV yang ingin diputar"

            const msg = generateWAMessageFromContent(
                m.chat,
                {
                    viewOnceMessage: {
                        message: {
                            interactiveMessage: {
                                body: { text: oya },
                                footer: { text: "© Ubed Bot 2025" },
                                nativeFlowMessage: {
                                    buttons: [{
                                        name: "single_select",
                                        buttonParamsJson: JSON.stringify({
                                            title: "Daftar PTV Tersimpan",
                                            sections: [{
                                                title: "List PTV",
                                                highlight_label: "PTV",
                                                rows
                                            }]
                                        })
                                    }]
                                }
                            }
                        }
                    }
                },
                { quoted: m }
            )

            await conn.relayMessage(m.chat, msg.message, { messageId: m.id })
            break

        case 'ptv':
            if (!input) throw 'Masukkan judulnya!\nContoh: .ptv Judul Keren'
            const urlPlay = data[input.toLowerCase()]
            if (!urlPlay) throw `❌ PTV dengan judul *${input}* tidak ditemukan.`
            conn.sendMessage(m.chat, {
                video: { url: urlPlay },
                ptv: true,
                gifPlayback: true,
                caption: `🎬 PTV: *${input}*`
            }, { quoted: m })
            break

        case 'ptvhapus':
            if (!input) throw 'Masukkan judul yang ingin dihapus!\nContoh: .ptvhapus Judul Keren'
            const key = input.toLowerCase()
            if (!data[key]) throw `❌ PTV dengan judul *${input}* tidak ditemukan.`
            delete data[key]
            m.reply(`🗑️ Berhasil menghapus PTV dengan judul: *${input}*`)
            break
    }
}

handler.help = ['ptvbuat', 'ptvlist', 'ptv', 'ptvhapus']
handler.tags = ['video']
handler.command = /^(ptvbuat|ptvlist|ptv|ptvhapus)$/i

export default handler