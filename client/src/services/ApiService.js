const API_URL = process.env.REACT_APP_API_URL;

const ApiServices = {
    tokenFetch: function () {
        let user = JSON.parse(localStorage.getItem('USER'));
        if (user && user.token) {
            return  user.token;
        } else {
            return null;
        }
    },
    get: function (url) {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'Bearer' + this.tokenFetch()
            }
        };
        return this.fetch(url, requestOptions);
    },
    post: function (url, body, token=null ) {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        };
        return this.fetch(url, requestOptions);
    },
    fetch: function (url, requestOptions) {
        return fetch(API_URL + url, requestOptions).then(this.handleResponse);
    },
    handleResponse: function (response) {
        return response.text().then((text) => {
            const data = JSON.parse(text);
            if (!response.ok) {
                const error = (data && data.message) || response.statusText;
                return Promise.reject(error);
            }
            return Promise.resolve(data);
        });
    }
}

export default ApiServices;
