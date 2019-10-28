const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    _id: Number,
    name: String,
    username: String,
    screen_name: String,
    profile_image_url_https: String,
    joined_on: Date,
    uid: String
});

const User = mongoose.model('user', UserSchema)

module.exports = User;