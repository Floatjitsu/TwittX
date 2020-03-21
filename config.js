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
        api_key: '5WixNpypnqJ36Qgwdpgg7hXNzWnaMriHs6K5Eqy8'
    },
    firebase: {
        api_key: '../twittx-9bf78-firebase-adminsdk-8w28w-eb32c75d0e.json',
        app_url: 'https://twittx-9bf78.firebaseio.com'
    }
}
