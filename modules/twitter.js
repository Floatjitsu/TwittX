const T = require('twit');
const config = require('../config');
const nasa = require('./nasa.js');

const twitter = new T(config.twitter);
const hashtags = ['space','universe','cosmos','stars'];

const makePictureOfTheDayPost = () => {
	const hashtag = '#' + _getRandomHashtag();
	nasa.pictureOfTheDay.then(result => {
		switch (result.mediaType) {
			case 'video':
				const status = 'Here is your #NASA video of the day ' + hashtag;
				/* Careful! This has not been tested yet! */
				// _makeTextPost(status);
				break;
			case 'image':
				const status = 'Here is your #NASA picture of the day ' + hashtag;
				_makeImagePost(result.data, status);
				break;
		}
	}).catch(error => {
		console.log(error);
	});
};

const _makeImagePost = (mediaObject, status) => {
	_uploadMedia(mediaObject).then(mediaId => {
		twitter.post('statuses/update', {status: status, media_ids: mediaId}, (error, data, response) => {
			console.log('A new post with the status ´' + data.text + '` has successfull been posted at ' + new Date().toLocaleString('en'));
		});
	}).catch(error => {
		console.log(error);
	});
};

const _uploadMedia = mediaObject => {
	return new Promise((resolve, reject) => {
		twitter.post('media/upload', mediaObject, (error, data, response) => {
			if (!error) {
				resolve(data.media_id_string);
			} else {
				reject();
			}
		});
	});
};

/* Careful! This function has not been tested yet */
const _makeTextPost = status => {
	twitter.post('statuses/update', {status}, (error, data, response) => {
		console.log('A new post with the status ´' + data.text + '` has successfully been posted at ' + new Date().toLocaleString('en'));
	});
}

const _getRandomHashtag = () => hashtags[Math.floor(Math.random()*hashtags.length)];

module.exports = {makePictureOfTheDayPost};
