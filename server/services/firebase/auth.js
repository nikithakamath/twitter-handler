'use strict';

let config = require('./config');

/**
 * @class FirebaseAuth
 */
class FirebaseAuth {
    /**
     * @constructor
     */
    constructor() {
        this.admin = config.firebaseApp;
    }
    /**
     * 
     * @param {Object} headers 
     * @returns {Promise}
     */
    verifyUserAuth(headers) {
        return new Promise((resolve, reject) => {
            let accessToken = headers.authorization.replace('Bearer ', '');
            // Verify it with Firebase
            this.admin.auth().verifyIdToken(accessToken)
                .then((decodedToken) => {
                    resolve(decodedToken.uid);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}

let firebaseAuthObj = new FirebaseAuth();

module.exports = firebaseAuthObj;
