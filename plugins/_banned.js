let handler = m => m

handler.before = async function (m) {
    let user = db.data.users[m.sender]                              
    if (new Date() > user.banExpires && user.banned && !user.BannedReason) {
        user.banExpires = 0
        user.banned = false
    }
}
export default handler