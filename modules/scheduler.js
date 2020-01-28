const schedule = require('node-schedule');
const Twitter = require('./twitter');

const scheduleTimes = {
	everyDayNineAm: '0 9 * * *'
}

const scheduleNasaPictureOfTheDayPost = () => {
	schedule.scheduleJob(scheduleTimes.everyDayNineAm, () => {
		Twitter.makePictureOfTheDayPost();
	});
}

module.exports = {
	scheduleNasaPictureOfTheDayPost
};
