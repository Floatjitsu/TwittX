const config = require('../config.js');
const firebase = require('firebase-admin');
const serviceAccount = require(config.firebase.api_key);
const firebasePostErrorPath = 'twitter/postErrors/';

module.exports = class ErrorLogHandler {
	constructor() {
		const date = new Date();
		this.error = {
			date: date.toLocaleDateString(),
			time: date.toLocaleTimeString(),
			errorInformation: {}
		}
	}

	writeNewErrorEntry = (error, twitterPostName) => {
		this.setError(error);
		this.setErrorTwitterPostName(twitterPostName);
		firebase.database().ref(firebasePostErrorPath).push(this.error);
	}

	setError = errorInformation => {
		this.error.errorInformation = errorInformation;
	}

	setErrorTwitterPostName = twitterPostName => {
		this.error.twitterPostName = twitterPostName;
	}
}
