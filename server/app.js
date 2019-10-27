'use strict';

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');

const port = process.env.PORT;

let corsOption = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
};

app.use(cors(corsOption));
app.use(bodyParser.json());

app.use(require('./routes'));



// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {useUnifiedTopology: true, useNewUrlParser:true});
mongoose.connection.on('connected', () => {
  console.log('MongoDB connection successful');
  // Listen to port
  if(process.env.NODE_ENV === 'development') {
    app.listen(port, () => console.log(`App is listening on port ${port}`));
  }
}).on('error', (error) => {
  console.log('MongoDB connection failed due to the error: ', error);
}).on('disconnected', () => {
  console.log('MongoDB connection disconnected');
});

module.exports = app;
