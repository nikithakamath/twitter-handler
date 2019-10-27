import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import {Button, TextField, Typography} from '@material-ui/core';
import LocationSearchingIcon from '@material-ui/icons/LocationSearching';

import FeedActions from '../Feed/actions';
import styles from '../Feed/Feed.module.scss';
import {auth} from '../../services/FirebaseService';


class Filter extends Component {
    constructor(props) {
        super(props);
        this.state = {filterResults: [], location: ''};
        this.filterTweets = this.filterTweets.bind(this);
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
    filterTweets() {
        FeedActions.filterByLocation(this.state.location)
            .then((result) => {
                let actualTweets = result.data;
                this.setState({filterResults: actualTweets});               
            })
            .catch((error) => {
                console.log(error);
            });
    }
    render() {
        const result = this.state.filterResults;
        const userFeed = result.length ?
        <>
            <Typography variant="h6" gutterBottom>Showing {this.state.filterResults.length} tweets by Location</Typography>
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
                    id="standard-with-placeholder"
                    label="Enter Location"
                    placeholder="Location"
                    margin="normal"
                    name="location"
                    onChange={this.handleChange}
                />
            </div>
            <div style= {{padding: "30px"}}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<LocationSearchingIcon />}
                    onClick={this.filterTweets}
                    >
                    Filter by Location
                </Button>
            </div>
            <div className={styles.tweet_list_container}>
                {userFeed}
            </div>    
            </>
        )
    }
}

export default withRouter(Filter);