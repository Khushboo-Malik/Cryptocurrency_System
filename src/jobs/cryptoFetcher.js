require('dotenv').config();
const io = require('../services/alertService'); 
const mongoose = require("mongoose");
const NodeCache = require("node-cache"); // Import node-cache
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });  // Set TTL for cache to 60 seconds

async function connectMongoDb(url) {
    return mongoose.connect(url);
}

module.exports = {
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
        // Check if the prices are cached
        let prices = cache.get("cryptoPrices");

        if (!prices) {
            console.log('Cache miss, fetching from API...');
            // Fetch cryptocurrency prices from the API
            prices = await fetchCryptoPrices();

            if (prices) {
                // Cache the fetched prices
                cache.set("cryptoPrices", prices);
                console.log('Prices fetched and cached:', prices);
            } else {
                console.error('Failed to fetch cryptocurrency prices.');
                return;
            }
        } else {
            console.log('Cache hit, using cached prices:', prices);
        }

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
    } catch (error) {
        console.error('Error during cron job execution:', error.message);
    }
});

console.log('Cron job started. Fetching data every 10 seconds...');
