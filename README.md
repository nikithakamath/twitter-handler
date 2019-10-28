# twitter-handler
The backend of twitter handler built in Node.js. This app exposes APIs for Login with Twitter, loading tweets from Twitter and performing operations on Tweets.

## Getting started
Please follow the instructions to get started with this application

### Prerequisites
* Download and install [Node.js](https://nodejs.org/en/download/)
* Create MongoDB Atlas account [MongoDB](https://docs.atlas.mongodb.com/getting-started/)
* Create [Firebase account](https://firebase.google.com/)

### Installation
* Clone this repo : git clone https://github.com/nikithakamath/twitter-handler.git
* Set up Firebase
* Set up MongoDB
* Run ```npm install```

## Firebase set up
* Please follow the steps mentioned here to set up Firebase Admin SDK : https://firebase.google.com/docs/admin/setup
* Add the Firebase JSON file key value pairs and database URL to *.env* file

## MySQL set up
Add MongoDB connection string URL to *.env* file

## Local deployment
To run locally, run the command ```npm start```

## Production deployment to Heroku
* Create [Heroku account](https://signup.heroku.com/dc)
* Follow instructions on [Getting started with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
* Command to deploy code into Heroku ```git push heroku master```

