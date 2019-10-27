'use strict';

const request = require('request-promise');
const Feed = require('../../models/feed/feedModel');
const Friend = require('../../models/friend/friendModel');

const oAuthConfig = require('../../helpers/config');

/**
 * @class FeedService
 */
class FeedService {
    /**
     * 
     * @param {Object} queryObj 
     * @returns {Promise}
     */
    getFeed(queryObj) {
        return new Promise((resolve, reject) => {
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
    /**
     * 
     * @param {Object} queryObj 
     * @returns {Promise}
     */
    loadTweets(queryObj) {
        return new Promise((resolve, reject) => {
            let saveData;
            oAuthConfig.token = queryObj.token;
            oAuthConfig.token_secret = queryObj.token_secret;
            let options = {
                method: 'GET',
                uri: 'https://api.twitter.com/1.1/statuses/home_timeline.json',
                oauth: oAuthConfig,
                qs: {
                    count: 200
                }
            };
            Feed.findOne({user_id: queryObj.user_id}).sort({_id: -1})
                .then((tweet) => {
                    if(tweet) {
                        // This id is of latest tweet
                        options.qs.since_id = tweet._id;
                    }
                    return request(options);
                })
                .then((data) => {
                    let res = JSON.parse(data);
                    saveData = res.map(tweet => {
                        return ({
                            _id: tweet.id,
                            text: tweet.text,
                            created_at: tweet.created_at,
                            name: tweet.user.name,
                            profile_banner_url: tweet.user.profile_banner_url,
                            location: tweet.place ? tweet.place.full_name : null,
                            hashtags: tweet.entities.hashtags.map(item => {
                                return item.text;
                            }),
                            urls: tweet.entities.urls.map(item => {
                                return item.url;
                            }),
                            user_id: queryObj.user_id
                        });
                    });
                    return Feed.insertMany(saveData);
                })
                .then(() => {
                    resolve(saveData);
                })
                .catch((error) => {
                    if(error.err && error.err.code == 11000) {
                        resolve(saveData);
                    } else {
                        reject(error);
                    }
                });
        });
    }
    /**
     * 
     * @param {Object} queryObj 
     * @returns {Promise}
     */
    searchTweets(queryObj) {
        return new Promise((resolve, reject) => {
            Feed.find({
                hashtags: queryObj.hashtag,
                user_id: queryObj.user_id,
                created_at: {$gte: (new Date((new Date()).getTime() - (7 * 24 * 60 * 60 * 1000)))}
            }).then((feedList) => {
                resolve(feedList);
            })
            .catch((error) => {
                reject(error);
            });
        });
    }
    /**
     * 
     * @param {Object} queryObj 
     * @returns {Promise}
     */
    filterTweets(queryObj) {
        return new Promise((resolve, reject) => {
            Feed.find({$and:[
                {$text: { $search: queryObj.location}},
                {user_id: queryObj.user_id},
                {created_at: {$gte: (new Date((new Date()).getTime() - (7 * 24 * 60 * 60 * 1000)))}}
            ]}).then((feedList) => {
                    resolve(feedList);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
    /**
     * 
     * @param {Object} queryObj 
     * @returns {Promise}
     */
    getTweetsWithLink(queryObj) {
        return new Promise((resolve, reject) => {
            Feed.find({$and:[
                {urls: { $exists: true, $ne: []}},
                {user_id: queryObj.user_id},
                {created_at: {$gte: (new Date((new Date()).getTime() - (7 * 24 * 60 * 60 * 1000)))}}
            ]}).then((feedList) => {
                    resolve(feedList);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
    /**
     * 
     * @param {Object} options 
     * @param {Array} friendList 
     * @param {String} user_id 
     */
    async getFriendsTweets(options, friendList, user_id) {
        try {
            let url = options.uri;
            let loop = true;
            let finalData = [];
            while(loop) {
                let tempData;
                let results = await request(options);
                let parsed = JSON.parse(results);
                let {statuses, search_metadata} = parsed;
                console.log(search_metadata);
                tempData = statuses.filter((item1) => {
                    console.log('from all');
                    // console.log(item1.user.name);
                    return friendList.some(function(item2){
                        return item1.user.id === item2.id;
                    });
                }).map(tweet => {
                    console.log('from friends');
                    console.log(tweet.user_id.name);
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
                        user_id: user_id
                    });
                });
                finalData = finalData.concat(tempData);
                // console.log(search_metadata.next_results);
                options.uri = url + search_metadata.next_results;
                if(options.uri == url) {
                    loop = false;
                }
            }
            return finalData;
        } catch(error) {
            return error;
        }
    }
    /**
     * 
     * @param {Object} queryObj 
     */
    loadTweetsFromSearchAPI(queryObj) {
        return new Promise((resolve, reject) => {
            let finalData;
            oAuthConfig.token = queryObj.token;
            oAuthConfig.token_secret = queryObj.token_secret;
            let options = {
                method: 'GET',
                // uri: 'https://api.twitter.com/1.1/statuses/home_timeline.json',
                uri: 'https://api.twitter.com/1.1/search/tweets.json',
                oauth: oAuthConfig,
                qs: {
                    count: 100,
                    q: 'http'
                }
            };
            Feed.findOne({user_id: queryObj.user_id}).sort({_id: -1})
                .then((tweet) => {
                    if(tweet) {
                        // This id is of latest tweet
                        options.qs.since_id = tweet._id;
                    }
                    return Friend.find({user_id: queryObj.user_id});
                })
                .then((friendList) => {
                    return this.getFriendsTweets(options, friendList, queryObj.user_id);
                })
                .then((friendsTweets) => {
                    finalData = friendsTweets;
                    return Feed.insertMany(finalData);
                })
                .then(() => {
                    resolve(finalData);
                })
                .catch((error) => {
                    if(error.err.code && error.err.code == 11000) {
                        resolve(finalData);
                    } else if(error.error.errors[0].code == 88) {
                        
                    } else {
                        reject(error);
                    }
                });
        });
    }
}

const feedServiceObj = new FeedService();

module.exports.feedServiceObj = feedServiceObj;