import cron from 'node-cron';

// Function to update user limits at 00:00 WIB
const updateUserLimits = () => {
    console.log('Scheduled task running: Checking user limits at 00:00 WIB');

    // Iterate through all users in the database
    for (let userId in global.db.data.users) {
        let user = global.db.data.users[userId];
        
        // Check if the user's limit is 0
        if (user.limit === 0) {
            user.limit += 5;  // Add 5 limits
            console.log(`User ${userId} has been given 5 new limits.`);
        }
    }
};

// Schedule the task to run at 00:00 WIB every day
cron.schedule('0 0 * * *', updateUserLimits, {
    timezone: "Asia/Jakarta" // Use WIB time zone
});

console.log('Cron job scheduled to update user limits at 00:00 WIB');