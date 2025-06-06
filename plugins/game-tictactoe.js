import TicTacToe from '../lib/tictactoe.js'

let handler = async (m, { conn, usedPrefix, command, text }) => {
    conn.game = conn.game ? conn.game : {}
    if (Object.values(conn.game).find(room => room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender))) 
        throw 'Kamu masih di dalam game!'

    let room = Object.values(conn.game).find(room => room.state === 'WAITING' && (text ? room.name === text : true))

    if (room) {
        m.reply('Partner ditemukan!')
        room.o = m.chat
        room.game.playerO = m.sender
        room.state = 'PLAYING'

        let arr = room.game.render().map(v => ({
            X: '❌', O: '⭕',
            1: '1️⃣', 2: '2️⃣', 3: '3️⃣',
            4: '4️⃣', 5: '5️⃣', 6: '6️⃣',
            7: '7️⃣', 8: '8️⃣', 9: '9️⃣'
        }[v]))

        let str = `
Room ID: ${room.id}
${arr.slice(0, 3).join('')}
${arr.slice(3, 6).join('')}
${arr.slice(6).join('')}
Menunggu @${room.game.currentTurn.split('@')[0]}
Ketik *nyerah* untuk menyerah.
`.trim()

        await conn.reply(room.x, str, m, { mentions: conn.parseMention(str) })
        await conn.reply(room.o, str, m, { mentions: conn.parseMention(str) })
    } else {
        room = {
            id: 'tictactoe-' + (+new Date),
            x: m.chat,
            o: '',
            game: new TicTacToe(m.sender, 'o'),
            state: 'WAITING'
        }
        if (text) room.name = text

        m.reply('Menunggu partner' + (text ? ` mengetik command dibawah ini\n${usedPrefix}${command} ${text}` : ''))
        conn.game[room.id] = room
    }

    // **Timer untuk waktu habis**
    setTimeout(() => {
        if (room && room.state === 'WAITING') {
            let msg = '⏳ Waktu habis! Game dibatalkan.'
            if (room.x) conn.reply(room.x, msg, m)
            if (room.o) conn.reply(room.o, msg, m)
            delete conn.game[room.id]
        }
    }, 120000) // 2 menit
}

handler.help = ['tictactoe', 'ttt']
handler.tags = ['game']
handler.command = /^(tictactoe|t{3})$/
handler.register = true

export default handler