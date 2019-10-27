import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import {Button, Typography} from '@material-ui/core';
import {Twitter} from '@material-ui/icons';

import HomeActions from '../Home/actions';
import {auth, twitterProvider} from '../../services/FirebaseService';


class Home extends Component {
    constructor(props) {
        super(props);
        this.twitterLogin = this.twitterLogin.bind(this);
    }
    
    twitterLogin() {
        auth.signInWithPopup(twitterProvider)
            .then((result) => {
                let token = result.credential.accessToken;
                let secret = result.credential.secret;
                localStorage.setItem('USER_TOKEN', token);
                localStorage.setItem('USER_SECRET', secret);
                localStorage.setItem('FB_TOKEN', result.user.ma);
                // The signed-in user info.
                let user = result.user;
                return HomeActions.userLogin(result.additionalUserInfo, token, secret);
            })
            .then((user) => {
                localStorage.setItem('USER_ID', user.data._id);
                this.props.history.push('/feed');
            })
            .catch(function(error) {
                // Handle Errors here.
                let errorCode = error.code;
                let errorMessage = error.message;
                // The email of the user's account used.
                let email = error.email;
                alert('Sign up failed');
            });
    }

    render() {
      return (
        <div  style= {{padding: "70px"}}>
            <Button
                variant="contained"
                color="primary"
                startIcon={<Twitter />}
                onClick={this.twitterLogin}
               
            >
                Login with Twitter
            </Button>
        </div>
      );
    }
}

export default withRouter(Home);
