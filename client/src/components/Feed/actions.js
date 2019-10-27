import ApiService from '../../services/ApiService';

const FeedActions = {
    getTwitterFeeds: () => {
        let user_id = localStorage.getItem('USER_ID');
        return ApiService.get(`/feed?user_id=${user_id}`);
    },
    loadTwitterFeeds: () => {
        let token = localStorage.getItem('USER_TOKEN');
        let token_secret = localStorage.getItem('USER_SECRET');        
        let user_id = localStorage.getItem('USER_ID');
        return ApiService.get(`/feed/load?token=${token}&token_secret=${token_secret}&user_id=${user_id}`);
    },
    searchByHashTag: (hashtag) => {
        let user_id = localStorage.getItem('USER_ID');
        return ApiService.get(`/feed/search?user_id=${user_id}&hashtag=${hashtag}`);
    },
    filterByLocation: (location) => {
        let user_id = localStorage.getItem('USER_ID');
        return ApiService.get(`/feed/filter?user_id=${user_id}&location=${location}`);
    },
    loadTweetsWithLink: () => {
        let user_id = localStorage.getItem('USER_ID');
        return ApiService.get(`/feed/links?user_id=${user_id}`);
    }
}

export default FeedActions;
