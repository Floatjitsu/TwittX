const Twit = require('twit');
const config = require('./config.js');
const nasa = require('./modules/nasa.js');

const T = new Twit(config.twitter);

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
