const config = require('../config.js');
const request = require('request');
const fs = require('fs');

const pictureOfTheDay = new Promise((resolve, reject) => {
    request('https://api.nasa.gov/planetary/apod?api_key=' + config.nasa.api_key, (error, response, body) => {
        const jsonBody = JSON.parse(body);
        const url = jsonBody.url;
        if(jsonBody.media_type === 'video') {
            //If media_type is equal to video, we only want to post the url of the video
            //That's why we only resolve with the received url
            resolve({
                mediaType: jsonBody.media_type,
                data: url
            });
        } else if(jsonBody.media_type === 'image') {
            const fileName = url.split('/').pop();
            //We need to download and save the image because it is necessary to upload it on Twitter before posting it
            request(url).pipe(fs.createWriteStream('./pictures/' + fileName)).on('close', () => {
                const params = { encoding: 'base64' };
                //Twitter accepts base64 encoded files for upload
                const b64 = fs.readFileSync('pictures/' + fileName, params);
                //Twitter needs an object in the form of {media_data: param} to upload images
                //That is why we resolve with this type of object
                resolve({
                    mediaType: jsonBody.media_type,
                    data: {
                        media_data: b64
                    }
                });
            });
        } /* space for resolving with other possible media types (if there are any) */
    });
});

const nearEarthObjects = new Promise((resolve, reject) => {
    //const today = new Date(); //todays date
    //const formattedToday =  ""; //todays date with form yyy-mm-dd
    request('https://api.nasa.gov/neo/rest/v1/feed?end_date=2019-12-10&api_key=' + config.nasa.api_key, (error, response, body) => {
        const jsonBody = JSON.parse(body);
        const countObjects = jsonBody.element_count;
        //const jsonObjects = jsonBody;

        if (response.statusCode === 200) {
            resolve({
                countObjects
            });
        }else {
			reject('Error while making NASA NearEartObjects API request');
		}
    });
});

module.exports = {pictureOfTheDay, nearEarthObjects};
