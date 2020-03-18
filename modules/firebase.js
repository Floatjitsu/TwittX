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
                _checkEntryExistence(latestLaunchesPath, launchDate)
                    .then(() => resolve())
                    .catch(error => reject(error));
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
                _checkEntryExistence(nextLaunchesPath, launchDate)
                    .then(() => resolve())
                    .catch(error => reject(error));
            });
        }
    }
};

const _checkEntryExistence = (path, launchDate) => {
    return new Promise((resolve, reject) => {
        firebase.database().ref(path).orderByChild('launchDate').equalTo(launchDate)
            .once('value').then(snapshot => {
                if (snapshot.exists()) {
                    reject('A post for the launch date ' + launchDate + ' with firebase path ' + path + ' already exists!');
                } else {
                    resolve();
                }
            });
    });
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
