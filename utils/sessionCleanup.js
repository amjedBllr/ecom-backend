const cron = require('node-cron')


//? cleaning the expired session every hour !!
cron.schedule('0 * * * *', async () => {
    try {
      // Delete expired sessions from the sessions collection
      await mongoose.connection.db.collection('sessions').deleteMany({ expires: { $lt: new Date() } });
      
      console.log('Expired sessions cleaned up successfully.');
    } catch (err) {
      console.error('Error cleaning up expired sessions:', err);
    }
  });