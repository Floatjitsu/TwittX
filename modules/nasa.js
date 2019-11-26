const config = require('../config.js')
const request = require('request');

const pictureOfTheDay = new Promise((resolve, reject) => {
    request('https://api.nasa.gov/planetary/apod?api_key='+config.nasa.api_key , (error, response, body) => {
        resolve(JSON.parse(body));
    });
});

module.exports = {pictureOfTheDay/*, new Variable*/};