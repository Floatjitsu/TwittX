const firebase = require('./firebase.js');
const request = require('request');
const fs = require('fs');

let latestLaunchPostObject = {
	missionName: '',
	launchDate: null,
	data: {
		media_data: null
	}
}

const latestLaunch = new Promise((resolve, reject) => {
	request('https://api.spacexdata.com/v3/launches/latest', (error, response, body) => {
		if (response.statusCode === 200) {
			const jsonBody = JSON.parse(body);
			_fillLatestLaunchPostObjectFromJson(jsonBody);
			const imageUrl = _getImageUrlFromJsonBody(jsonBody);
			const fileName = imageUrl.split('/').pop();
			request(imageUrl).pipe(fs.createWriteStream('./pictures/' + fileName)).on('close', () => {
                const picture = _loadAndReturnPictureFromApiByFileName(fileName);
				_setMediaDataInLatestLaunchPostObject(picture);
				resolve(latestLaunchPostObject);
            });
		} else {
			reject('Error while making API request to SpaceX latest Launch');
		}
	});
});

const _fillLatestLaunchPostObjectFromJson = jsonBody => {
	latestLaunchPostObject.missionName = jsonBody.mission_name;
	latestLaunchPostObject.launchDate = new Date(jsonBody.launch_date_utc).toLocaleString('en');
};

const _setMediaDataInLatestLaunchPostObject = mediaData => {
	latestLaunchPostObject.data.media_data = mediaData;
};

const _loadAndReturnPictureFromApiByFileName = fileName => {
	return fs.readFileSync('pictures/' + fileName, {encoding: 'base64'});
};

const _getImageUrlFromJsonBody = jsonBody => {
	return jsonBody.links.flickr_images.length !== 0 ?
			jsonBody.links.flickr_images[0] :
			jsonBody.links.mission_patch_small;
};

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
