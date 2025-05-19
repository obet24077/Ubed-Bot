let handler = m => m;

handler.before = async function (m) {
    let user = db.data.users[m.sender];
    if (user.premium && Date.now() > user.premiumTime) {
        user.premium = false;  // Menonaktifkan status premium
        user.premiumTime = 0;  // Reset waktu premium
        await db.write();  // Pastikan perubahan disimpan ke database
    }
};

export default handler;