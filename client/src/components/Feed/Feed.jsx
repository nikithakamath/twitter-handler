import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import {Spin} from 'antd';
import {Button, Typography, Container} from '@material-ui/core';
import {Sync, Search, LocationSearching, Link} from '@material-ui/icons';
import FeedActions from './actions';
import styles from './Feed.module.scss';
import {auth} from '../../services/FirebaseService';

class Feed extends Component {
    constructor(props) {
        super(props);
        this.state = {tweets: [], loadingStatus: false};
        this.loadTweets = this.loadTweets.bind(this);
        this.searchRedirect = this.searchRedirect.bind(this);
        this.filterRedirect = this.filterRedirect.bind(this);
        this.tweetLinksRedirect = this.tweetLinksRedirect.bind(this);
    }
    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if(!user) {
                this.props.history.push('/');
            } else {
                this.setState({loadingStatus: true});
                FeedActions.getTwitterFeeds()
                .then((result) => {
                    let actualTweets = result.data;
                    if(actualTweets.length > 0) {
                        this.setState({tweets: this.state.tweets.concat(actualTweets)});
                    }
                    this.setState({loadingStatus: false});
                })
                .catch((error) => {
                    this.setState({loadingStatus: false});
                });
            }
        });
    }
    loadTweets() {
        this.setState({loadingStatus: true});
        FeedActions.loadTwitterFeeds()
            .then((result) => {
                let actualTweets = result.data;
                if(actualTweets.length > 0) {
                    this.setState({tweets: this.state.tweets.concat(actualTweets)});
                }
                this.setState({loadingStatus: false});
            })
            .catch((error) => {
                this.setState({loadingStatus: false});
            });
    }
    searchRedirect() {
        this.props.history.push('/search');
    }
    filterRedirect() {
        this.props.history.push('/filter');
    }
    tweetLinksRedirect() {
        this.props.history.push('/links');
    }
    render() {
        const result = this.state.tweets;
        const userFeed = result.length ?
        <>
            <Typography variant="h6" gutterBottom>Showing {this.state.tweets.length} tweets from past 7 days</Typography>
            <ul>
                {
                    result.map(tweet => {
                        return (
                            <li key={tweet.id}>
                            <div>
                                <h3 className={styles.movie_title}>{tweet.name}</h3>
                                <h5 className={styles.movie_tag}>{tweet.text}</h5>
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
                 {this.state.loadingStatus ? <Spin spinning={this.state.loadingStatus} /> 
                 : <Typography variant="h6" gutterBottom>No tweets found</Typography>} 
                  
              </div>

        return(
        <>
        <Container>
        <Button
                variant="contained"
                color="primary"
                startIcon={<Search />}
                onClick={this.searchRedirect}
                style= {{margin: "30px"}}
            >
                Goto Search
            </Button>
            <Button
                variant="contained"
                color="primary"
                startIcon={<LocationSearching />}
                onClick={this.filterRedirect}
                style= {{margin: "30px"}}
            >
                Goto Filter
            </Button>
            <Button
                variant="contained"
                color="primary"
                startIcon={<Link />}
                onClick={this.tweetLinksRedirect}
                style= {{margin: "30px"}}
            >
                Goto Tweets with links
            </Button>
        </Container>
            <div  style= {{padding: "30px"}}>
            <Button
                variant="contained"
                color="primary"
                startIcon={<Sync />}
                onClick={this.loadTweets}
            >
                Load Recent Tweets
            </Button><br/><br/>
            
            </div>
            <div className={styles.tweet_list_container}>
                {userFeed}
            </div>
        </>
        ); 
    }
}


export default withRouter(Feed);
