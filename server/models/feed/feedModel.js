const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedSchema = new Schema({
    _id: Number,
    text: String,
    hashtags: [String],
    name: String,
    created_at: Date,
    urls: [String],
    profile_banner_url: String,
    location: String,
    user_id: Number
});

const Feed = mongoose.model('tweet', FeedSchema)

module.exports = Feed;