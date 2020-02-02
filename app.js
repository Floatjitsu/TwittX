const Scheduler = require('./modules/scheduler');
const Twitter = require('./modules/twitter');

Scheduler.scheduleNasaPictureOfTheDayPost();

// Twitter.makePictureOfTheDayPost();
// Twitter.makeNearestEarthObjectPost();
Twitter.makeLatestSpaceXLaunchPost();
Twitter.makeNextSpaceXLaunchPost();
// Twitter.makeMarsRoverPicturePost();
