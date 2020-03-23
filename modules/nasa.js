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

let nearestEarthObjectPostObject = {
    distance: '',
    name: '',
    diameter: '',
    furtherInfoUrl: ''
};

const _downloadImage = (url, fileName) => {
    return new Promise((resolve, reject) => {
        request(url).pipe(fs.createWriteStream('./pictures/' + fileName)).on('close', () => {
            const imageFile = fs.readFileSync('./pictures/' + fileName, _base64Parameter);
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

const _generateNearestEarthObjectApiUrl = () => {
    return 'https://api.nasa.gov/neo/rest/v1/feed?end_date' + _getTodaysDate() + '&api_key=' + config.nasa.api_key;
};

const _getTodaysDate = () => new Date().toJSON().slice(0,10);

const _findObjectWithSmallestDistanceToEarth = nearestEarthObjects => {
    let earthObject = nearestEarthObjects[0];
    nearestEarthObjects.forEach((element, index) => {
        if (element.close_approach_data[0].miss_distance.kilometers < earthObject.close_approach_data[0].miss_distance.kilometers) {
            earthObject = element;
        }
    });
    return earthObject;
}

const _buildNearestEarthObjectPostObject = nearestEarthObject => {
    nearestEarthObjectPostObject.distance = Math.floor(nearestEarthObject.close_approach_data[0].miss_distance.kilometers) + ' kilometers';
    nearestEarthObjectPostObject.name = nearestEarthObject.name;
    nearestEarthObjectPostObject.diameter = _diameterFromKilometerToMeter(nearestEarthObject.estimated_diameter.kilometers.estimated_diameter_max);
    nearestEarthObjectPostObject.furtherInfoUrl = nearestEarthObject.nasa_jpl_url;
};

/* Convert diameter to meter only if diameter is less than 1 km */
const _diameterFromKilometerToMeter = diameter => {
    if (diameter.toString().startsWith('0.')) {
        return (diameter.toFixed(4) * 1000) + ' meters';
    }
    return diameter.toFixed(4) + ' kilometers';
};

const nearEarthObjects = new Promise((resolve, reject) => {
    request(_generateNearestEarthObjectApiUrl(), (error, response, body) => {
        const nearestEarthObject = _findObjectWithSmallestDistanceToEarth(JSON.parse(body).near_earth_objects[_getTodaysDate()]);
        _buildNearestEarthObjectPostObject(nearestEarthObject);
        resolve(nearestEarthObjectPostObject);
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
