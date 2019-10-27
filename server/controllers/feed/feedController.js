'use strict';

const express = require('express');
const router = express.Router();
const {validationResult} = require('express-validator');

const feedService = require('../../services/feed/feedService').feedServiceObj;
let validator = require('../../helpers/validator');

/**
 * @class FeedController
 */
class FeedController {
    /**
     * 
     * @param {Object} request 
     * @param {Object} response 
     */
    getFeed(request, response) {
        let validationErr = validationResult(request);
        if (!validationErr.isEmpty()) {
            response.status(400).json({
                success: false,
                data: 'Invalid parameters'
            });
        } else {
            feedService.getFeed(request.query)
                .then((feedList) => {
                    response.status(200).json({
                        data: feedList
                    });
                })
                .catch((error) => {
                    console.error(error);
                    response.status(404).json({
                        data: error.message
                    });
                });
        }
    }
    /**
     * 
     * @param {Object} request 
     * @param {Object} response 
     */
    loadTweets(request, response) {
        let validationErr = validationResult(request);
        if (!validationErr.isEmpty()) {
            response.status(400).json({
                success: false,
                data: 'Invalid parameters'
            });
        } else {
            feedService.loadTweets(request.query)
                .then((tweets) => {
                    response.status(200).json({
                        data: tweets
                    });
                })
                .catch((error) => {
                    // console.error(error);
                    response.status(404).json({
                        data: error.message
                    });
                });
        }
    }
    /**
     * 
     * @param {Object} request 
     * @param {Object} response 
     */
    searchTweets(request, response) {
        let validationErr = validationResult(request);
        if (!validationErr.isEmpty()) {
            response.status(400).json({
                success: false,
                data: 'Invalid parameters'
            });
        } else {
            feedService.searchTweets(request.query)
                .then((tweets) => {
                    response.status(200).json({
                        data: tweets
                    });
                })
                .catch((error) => {
                    // console.error(error);
                    response.status(404).json({
                        data: error.message
                    });
                });
        }
    }
    /**
     * 
     * @param {Object} request 
     * @param {Object} response 
     */
    filterTweets(request, response) {
        let validationErr = validationResult(request);
        if (!validationErr.isEmpty()) {
            response.status(400).json({
                success: false,
                data: 'Invalid parameters'
            });
        } else {
            feedService.filterTweets(request.query)
                .then((tweets) => {
                    response.status(200).json({
                        data: tweets
                    });
                })
                .catch((error) => {
                    // console.error(error);
                    response.status(404).json({
                        data: error.message
                    });
                });
        }
    }
    /**
     * 
     * @param {Object} request 
     * @param {Object} response 
     */
    getTweetsWithLink(request, response) {
        let validationErr = validationResult(request);
        if (!validationErr.isEmpty()) {
            response.status(400).json({
                success: false,
                data: 'Invalid parameters'
            });
        } else {
            feedService.getTweetsWithLink(request.query)
                .then((tweets) => {
                    response.status(200).json({
                        data: tweets
                    });
                })
                .catch((error) => {
                    // console.error(error);
                    response.status(404).json({
                        data: error.message
                    });
                });
        }
    }
}

const feedObj = new FeedController();

router.get('/', validator.getFeedValidation, feedObj.getFeed);
router.get('/load', validator.loadTweetsValidation, feedObj.loadTweets);
router.get('/search', validator.searchTweetsValidation, feedObj.searchTweets);
router.get('/filter', validator.filterTweetsValidation, feedObj.filterTweets);
router.get('/links', validator.getFeedValidation, feedObj.getTweetsWithLink);

module.exports.feedObj = feedObj;
module.exports.router = router;