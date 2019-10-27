import ApiService from '../../services/ApiService';

const HomeActions = {
    userLogin: (userInfo, token, secret) =>{
        let requestBody = {
            id: userInfo.profile.id,
            username: userInfo.username,
            name: userInfo.profile.name,
            screen_name: userInfo.profile.screen_name,
            profile_image_url_https: userInfo.profile.profile_image_url_https,
            token: token,
            token_secret: secret
        };
        return ApiService.post(`/auth/login`, requestBody, localStorage.getItem('FB_TOKEN'));
    },
}

export default HomeActions;
