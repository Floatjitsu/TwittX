const firebase = require('firebase-admin');
const config = require('../config.js')
const serviceAccount = require(config.firebase.api_key);

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: config.firebase.app_url
});

const spacex = {
    latestLaunches: {
        writeEntry: (postId, missionName, launchDate) => {
            firebase.database().ref('spaceX/posts/latestLaunches/' + postId).set({
                missionName: missionName,
                launchDate: launchDate,
                postDate: new Date().toLocaleString('en')
            });
        },
        noEntryExists: (launchDate) => {
            return new Promise((resolve, reject) => {
                firebase.database().ref('spaceX/posts/latestLaunches/').orderByChild('launchDate').equalTo(launchDate)
                    .once('value').then(snapshot => {
                        if(snapshot.exists()) {
                            reject('A post for the latest launch date ' + launchDate + ' already exists!');
                        } else {
                            resolve();
                        }
                    });
            });
        }
    },
    nextLaunches: {
        writeEntry: (postId, missionName, launchDate) => {
            firebase.database().ref('spaceX/posts/nextLaunches/' + postId).set({
                missionName: missionName,
                launchDate: launchDate,
                postDate: new Date().toLocaleString('en')
            });
        },
        noEntryExists: (launchDate) => {
            return new Promise((resolve, reject) => {
                firebase.database().ref('spaceX/posts/nextLaunches/').orderByChild('launchDate').equalTo(launchDate)
                    .once('value').then(snapshot => {
                        if(snapshot.exists()) {
                            reject('A post for the upcoming launch date ' + launchDate + ' already exists!');
                        } else {
                            resolve();
                        }
                    });
            });
        }
    }
};

module.exports = {spacex};
