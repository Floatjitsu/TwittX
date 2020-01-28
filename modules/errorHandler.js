const config = require('../config.js');
const firebase = require('firebase-admin');
const serviceAccount = require(config.firebase.api_key);
const twitterPostErrorPath = 'twitterPostErrors/';
const apiCallErrorPath = 'apiErrors/';

module.exports = class ErrorLogHandler {
	constructor() {
		const date = new Date();
		this.error = {
			date: date.toLocaleDateString(),
			time: date.toLocaleTimeString(),
			errorInformation: {}
		}
	}

	writeNewApiErrorEntry = (error) => {
		this._setError(error);
		firebase.database().ref(apiCallErrorPath + error.apiName + '/').push(this.error);
	}

	writeNewPostErrorEntry = (error, twitterPostName) => {
		this._setError(error);
		firebase.database().ref(twitterPostErrorPath + twitterPostName + '/').push(this.error);
	}

	_setError = errorInformation => {
		this.error.errorInformation = errorInformation;
	}
}
