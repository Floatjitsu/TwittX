const schedule = require('node-schedule');
const Twitter = require('./modules/twitter');
const ErrorHandler = require('./modules/errorHandler');

// Twitter.makePictureOfTheDayPost();
// Twitter.makeNearestEarthObjectPost();
// Twitter.makeLatestSpaceXLaunchPost();
// Twitter.makeNextSpaceXLaunchPost();
// Twitter.makeMarsRoverPicturePost();
const errorHandler = new ErrorHandler();
Twitter._uploadMedia().catch( error => errorHandler.writeNewErrorEntry(error) );


/* Lets start to refactor this */
