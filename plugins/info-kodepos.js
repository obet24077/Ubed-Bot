import axios from 'axios'

const handler = async (m, { conn, args }) => {
    if (!args.length) return m.reply('Ketik nama daerah untuk mencari kode pos!')

    const query = args.join(' ')

    try {
        const response = await axios.get(`https://api.lolhuman.xyz/api/kodepos`, {
            params: {
                apikey: 'ubed2407',
                query: query
            }
        })

        const data = response.data

        if (data.status === 200 && data.result.length > 0) {
            let reply = `📍 *Kode Pos untuk: ${query}*\n\n`

            data.result.forEach((item, index) => {
                reply += `*${index + 1}*.\n`
                reply += `📍 *Desa/Kelurahan:* ${item.village}\n`
                reply += `🏙️ *Kecamatan:* ${item.district}\n`
                reply += `🏡 *Kabupaten/Kota:* ${item.regency}\n`
                reply += `🌍 *Provinsi:* ${item.province}\n`
                reply += `📍 *Kode Pos:* ${item.code}\n`
                reply += `🌐 *Koordinat:* ${item.latitude}, ${item.longitude}\n`
                reply += `📏 *Tinggi:* ${item.elevation} meter\n`
                reply += `⏰ *Zona Waktu:* ${item.timezone}\n\n`
            })

            return conn.reply(m.chat, reply, m)
        } else {
            return m.reply('📍 *Tidak ditemukan kode pos untuk wilayah tersebut!*')
        }
    } catch (error) {
        console.error(error)
        return m.reply('❌ Terjadi kesalahan, coba lagi nanti.')
    }
}

handler.command = ['kodepos']
handler.help = ['kodepos']
handler.tags = ['info']

export default handler