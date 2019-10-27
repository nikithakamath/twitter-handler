'use strict';

const express = require('express');
const router = express.Router();

const userService = require('../../services/user/userService').userServiceObj;

/**
 * @class UserController
 */
class UserController {
    login(requestData, uid) {
        return new Promise((resolve, reject) => {
            userService.handleLogin(requestData, uid)
                .then((userData) => {
                    resolve(userData);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}

const userObj = new UserController();

module.exports.userObj = userObj;
module.exports.router = router;