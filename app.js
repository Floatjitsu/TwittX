const Twit = require('twit');
const config = require('./config.js');

const T = new Twit(config);

T.post('statuses/update', { status: 'Hello World! 🚀🐦' }, (err, data, reponse) => {
  console.log(data);
});
