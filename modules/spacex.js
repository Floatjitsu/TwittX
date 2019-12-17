const firebase = require('./firebase.js');
const request = require('request');
const fs = require('fs');

const latestLaunch = new Promise((resolve, reject) => {
	request('https://api.spacexdata.com/v3/launches/latest', (error, response, body) => {
		if (response.statusCode === 200) {
			const jsonBody = JSON.parse(body);
			const missionName = jsonBody.mission_name;
			const launchDate = jsonBody.launch_date_utc;
			const imageUrl = jsonBody.links.flickr_images.length !== 0 ? jsonBody.links.flickr_images[0] :
				jsonBody.links.mission_patch_small;
			const fileName = imageUrl.split('/').pop();
			request(imageUrl).pipe(fs.createWriteStream('./pictures/' + fileName)).on('close', () => {
                const params = { encoding: 'base64' };
                //Twitter accepts base64 encoded files for upload
                const b64 = fs.readFileSync('pictures/' + fileName, params);
                //Twitter needs an object in the form of {media_data: param} to upload images
                //That is why we resolve with this type of object
                resolve({
					missionName: missionName,
					launchDate: new Date(launchDate).toLocaleString('en'),
                    data: {
                        media_data: b64
                    }
                });
            });
		} else {
			reject('Error while making API request to SpaceX latest Launch');
		}
	});
});

const nextLaunch = new Promise((resolve, reject) => {
	request('https://api.spacexdata.com/v3/launches/next', (error, response, body) => {
		if (response.statusCode === 200) {
			const jsonBody = JSON.parse(body);
			const missionName = jsonBody.mission_name;
			const launchDate = jsonBody.launch_date_utc;
			const redditThread = jsonBody.links.reddit_campaign;
			resolve({
				missionName: missionName,
				launchDate: new Date(launchDate).toLocaleString('en'),
				redditThread: redditThread
			});
		} else {
			reject('Error while making API request to SpaceX next launch');
		}
	});
});

module.exports = {latestLaunch, nextLaunch};
