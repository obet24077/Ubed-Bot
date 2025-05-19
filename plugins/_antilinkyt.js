const isLinkYT = /(?:https?:\/\/)?(?:www\.)?(youtube\.com|youtu\.be)\//i

export async function before(m, { conn, isAdmin, isBotAdmin }) {
    if (m.isBaileys && m.fromMe) return !0
    if (!m.isGroup) return !1

    let chat = global.db.data.chats[m.chat]
    if (!chat.antiLinkYT) return !1

    const name = await conn.getName(m.sender)
    const isYTLink = isLinkYT.test(m.text)

    if (isYTLink) {
        await m.reply(!isAdmin
            ? `🚫 *${name}*, kamu mengirim link YouTube!\nPesan akan dihapus karena melanggar aturan grup.`
            : '⚠️ Kamu admin, link YouTube dibolehkan.')

        await conn.delay(1000)

        if (isBotAdmin && !isAdmin) {
            await conn.sendMessage(m.chat, { delete: m.key })
            // Uncomment kalau mau auto-kick:
            // await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
        }
    }

    return !1
}