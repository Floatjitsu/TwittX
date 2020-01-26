const fs = require('fs');
const errorFileName = './errorLog.json'
const ErrorLog = require(errorFileName);

module.exports = class ErrorLogHandler {
	constructor() {
		const date = new Date();
		this.error = {
			date: date.toLocaleDateString(),
			time: date.toLocaleTimeString(),
			message: ''
		}
	}

	pushNewErrorMessage = message => {
		this.error.message = message;
		ErrorLog.errors.push(this.error);
		fs.writeFile(errorFileName, this.getErrorLogStringified(), 'utf8', (err) => {
			console.log('wrote to file');
		});
	}

	getErrorLogStringified = () => {
		return JSON.stringify(ErrorLog, null, 2);
	}
}
