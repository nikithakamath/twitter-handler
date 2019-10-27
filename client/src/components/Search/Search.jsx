import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import {Button, TextField, Typography} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

import FeedActions from '../Feed/actions';
import styles from '../Feed/Feed.module.scss';
import {auth} from '../../services/FirebaseService';


class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {searchResults: [], hashtag: ''};
        this.searchTweets = this.searchTweets.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if(!user) {
                this.props.history.push('/');
            }
        });
    }
    handleChange(event) {
        this.setState({[event.target.name]: event.target.value})
    }
    searchTweets() {
        FeedActions.searchByHashTag(this.state.hashtag)
            .then((result) => {
                let actualTweets = result.data;
                this.setState({searchResults: actualTweets});               
            })
            .catch((error) => {
                console.log(error);
            });
    }
    render() {
        const result = this.state.searchResults;
        const userFeed = result.length ?
        <>
        <Typography variant="h6" gutterBottom>Showing {this.state.searchResults.length} tweets by #Hashtag</Typography>
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
            <div  style= {{padding: "10px"}}>
                <TextField
                    id="standard-search"
                    label="Enter Hashtag"
                    type="search"
                    name="hashtag"
                    margin="normal"
                    onChange={this.handleChange}
                />
            </div>
            <div style= {{padding: "30px"}}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SearchIcon />}
                    onClick={this.searchTweets}
                    >
                    Search by #Hashtag
                </Button>
            </div>
            <div className={styles.tweet_list_container}>
                {userFeed}
            </div>
            </>
        )
    }
}

export default withRouter(Search);