const Twit = require('twit');
const config = require('./config.js');
const nasa = require('./modules/nasa.js');
const spacex = require('./modules/spacex.js');
const firebase = require('./modules/firebase.js');
const T = new Twit(config.twitter);
/*
//Picture or video of the day post
nasa.pictureOfTheDay.then(result => {
    switch (result.mediaType) {
        case 'video':
            T.post('statuses/update', {status: 'Here is your NASA video of the day \n' + result.data }, (err, data, response) => {
                console.log(data);
            });
            break;
        case 'image':
            T.post('media/upload', result.data, (err, data, response) => {
                T.post('statuses/update', {status: 'Here is your NASA picture of the day', media_ids: data.media_id_string}, (err2, data2, response2) => {
                    console.log(data2);
                });
            });
            break;
    }
}).catch(err => {
  console.log(err);
});
*/
//SpaceX latest launch post
spacex.latestLaunch.then(result => {
    //At first we have to check if a post containing result.launchDate already exists in our firebase db
    firebase.spacex.latestLaunches.noEntryExists(result.launchDate).then(() => {
        //If we get to this point, no entry exists and we can make a new post
        const status = 'SpaceX Mission ' + result.missionName + ' launched successfully on ' + result.launchDate;
        T.post('media/upload', result.data, (err, data, response) => {
            T.post('statuses/update', {status: status, media_ids: data.media_id_string}, (err2, data2, response2) => {
                if(!err2) {
                    //Here we want to make sure that only successfull posts go into our firebase db
                    firebase.spacex.latestLaunches.writeEntry(data2.id, result.missionName, result.launchDate);
                    console.log(data2);
                }
            });
        });
    }).catch(err => {
        //If we get to this point, a record already exists and we dont do a new spaceX launch post
        console.log(err);
    });
}).catch(err => {
    console.log(err);
});

//SpaceX next launch posts
spacex.nextLaunch.then(result => {
    console.log(result);
}).catch(err => {
    console.log(err);
});
