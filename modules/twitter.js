const T = require('twit');
const config = require('../config');
const nasa = require('./nasa');
const spaceX = require('./spacex');
const firebase = require('./firebase');

const twitter = new T(config.twitter);
const hashtags = ['space','universe','cosmos','stars'];

let status = '';

const makePictureOfTheDayPost = () => {
	const hashtag = '#' + _getRandomHashtag();
	nasa.pictureOfTheDay.then(result => {
		switch (result.mediaType) {
			case 'video':
				status = 'Here is your #NASA video of the day ' + hashtag;
				/* Careful! This has not been tested yet! */
				// _makeTextPost(status);
				break;
			case 'image':
				status = 'Here is your #NASA picture of the day ' + hashtag;
				_makeImagePost(result.data, status).then(result => {
					console.log('SUCCESS! ' + result.text);
				}).catch(error => console.log(error));
				break;
		}
	}).catch(error => {
		console.log(error);
	});
};

const makeNearestEarthObjectPost = () => {
	nasa.nearEarthObjects.then(result => {
		_makeTextPost(result.twitText);
	});
};

const makeLatestSpaceXLaunchPost = () => {
	spaceX.latestLaunch.then(result => {
		firebase.spacex.latestLaunches.noEntryExists(result.launchDate)
			.then(() => {
				status = '#SpaceX Mission ' + result.missionName + ' launched successfully on ' + result.launchDate;
				_makeImagePost(result.data, status).then(data => {
					firebase.spacex.latestLaunches.writeEntry(data.id, result.missionName, result.launchDate);
				}).catch(error => console.log('IMAGE POST ERROR' + error));
			}).catch(error => console.log(error));
	}).catch(error => console.log(error));
};

const _makeImagePost = (mediaObject, status) => {
	return new Promise(function(resolve, reject) {
		_uploadMedia(mediaObject).then(mediaId => {
			twitter.post('statuses/update', {status: status, media_ids: mediaId}, (error, data, response) => {
				if (!error) {
					resolve(data);
				} else {
					reject(error);
				}
			});
		}).catch(error => {
			reject(error);
		});
	});
};

const _uploadMedia = mediaObject => {
	return new Promise((resolve, reject) => {
		twitter.post('media/upload', mediaObject, (error, data, response) => {
			if (!error) {
				resolve(data.media_id_string);
			} else {
				reject(error);
			}
		});
	});
};

/* Careful! This function has not been tested yet */
const _makeTextPost = status => {
	twitter.post('statuses/update', {status}, (error, data, response) => {
		console.log('A new post with the status ´' + data.text + '` has successfully been posted at ' + new Date().toLocaleString('en'));
	});
};

const _getRandomHashtag = () => hashtags[Math.floor(Math.random()*hashtags.length)];

module.exports = {makePictureOfTheDayPost, makeNearestEarthObjectPost, makeLatestSpaceXLaunchPost};
