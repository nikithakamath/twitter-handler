const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FriendSchema = new Schema({
    id: Number,
    name: String,
    screen_name: String,
    profile_image_url_https: String,
    user_id: Number
});

const Friend = mongoose.model('friend', FriendSchema)

module.exports = Friend;