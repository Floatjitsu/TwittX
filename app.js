const Scheduler = require('./modules/scheduler');
const Twitter = require('./modules/twitter');

// Scheduler.scheduleNasaPictureOfTheDayPost();
// Scheduler.scheduleNasaNearestEarthObjectPost();
// Scheduler.scheduleNasaMarsRoverPicturePost();
// Scheduler.scheduleSpacexLatestLaunchPost();
// Scheduler.scheduleSpacexNextLaunchPost();

Twitter.makePictureOfTheDayPost();
// Twitter.makeNearestEarthObjectPost();
// Twitter.makeLatestSpaceXLaunchPost();
// Twitter.makeNextSpaceXLaunchPost();
// Twitter.makeMarsRoverPicturePost();
