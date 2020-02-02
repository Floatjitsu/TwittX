const firebase = require('firebase-admin');
const config = require('../config.js');
const serviceAccount = require(config.firebase.api_key);

const latestLaunchesPath = 'spaceX/posts/latestLaunches/';
const nextLaunchesPath = 'spaceX/posts/nextLaunches/';

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: config.firebase.app_url
});

let launchInformation = {
    missionName: '',
    launchDate: '',
    postDate: null
};

const spacex = {
    latestLaunches: {
        writeEntry: (postId, missionName, launchDate) => {
            _setLaunchInformation(missionName, launchDate);
            _writeFirebaseEntry(latestLaunchesPath + postId, launchInformation);
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
            _setLaunchInformation(missionName, launchDate);
            _writeFirebaseEntry(nextLaunchesPath + postId, launchInformation);
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

const _writeFirebaseEntry = (path, entryObject) => {
    firebase.database().ref(path).set(entryObject);
};

const _setLaunchInformation = (missionName, launchDate) => {
    launchInformation.missionName = missionName;
    launchInformation.launchDate = launchDate;
    launchInformation.postDate = new Date().toLocaleString('en')
};

module.exports = {spacex};
