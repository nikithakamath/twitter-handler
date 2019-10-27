const {check} = require('express-validator');

module.exports = {
    loginValidation: [
        check('id').isInt(),
        check('name').not().isEmpty(),
        check('username').not().isEmpty(),
        check('screen_name').not().isEmpty(),
        check('profile_image_url_https').not().isEmpty()
    ],
    getFeedValidation: [
        check('user_id').isInt()
    ],
    loadTweetsValidation: [
        check('user_id').isInt(),
        check('token').not().isEmpty(),
        check('token_secret').not().isEmpty()
    ],
    searchTweetsValidation: [
        check('user_id').isInt(),
        check('hashtag').not().isEmpty(),
    ],
    filterTweetsValidation: [
        check('user_id').isInt(),
        check('location').not().isEmpty(),
    ]
}