const schedule = require('node-schedule');
const Twitter = require('./modules/twitter');
const ErrorLog = require('./errorLogHandler');

// Twitter.makePictureOfTheDayPost();
// Twitter.makeNearestEarthObjectPost();
// Twitter.makeLatestSpaceXLaunchPost();
// Twitter.makeNextSpaceXLaunchPost();
// Twitter.makeMarsRoverPicturePost();
const error = new ErrorLog();
error.pushNewErrorMessage('Test Error2');

/* Lets start to refactor this */
