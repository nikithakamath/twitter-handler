'use strict';

const express = require('express');
const router = express.Router();

const User = require('../../models/user/userModel');

/**
 * @class UserService
 */
class UserService {
    handleLogin(requestData, uid) {
        return new Promise((resolve, reject) => {
            User.findOne({uid: uid})
                .then((user) => {
                    console.log(user);
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
                    resolve(userData);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}

const userServiceObj = new UserService();

module.exports.userServiceObj = userServiceObj;