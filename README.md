# TwittX-Bot

### A Twitter Bot that tweets information provided by NASA and SpaceX

### Twitter Account
https://twitter.com/TwittX15

### How it works
The bot is deployed on a VPS Server (Ubuntu 18.04).
The scripts you see in the repository are responsible for the tweets, each script for one tweet.
Every script is bound to one crontab job on the server (https://linux.die.net/man/1/crontab).

#### Getting started
To start developing, you'll need to include a .env file and a Firebase-API file in the root directory of this repository.
Contact the owner of this repo to receive the specified files.
The app.js file is for testing purposes only. You can comment one line out to test one tweet.

Ressources:
* https://api.nasa.gov/
* https://docs.spacexdata.com/?version=latest
* https://developer.twitter.com/en/docs/api-reference-index
* https://www.npmjs.com/package/twitter
