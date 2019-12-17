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
    const today = new Date().toJSON().slice(0,10); //todays date with form yyyy-mm-dd
    request('https://api.nasa.gov/neo/rest/v1/feed?end_date=' + today +'&api_key=' + config.nasa.api_key, (error, response, body) => {
        const jsonBody = JSON.parse(body);
        const jsonObjects = jsonBody.near_earth_objects;

        let closestIdx = 0;
        let closestObject = 0;
        jsonObjects[today].forEach(function(nearObject, index){
            if(index === 0){
                closestObject = parseFloat(nearObject.close_approach_data[0].miss_distance.kilometers);
            }else{
                if(parseFloat(nearObject.close_approach_data[0].miss_distance.kilometers) < closestObject){
                    closestIdx = index;
                    closestObject = parseFloat(nearObject.close_approach_data[0].miss_distance.kilometers);
                }
            }
        });
        const nearestObject = jsonObjects[today][closestIdx]; //save closest object
        
        const countObjects = jsonBody.element_count;
        const name = nearestObject.name;
        const missDistance = nearestObject.close_approach_data[0].miss_distance.kilometers;
        const closeApproachTime = nearestObject.close_approach_data[0].close_approach_date_full.split(" ")[1];
        const sizeMetersMax = nearestObject.estimated_diameter.meters.estimated_diameter_max;
        const velosityKmh = nearestObject.close_approach_data[0].relative_velocity.kilometers_per_hour;
        const potentiallyHazardous = nearestObject.is_potentially_hazardous_asteroid;
        const furtherInfoUrl = nearestObject.nasa_jpl_url;
        
        
        
        

        const twitText = 'Today are ' + countObjects + ' asteroids near the Earth.\n' +
                                 'The nearest asteroid has the name ' + name + ' and is ' + parseFloat(missDistance).toFixed(2) + ' kilometers away from the Earth at the time of '+ closeApproachTime + '.\n' +
                                 'Estimated size: ' + parseFloat(sizeMetersMax).toFixed(2) + ' meter\n' +
                                 'Estimated speed: ' + parseFloat(velosityKmh).toFixed(2) + ' km/h\n' +
                                 //TODO 'Is Hazardous?: ' + potentiallyHazardous + '\n' +
                                 'Further Informations: \n' +
                                 furtherInfoUrl;

        if (response.statusCode === 200) {
            resolve({
                twitText
            });
        }else {
			reject('Error while making NASA NearEartObjects API request');
		}
    });
});

module.exports = {pictureOfTheDay, nearEarthObjects};
