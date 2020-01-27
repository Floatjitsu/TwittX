const T = require('twit');
const ErrorHandler = require('./errorHandler');
const config = require('../config');
const nasa = require('./nasa');
const spaceX = require('./spacex');
const firebase = require('./firebase');
const hashtagJson = require('../hashtags');

const twitter = new T(config.twitter);
const hashtags = hashtagJson.hashtags;

let status = '';

const makePictureOfTheDayPost = () => {
	const hashtag = _getRandomHashtag();
	nasa.pictureOfTheDay.then(result => {
		switch (result.mediaType) {
			case 'video':
				status = 'Here is your #NASA video of the day ' + hashtag;
				/* Careful! This has not been tested yet! */
				// _makeTextPost(status);
				break;
			case 'image':
				status = 'Here is your #NASA picture of the day ' + hashtag;
				_makeImagePost(result.data, status)
					.then(() => {
						console.log(_postSuccessMessage('Picture of the Day'));
					}).catch(error => {
						new ErrorHandler().writeNewErrorEntry(error);					
				});
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

const makeMarsRoverPicturePost = () => {
	nasa.marsRoverPicture.then(result => {
		const formattedDate = new Date(result.info.date).toLocaleDateString('en');
		status = 'This picture from #Mars was taken on ' + formattedDate + ' by ' + result.info.roverName;
		_makeImagePost(result.data, status)
			.then(() => console.log('Mars Rover picture post was successful'))
			.catch(error => console.log(error));
	}).catch(error => console.log(error));
}

const makeLatestSpaceXLaunchPost = () => {
	spaceX.latestLaunch.then(result => {
		firebase.spacex.latestLaunches.noEntryExists(result.launchDate)
			.then(() => {
				status = '#SpaceX Mission ' + result.missionName + ' launched successfully on ' + result.launchDate;
				_makeImagePost(result.data, status).then(data => {
					firebase.spacex.latestLaunches.writeEntry(data.id, result.missionName, result.launchDate);
				}).catch(error => console.log(error));
			}).catch(error => console.log(error));
	}).catch(error => console.log(error));
};

const makeNextSpaceXLaunchPost = () => {
	spaceX.nextLaunch.then(result => {
		firebase.spacex.nextLaunches.noEntryExists(result.launchDate)
			.then(() => {
				status = 'The next SpaceX Mission ' + result.missionName + ' will launch on ' + result.launchDate + '. \n';
				if (result.redditThread) {
					status += 'Read more here: ' + result.redditThread;
				}
				_makeTextPost(status).then(data => {
					firebase.spacex.nextLaunches.writeEntry(data.id, result.missionName, result.launchDate);
				}).catch(error => console.log(error));
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
					reject({message: error.message, functionName: '_makeImagePost'});
				}
			});
		}).catch(error => {
			reject({message: error.message, functionName: '_uploadMedia'});
		});
	});
};

const _uploadMedia = mediaObject => {
	return new Promise((resolve, reject) => {
		twitter.post('media/upload', mediaObject, (error, data, response) => {
			if (!error) {
				resolve(data.media_id_string);
			} else {
				reject({message: error.message, functionName: '_uploadMedia'});
			}
		});
	});
};

const _makeTextPost = status => {
	return new Promise((resolve, reject) => {
		twitter.post('statuses/update', {status}, (error, data, response) => {
			if (!error) {
				resolve(data);
			} else {
				reject({message: error.message, functionName: '_makeTextPost'});
			}
		});
	});

};

const _postSuccessMessage = postName => {
	const date = new Date().toLocaleDateString('en');
	const time = new Date().toLocaleTimeString('en');

	return 'Post ' + postName + ' has successfully been posted at ' + date + ' ' + time;
};

const _getRandomHashtag = () => hashtags[Math.floor(Math.random()*hashtags.length)];

module.exports = {makePictureOfTheDayPost, makeMarsRoverPicturePost, makeNearestEarthObjectPost, makeLatestSpaceXLaunchPost, makeNextSpaceXLaunchPost};
