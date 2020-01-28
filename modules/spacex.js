const firebase = require('./firebase.js');
const request = require('request');
const fs = require('fs');

let latestLaunchPostInfo = {
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
			_filllatestLaunchPostInfoFromJson(jsonBody);
			const imageUrl = _getImageUrlFromJsonBody(jsonBody);
			const fileName = imageUrl.split('/').pop();
			request(imageUrl).pipe(fs.createWriteStream('./pictures/' + fileName)).on('close', () => {
                const picture = _loadAndReturnPictureFromApiByFileName(fileName);
				_setMediaDataInlatestLaunchPostInfo(picture);
				resolve(latestLaunchPostInfo);
            });
		} else {
			reject({errorMessage: JSON.parse(body).error, apiName: 'SpaceX Latest Launch'});
		}
	});
});

const _filllatestLaunchPostInfoFromJson = jsonBody => {
	latestLaunchPostInfo.missionName = jsonBody.mission_name;
	latestLaunchPostInfo.launchDate = new Date(jsonBody.launch_date_utc).toLocaleString('en');
};

const _setMediaDataInlatestLaunchPostInfo = mediaData => {
	latestLaunchPostInfo.data.media_data = mediaData;
};

const _loadAndReturnPictureFromApiByFileName = fileName => {
	return fs.readFileSync('pictures/' + fileName, {encoding: 'base64'});
};

const _getImageUrlFromJsonBody = jsonBody => {
	return jsonBody.links.flickr_images.length !== 0 ?
			jsonBody.links.flickr_images[0] :
			jsonBody.links.mission_patch_small;
};

let nextLaunchPostObject = {
	missionName: '',
	launchDate: null,
	redditThread: ''
};

const nextLaunch = new Promise((resolve, reject) => {
	request('https://api.spacexdata.com/v3/launches/nex', (error, response, body) => {
		if (response.statusCode === 200) {
			_fillNextLaunchPostObjectFromJsonBody(JSON.parse(body));
			resolve(nextLaunchPostObject);
		} else {
			reject({error: JSON.parse(body).error, apiName: 'SpaceX Next Launch'});
		}
	});
});

const _fillNextLaunchPostObjectFromJsonBody = jsonBody => {
	nextLaunchPostObject.missionName = jsonBody.mission_name;
	nextLaunchPostObject.launchDate = new Date(jsonBody.launch_date_utc).toLocaleString('en');
	nextLaunchPostObject.redditThread = jsonBody.links.reddit_campaign;
}

module.exports = {latestLaunch, nextLaunch};
