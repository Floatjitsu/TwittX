const schedule = require('node-schedule');
const Twitter = require('./modules/twitter');
const ErrorLog = require('./errorLogHandler');

// Twitter.makePictureOfTheDayPost();
// Twitter.makeNearestEarthObjectPost();
// Twitter.makeLatestSpaceXLaunchPost();
// Twitter.makeNextSpaceXLaunchPost();
// Twitter.makeMarsRoverPicturePost();
const errorO = new ErrorLog();
Twitter._makeTextPost().then().catch(error => {
	errorO.writeNewErrorEntry(error);
});

/* Lets start to refactor this */
