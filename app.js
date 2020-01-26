const Twit = require('twit');
const config = require('./config.js');
const nasa = require('./modules/nasa.js');
const spacex = require('./modules/spacex.js');
const firebase = require('./modules/firebase.js');
const schedule = require('node-schedule');
const T = new Twit(config.twitter);
const hashtags = ['space','universe','cosmos','stars'];

const Twitter = require('./modules/twitter');

// Twitter.makePictureOfTheDayPost();
// Twitter.makeNearestEarthObjectPost();
Twitter.makeLatestSpaceXLaunchPost();

/* Lets start to refactor this */


// //runs Picture of the Day job every day at 12pm
// const sPOTD = schedule.scheduleJob('0 12 * * *', () => {
// //Picture or video of the day post
// nasa.pictureOfTheDay.then(result => {
//     const hashtag = hashtags[Math.floor(Math.random()*hashtags.length)];
//     switch (result.mediaType) {
//         case 'video':
//             T.post('statuses/update', {status: 'Here is your #NASA video of the day #' + hashtag + '\n' + result.data }, (err, data, response) => {
//                 console.log('A new post with the status ´' + data.text + '` has successfully been posted at ' + new Date().toLocaleString('en'));
//             });
//             break;
//         case 'image':
//             T.post('media/upload', result.data, (err, data, response) => {
//                 T.post('statuses/update', {status: 'Here is your #NASA picture of the day #' + hashtag, media_ids: data.media_id_string}, (err2, data2, response2) => {
//                     console.log('A new post with the status ´' + data2.text + '` has successfull been posted at ' + new Date().toLocaleString('en'));
//                 });
//             });
//             break;
//     }
// }).catch(err => {
//   console.log(err);
// });
// console.log('POTD executed');
// });
//
// //runs NearEartObjects job every day at 5pm
// const sNEO = schedule.scheduleJob('0 17 * * *', () =>{
// //Post with NearEarthObjects API
// nasa.nearEarthObjects.then(result => {
//   T.post('statuses/update', {status: result.twitText }, (err, data, response) => {
//     console.log('NEO: The following text \"' + data.text + '\" has been successfully posted at ' + data.created_at + '.');
//   });
// }).catch(err => {
//   console.log(err);
// });
// console.log('NEO executed');
// });
//
//
// //runs SpaceX latest launch job every day at 1pm
// const sSXLL = schedule.scheduleJob('0 13 * * *', () => {
// //SpaceX latest launch post
// spacex.latestLaunch.then(result => {
//     //At first we have to check if a post containing result.launchDate already exists in our firebase db
//     firebase.spacex.latestLaunches.noEntryExists(result.launchDate).then(() => {
//         //If we get to this point, no entry exists and we can make a new post
//         const status = '#SpaceX Mission ' + result.missionName + ' launched successfully on ' + result.launchDate;
//         T.post('media/upload', result.data, (err, data, response) => {
//             T.post('statuses/update', {status: status, media_ids: data.media_id_string}, (err2, data2, response2) => {
//                 if(!err2) {
//                     //Here we want to make sure that only successfull posts go into our firebase db
//                     firebase.spacex.latestLaunches.writeEntry(data2.id, result.missionName, result.launchDate);
//                     console.log('A new post with the status ´' + data2.text + '` has successfully been posted to twitter at ' + new Date().toLocaleString('en'));
//                 }
//             });
//         });
//     }).catch(err => {
//         //If we get to this point, a record already exists and we dont do a new spaceX launch post
//         console.log(err);
//     // });
// }).catch(err => {
//     console.log(err);
// });
// console.log('SXLL executed');
// });
//
// //runs SpaceX next launch job every day at 2pm
// const sSXNL = schedule.scheduleJob('0 14 * * *', () => {
// //SpaceX next launch posts
// spacex.nextLaunch.then(result => {
//     firebase.spacex.nextLaunches.noEntryExists(result.launchDate).then(() => {
//         let status = 'The next SpaceX Mission ' + result.missionName + ' will launch on ' + result.launchDate + '. \n';
//         if(result.redditThread) {
//             status += 'Read more here: ' + result.redditThread;
//         }
//         T.post('statuses/update', {status: status}, (error, data, response) => {
//             if(!error) {
//                 firebase.spacex.nextLaunches.writeEntry(data.id, result.missionName, result.launchDate);
//                 console.log('A new post with the status ´' + data.text + '` has successfully been posted to twitter at ' + new Date().toLocaleString('en'));
//             }
//         });
//     }).catch(err => {
//         console.log(err);
//     });
// }).catch(err => {
//     console.log(err);
// });
// console.log('SXNL executed');
// });
