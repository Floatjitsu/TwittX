const firebase = require('firebase-admin');
const config = require('../config.js')
const serviceAccount = require(config.firebase.api_key);

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: config.firebase.app_url
});

const spacex = {
    launches: {
        writeEntry: (postId, missionName, launchDate) => {
            firebase.database().ref('spaceX/posts/launches/' + postId).set({
                missionName: missionName,
                launchDate: launchDate,
                postDate: new Date().toLocaleString('en')
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

module.exports = {spacex};
