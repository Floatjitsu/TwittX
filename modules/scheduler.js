const schedule = require('node-schedule');
const Twitter = require('./twitter');

const scheduleTimes = {
	everyDayNineAm: '0 9 * * *',
	everyDayNoon: '0 12 * * *',
	everySundayOnePm: '0 13 * * 7',
	everyMondayOnePm: '0 13 * * 1'
};

const scheduleNasaPictureOfTheDayPost = () => {
	schedule.scheduleJob(scheduleTimes.everyDayNineAm, () => {
		Twitter.makePictureOfTheDayPost();
	});
};

const scheduleNasaNearestEarthObjectPost = () => {
	schedule.scheduleJob(scheduleTimes.everyDayNoon, () => {
		Twitter.makeNearestEarthObjectPost();
	});
};

const scheduleNasaMarsRoverPicturePost = () => {
	let timeRule = new schedule.RecurrenceRule();
	timeRule.dayOfWeek = [2, 6]; //Tuesday and Saturday
	timeRule.hour = 18;
	timeRule.minute = 0;

	schedule.scheduleJob(timeRule, () => {
		Twitter.makeMarsRoverPicturePost();
	});
};

const scheduleSpacexLatestLaunchPost = () => {
	schedule.scheduleJob(scheduleTimes.everySundayOnePm, () => {
		Twitter.makeLatestSpaceXLaunchPost();
	});
};

const scheduleSpacexNextLaunchPost = () => {
	schedule.scheduleJob(scheduleTimes.everyMondayOnePm, () => {
		Twitter.makeNextSpaceXLaunchPost();
	});
};

module.exports = {
	scheduleNasaPictureOfTheDayPost,
	scheduleNasaNearestEarthObjectPost,
	scheduleNasaMarsRoverPicturePost,
	scheduleSpacexLatestLaunchPost,
	scheduleSpacexNextLaunchPost
};
