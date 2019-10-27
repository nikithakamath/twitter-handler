import React, {Component} from 'react';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import {AppBar, Toolbar, Typography}  from '@material-ui/core';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';


import {auth, twitterProvider} from '../../services/FirebaseService';


export default class Navbar extends Component {
    constructor(props) {
        super(props);
        this.logoutUser = this.logoutUser.bind(this);
        
    }
    logoutUser() {
      auth.signOut()
        .then(() => {

        })
        .catch((error) => {

        })
    }
    
    render() {
        return (
          <div>
            <AppBar position="static">
              <Toolbar>
                <Link to="/feed" style={{ textDecoration: 'none', color: 'white'}}>
                  <Typography variant="h6">Twitter Handler</Typography>
                </Link>
                {/* <Button color="inherit" padding-left="70%" onClick={this.twitterLogin}>Login</Button> */}
              </Toolbar>
            </AppBar>
          </div>
        );
    }
}

// export default withRouter(Navbar);
