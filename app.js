const Twit = require('twit');
const config = require('./config.js');
const nasa = require('./modules/nasa.js');

const T = new Twit(config.twitter);


//Picture of the day post
nasa.pictureOfTheDay.then(result => {
  //Upload the downloaded image to twitter
  T.post('media/upload', result, (err, data, reponse) => {
    //POST the picture URL on twitter
    T.post('statuses/update', {status: 'Here is your NASA picture of the day', media_ids: data.media_id_string}, (error, data2, reponse2) => {
      console.log(data2);
    });
  });
}).catch(err => {
  console.log(err);
});
