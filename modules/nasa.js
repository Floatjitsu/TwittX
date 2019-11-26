const config = require('../config.js')
const request = require('request');
const fs = require('fs');

const pictureOfTheDay = new Promise((resolve, reject) => {
    //First step: make the picture of the day api call
    request('https://api.nasa.gov/planetary/apod?api_key=' + config.nasa.api_key, (error, response, body) => {
        const url = JSON.parse(body).url;
        const fileName = url.split('/').pop();
        //Second step: save the picture to the pictures folder based on the returned url
        request(url).pipe(fs.createWriteStream('./pictures/' + fileName)).on('close', () => {
          const params = { encoding: 'base64' };
          const b64 = fs.readFileSync('pictures/' + fileName, params);
          //Last step: resolve the promise with the right object to upload media data to twitter
          resolve({media_data: b64});
        });
    });
});

module.exports = {pictureOfTheDay/*, new Variable*/};
