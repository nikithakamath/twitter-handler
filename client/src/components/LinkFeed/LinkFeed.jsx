import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import {Typography} from '@material-ui/core';

import FeedActions from '../Feed/actions';
import styles from '../Feed/Feed.module.scss';
import {auth} from '../../services/FirebaseService';


class LinkFeed extends Component {
    constructor(props) {
        super(props);
        this.state = {linkResults: []};
    }
    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if(!user) {
                this.props.history.push('/');
            } else {
                FeedActions.loadTweetsWithLink()
                    .then((result) => {
                        let actualTweets = result.data;
                        if(actualTweets.length > 0) {
                            this.setState({linkResults: actualTweets});
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        });
    }
    render() {
        const result = this.state.linkResults;
        const userFeed = result.length ?
        <>
            <Typography variant="h6" gutterBottom>Showing {this.state.linkResults.length} tweets containing links</Typography>
            <ul>
                {
                    result.map(tweet => {
                        return (
                            <li key={tweet.id}>
                            <div>
                                <h3 className={styles.movie_title}>{tweet.name}</h3>
                                <h5 className={styles.movie_tag}>{tweet.text}</h5>
                                    {/* <p className={styles.movie_description}>{movie.overview}</p> */}
                                {/* <div>
                                    <span>
                                        <Icon type="star" style={{ marginRight: 8 }} key="list-vertical-like-o" />
                                        {movie.vote_count}
                                    </span>
                                </div> */}
                            </div>
                            <img src={tweet.profile_banner_url} alt = {tweet.name} />
                            </li>
                        );
                    })
                    
                }  
            </ul>
        </>
              :
              <div>
                  {/* {movieLoadingStatus ? <Spin spinning={movieLoadingStatus} /> : "No tweets Found"} */}
                  <Typography variant="h6" gutterBottom>No tweets found</Typography>
              </div>
        return (
            <>
            <div className={styles.tweet_list_container}>
                {userFeed}
            </div>    
            </>
        )
    }
}

export default withRouter(LinkFeed);