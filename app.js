const Twit = require('twit');
const config = require('./config.js');
const nasa = require('./modules/nasa.js');

const T = new Twit(config.twitter);

//Picture of the day post
nasa.pictureOfTheDay.then(result => {
  //POST the picture URL on Twitter
  T.post('statuses/update', { status: result.url }, (err, data, reponse) => {
    console.log(data);
  });
}).catch(err => {
  console.log(err);
});
