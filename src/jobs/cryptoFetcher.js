const cron = require('node-cron');
const { fetchCryptoPrices } = require('../services/cryptoService');

// Schedule the task to run every 10 seconds
cron.schedule('*/10 * * * * *', async () => {
    console.log('Fetching cryptocurrency prices...');
    const prices = await fetchCryptoPrices();
    if (prices) {
        console.log('Prices fetched:', prices);
    } else {
        console.error('Failed to fetch cryptocurrency prices');
    }
});

console.log('Cron job started. Fetching data every 10 seconds...');
