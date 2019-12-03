const firebase = require('firebase-admin');
const config = require('../config.js')
const serviceAccount = require(config.firebase.api_key);

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: config.firebase.app_url
});

const writeTestData = () => {
    firebase.database().ref('spaceX/posts/0002').set({
        postId: 'ZzZZr789',
        posted: true,
        postDate: '2019-12-03'
    });
};

module.exports = {writeTestData};
