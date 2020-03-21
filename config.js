const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    twitter: {
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token: process.env.TWITTER_ACCESS_TOKEN,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    },
    nasa: {
        api_key: process.env.NASA_API_KEY
    },
    firebase: {
        api_key: process.env.FIREBASE_API_KEY,
        app_url: process.env.FIREBASE_APP_URL
    }
}
