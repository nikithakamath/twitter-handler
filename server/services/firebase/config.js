'use strict';

const admin = require('firebase-admin');

// Firebase Project configurations
const serviceAccount =
    require('./key.json');

const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL,
});

module.exports.firebaseApp = firebaseApp;
