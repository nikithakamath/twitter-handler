'use strict';

const admin = require('firebase-admin');

// Firebase Project configurations
const serviceAccount =
    require('./key.json');

const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert({
  "type": "service_account",
  "project_id": process.env.FIREBASE_PROJECT_ID,
  "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
  "private_key": process.env.FIREBASE_PRIVATE_KEY,
  "client_email": process.env.FIREBASE_CLIENT_EMAIL,
  "client_id": process.env.FIREBASE_CLIENT_ID,
  "auth_uri": process.env.FIREBASE_AUTH_URI,
  "token_uri": process.env.FIREBASE_TOKEN_URI,
  "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER,
  "client_x509_cert_url": process.env.FIREBASE_CLIENT_CERT
  }),
  databaseURL: process.env.FIREBASE_DB_URL,
});

module.exports.firebaseApp = firebaseApp;
