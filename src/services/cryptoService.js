require('dotenv').config();
const axios = require('axios');

/**
 * Fetch cryptocurrency prices for multiple cryptocurrencies from CoinGecko API.
 * @returns {object|null} - The price data for Bitcoin, Ethereum, and Cardano in USD.
 */
const fetchCryptoPrices = async () => {
    try {
        const cryptoIds = ['bitcoin', 'ethereum', 'cardano'];
        const response = await axios.get(
            `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds.join(',')}&vs_currencies=usd`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.CRYPTO_KEY}`,
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching cryptocurrency prices:', error.message);
        return null;
    }
};

module.exports = { fetchCryptoPrices };
