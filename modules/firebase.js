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

const spacex = {
    launches: {
        writeEntry: (postId, missionName, launchDate) => {
            firebase.database().ref('spaceX/posts/launches/' + postId).set({
                missionName: missionName,
                launchDate: launchDate,
                postDate: getToday()
            });
        },
        noEntryExists: (postDate) => {
            return new Promise((resolve, reject) => {
                firebase.database().ref('spaceX/posts/launches/').orderByChild('launchDate').equalTo(postDate)
                    .once('value').then(snapshot => {
                        if(snapshot.exists()) {
                            reject('A post for the date ' + postDate + ' already exists!');
                        } else {
                            resolve();
                        }
                    });
            });
        }
    }
};

const getToday = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    return month + '/' + day + '/' + year + ' ' + today.toLocaleTimeString('en');
}

module.exports = {writeTestData, spacex};
