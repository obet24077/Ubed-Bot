let handler = m => m

handler.before = async function (m) {
    let user = db.data.users[m.sender]                              
    if (user.health > 1500) {
            user.health = 1500
        }
    if (user.health < 0) {
            user.health = 0
        }
    }

export default handler