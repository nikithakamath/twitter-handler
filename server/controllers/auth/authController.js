'use strict';

const express = require('express');
const router = express.Router();
const {validationResult} = require('express-validator');

const userObj = require('../user/userController').userObj;
let firebaseAuth = require('../../services/firebase/auth');
let validator = require('../../helpers/validator');

/**
 * @class FeedController
 */
class AuthController {
    login(request, response) {
        let validationErr = validationResult(request);
        if (!validationErr.isEmpty()) {
            response.status(400).json({
                success: false,
                data: 'Invalid parameters'
            });
        } else {
            firebaseAuth.verifyUserAuth(request.headers)
                .then((uid) => {
                    return userObj.login(request.body, uid);
                })
                .then((userData) => {
                    response.status(201).json({
                        success: true,
                        data: userData
                    });
                })
                .catch((error) => {
                    response.status(400).json({
                        success: false,
                        data: error.message
                    });
                });
        }
    }
}

const authObj = new AuthController();

router.post('/login', validator.loginValidation, authObj.login);

module.exports.authObj = authObj;
module.exports.router = router;