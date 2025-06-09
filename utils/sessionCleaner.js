const cron = require('node-cron');
const models = require('../models');
const { Op } = require('sequelize');

console.log('Session cleaner initialized');

cron.schedule('* * * * * *', async () => {

    try {
        // Define the time threshold for session expiration (e.g., 10 minutes ago)
        const expirationThreshold = new Date(Date.now() - 60 * 1000);

        // Find sessions that have ended and are older than the threshold
        const expiredSessions = await models.Session.destroy({
            where: {
                endTime: {  
                    [Op.lt]: expirationThreshold
                }
            }
        });

        console.log(`Expired sessions cleaned up: ${expiredSessions}`);

    } catch (error) {
        console.error('Error cleaning up expired sessions:', error);
    }

})