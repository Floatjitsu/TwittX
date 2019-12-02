const config = require('../config.js');
const request = require('request');
const fs = require('fs');

const pictureOfTheDay = new Promise((resolve, reject) => {
    //First step: make the picture of the day api call
    request('https://api.nasa.gov/planetary/apod?api_key=' + config.nasa.api_key /*+ "&&date=" + '2019-11-26'*/, (error, response, body) => {
        const jsonBody = JSON.parse(body);
        if(jsonBody.media_type === 'video') {
            // TODO: post url instead of downloading and post a picture 
            reject('media type is video!');
        } else {
            const url = jsonBody.url;
            const fileName = url.split('/').pop();
            //Second step: save the picture to the pictures folder based on the returned url
            request(url).pipe(fs.createWriteStream('./pictures/' + fileName)).on('close', () => {
                const params = { encoding: 'base64' };
                const b64 = fs.readFileSync('pictures/' + fileName, params);
                //Last step: resolve the promise with the right object to upload media data to twitter
                resolve({media_data: b64});
            });
        }
    });
});

module.exports = {pictureOfTheDay/*, new Variable*/};
