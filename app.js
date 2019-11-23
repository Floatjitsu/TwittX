var Twit = require('twit');
var config = require('./config.js');

var T = new Twit(config);

T.post('statuses/update', { status: 'Hello World! 🚀🐦' }, function(err, data, reponse) {
  console.log(data)
})
