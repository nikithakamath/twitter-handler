'use strict';

const express = require('express');
const router = express.Router();
const request = require('request-promise');
const _ = require('lodash');

const oAuthConfig = require('../../helpers/config');
const User = require('../../models/user/userModel');
const Friend = require('../../models/friend/friendModel');

/**
 * @class UserService
 */
class UserService {
    /**
     * 
     * @param {Object} requestData 
     * @returns {Promise}
     */
    updateFriendList(requestData) {
        return new Promise((resolve, reject) => {
            let saveFriends;
            oAuthConfig.token = requestData.token;
            oAuthConfig.token_secret = requestData.token_secret;
            let options = {
                method: 'GET',
                uri: 'https://api.twitter.com/1.1/friends/list.json',
                oauth: oAuthConfig,
                qs: {
                    count: 200,
                }
            };
            let promises = [];
            promises.push(request(options));
            promises.push(Friend.find({user_id: requestData.id}));             
            Promise.all(promises)
                .then((results) => {
                    let apiResult = results[0];
                    let dbResult = results[1];
                    let res = JSON.parse(apiResult);
                    let {users} = res;
                    if(users.length == dbResult.length) {
                        // Friends list is not changed
                        return;
                    } else {
                        // Friends list is changed, add new friends only
                        let newFriends = _.differenceBy(users, dbResult, 'id');
                        if(newFriends.length > 0) {
                            saveFriends = newFriends.map(user => {
                                return ({
                                    id: user.id,
                                    name: user.name,
                                    screen_name: user.screen_name,
                                    profile_image_url_https: user.profile_image_url_https,
                                    user_id: requestData.id
                                });
                            });
                            return Friend.insertMany(saveFriends);
                        } else {
                            return;
                        }
                    }
                    
                })
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
    /**
     * 
     * @param {Object} requestData 
     * @param {String} uid 
     * @returns {Promise}
     */
    handleLogin(requestData, uid) {
        return new Promise((resolve, reject) => {
            let result;
            User.findOne({uid: uid})
                .then((user) => {
                    if(user) {
                        return user;
                    } else {
                        let newUser = new User({
                            _id: requestData.id,
                            name: requestData.name,
                            username: requestData.username,
                            screen_name: requestData.screen_name,
                            profile_image_url_https: requestData.profile_image_url_https,
                            joined_on: new Date(),
                            uid: uid
                        });
                        return newUser.save();
                    }
                })
                .then((userData) => {
                    delete userData.uid;
                    result = userData;
                    return this.updateFriendList(requestData);
                })
                .then(() => {
                    resolve(result);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}

const userServiceObj = new UserService();

module.exports.userServiceObj = userServiceObj;