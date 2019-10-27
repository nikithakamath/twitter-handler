'use strict';

const request = require('request-promise');
const Feed = require('../../models/feed/feedModel');
   
const oAuthConfig = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
};

class FeedService {
    getFeed(queryObj) {
        return new Promise((resolve, reject) => {
            // Feed.find({user_id: queryObj.user_id})
            Feed.find(
                { $and:[
                    {
                        created_at: {$gte: (new Date((new Date()).getTime() - (7 * 24 * 60 * 60 * 1000)))}
                    },
                    {
                        user_id: queryObj.user_id
                    }
                ]})
            .then((feedList) => {
                    resolve(feedList);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
    loadTweets(queryObj) {
        return new Promise((resolve, reject) => {
            let saveData;
            oAuthConfig.token = queryObj.token;
            oAuthConfig.token_secret = queryObj.token_secret;
            let options = {
                method: 'GET',
                uri: 'https://api.twitter.com/1.1/statuses/home_timeline.json',
                // uri: 'https://api.twitter.com/1.1/search/tweets.json',
                oauth: oAuthConfig,
                qs: {
                    count: 200
                    // q: ''
                }
            };
            Feed.findOne({user_id: queryObj.user_id}).sort({_id: -1})
                .then((tweet) => {
                    if(tweet) {
                        // This id is of latest tweet
                        options.qs.since_id = tweet._id;
                    }
                    console.log(options);
                    return request(options);
                })
                .then((data) => {
                    let res = JSON.parse(data);
                    // let {statuses, search_metadata} = res;
                    saveData = res.map(tweet => {
                        return ({
                            _id: tweet.id,
                            text: tweet.text,
                            created_at: tweet.created_at,
                            name: tweet.user.name,
                            profile_banner_url: tweet.user.profile_banner_url,
                            location: tweet.place,
                            hashtags: tweet.entities.hashtags.map(item => {
                                return item.text;
                            }),
                            urls: tweet.entities.urls.map(item => {
                                return item.url;
                            }),
                            user_id: queryObj.user_id
                        });
                    });
                    console.log(saveData);
                    return Feed.insertMany(saveData);
                })
                .then(() => {
                    resolve(saveData);
                })
                .catch((error) => {
                    console.log(error);
                    if(error.err.code && error.err.code == 11000) {
                        resolve(saveData);
                    } else {
                        reject(error);
                    }
                });
        });
    }
    searchTweets(queryObj) {
        return new Promise((resolve, reject) => {
            Feed.find({
                hashtags: queryObj.hashtag,
                user_id: queryObj.user_id,
                created_at: {$gte: (new Date((new Date()).getTime() - (1 * 24 * 60 * 60 * 1000)))}
            }).then((feedList) => {
                console.log(feedList.length);
                resolve(feedList);
            })
            .catch((error) => {
                reject(error);
            });
        });
    }
    filterTweets(queryObj) {
        return new Promise((resolve, reject) => {
            Feed.find({$and:[
                {$text: { $search: queryObj.location}},
                {user_id: queryObj.user_id},
                {created_at: {$gte: (new Date((new Date()).getTime() - (1 * 24 * 60 * 60 * 1000)))}}
            ]})
                .then((feedList) => {
                    console.log(feedList.length);
                    resolve(feedList);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
    getTweetsWithLink(queryObj) {
        return new Promise((resolve, reject) => {
            Feed.find({$and:[{urls: { $exists: true, $ne: []}},{user_id: queryObj.user_id}]})
            // Feed.find({urls: { $exists: true, $ne: []}})
                .then((feedList) => {
                    resolve(feedList);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}

const feedServiceObj = new FeedService();

module.exports.feedServiceObj = feedServiceObj;