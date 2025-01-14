require('dotenv').config();
const io = require('../services/alertService'); 
const mongoose=require("mongoose");

async function connectMongoDb(url){
    return mongoose.connect(url);
}
module.exports={
    connectMongoDb,
};
connectMongoDb(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected!"));

const cron = require('node-cron');
const { fetchCryptoPrices } = require('../services/cryptoService');
const Alert = require('../models/alertModel');

// Schedule the task to run every 10 seconds
cron.schedule('*/10 * * * * *', async () => {
    console.log('Fetching cryptocurrency prices...');
    try {
        // Fetch cryptocurrency prices
        const prices = await fetchCryptoPrices();

        if (prices) {
            console.log('Prices fetched:', prices);

            // Fetch all alerts from the database
            const alerts = await Alert.find();

            // Check the alerts against the fetched prices
            alerts.forEach(async (alert) => {
                const cryptoPrice = prices[alert.currency]?.usd;

                if (!cryptoPrice) {
                    console.warn(`Price for ${alert.currency} not found.`);
                    return;
                }

                // Check if the price meets the alert criteria
                if (cryptoPrice >= alert.lowerRange && cryptoPrice <= alert.upperRange) {
                    console.log(`Alert for ${alert.username}: ${alert.currency} is within range!`);

                    // Emit the alert to the user via Socket.IO
                    global.io.to(alert.username).emit('priceAlert', {
                        message: `${alert.currency} price is within your range: ${cryptoPrice}`,
                        currency: alert.currency,
                        price: cryptoPrice,
                    });
                }
            });
        } else {
            console.error('Failed to fetch cryptocurrency prices.');
        }
    } catch (error) {
        console.error('Error during cron job execution:', error.message);
    }
});

console.log('Cron job started. Fetching data every 10 seconds...');
