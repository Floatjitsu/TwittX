const config = require('../config.js');
const request = require('request');
const fs = require('fs');

const pictureOfTheDayApiUrl = 'https://api.nasa.gov/planetary/apod?api_key=' + config.nasa.api_key;

const roverNames = ['Opportunity', 'Curiosity'];

let videoOfTheDayPostObject = {
    mediaType: 'video',
    data: ''
};

let pictureOfTheDayPostObject = {
    mediaType: 'image',
    data: {
        media_data: null
    }
};

let marsRoverPicturePostObject = {
    info: {
        roverName: '',
        date: null
    },
    data: {
        media_data: null
    }
};

const _downloadImage = (url, fileName) => {
    return new Promise((resolve, reject) => {
        request(url).pipe(fs.createWriteStream('./pictures/' + fileName)).on('close', () => {
            const imageFile = fs.readFileSync('pictures/' + fileName, _base64Parameter);
            resolve(imageFile);
        });
    });
};

const pictureOfTheDay = new Promise((resolve, reject) => {
    request(pictureOfTheDayApiUrl, (error, response, body) => {
        const responseBody = JSON.parse(body);
        const responseUrl = responseBody.url;
        if (responseBody.media_type === videoOfTheDayPostObject.mediaType) {
            videoOfTheDayPostObject.data = responseUrl;
            resolve(videoOfTheDayPostObject);
        } else if (responseBody.media_type === pictureOfTheDayPostObject.mediaType) {
            _downloadImage(responseUrl, responseUrl.split('/').pop()).then(image => {
                pictureOfTheDayPostObject.data.media_data = image;
                resolve(pictureOfTheDayPostObject);
            });
        }
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

const _getRandomRoverName = () => roverNames[Math.floor(Math.random() * roverNames.length)];

const _generateRandomMarsRoverApiUrl = roverName => 'https://api.nasa.gov/mars-photos/api/v1/manifests/' + roverName + '?api_key=' + config.nasa.api_key;

const _generateMarsPhotoDateFromPhotoArray = photoArray => photoArray[Math.floor(Math.random() * photoArray.length)].earth_date;

const _makeMarsPhotosApiCall = url => {
    return new Promise((resolve, reject) => {
        request(url, (error, response, body) => {
            if (!error) {
                resolve(_getRandomPhotoUrl(JSON.parse(body).photos));
            } else {
                reject(error);
            }
        });
    });
};

const _generateMarsPhotoUrl = (roverName, randomDate) => 'https://api.nasa.gov/mars-photos/api/v1/rovers/' + roverName + '/photos?earth_date=' + randomDate + '&api_key=' + config.nasa.api_key;

const _getRandomPhotoUrl = photoArray => photoArray[Math.floor(Math.random() * photoArray.length)].img_src;

const marsRoverPicture = new Promise((resolve, reject) => {
    const roverName = _getRandomRoverName();
    request(_generateRandomMarsRoverApiUrl(roverName), (error, response, body) => {
        if (!error) {
            const randomDate = _generateMarsPhotoDateFromPhotoArray(JSON.parse(body).photo_manifest.photos);
            _makeMarsPhotosApiCall(_generateMarsPhotoUrl(roverName, randomDate))
                .then(photoUrl => {
                    _downloadImage(photoUrl).then(photo => {
                        marsRoverPicturePostObject.info.roverName = roverName;
                        marsRoverPicturePostObject.info.date = randomDate;
                        marsRoverPicturePostObject.data.media_data= photo;
                        resolve(marsRoverPicturePostObject);
                    });
                })
                .catch(photoApiError => {
                    reject(photoApiError);
                });
        } else {
            reject(error);
        }
    });
});

const _base64Parameter = { encoding: 'base64' };

module.exports = {pictureOfTheDay, nearEarthObjects, marsRoverPicture};
