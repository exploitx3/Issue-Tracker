"use strict";

app.factory('authService', ['$q', '$http', 'baseServiceUrl', function ($q, $http, baseServiceUrl) {
    return {
        login: function (userData, success, error) {
            var _this = this;
            this.getUserToken(userData.username, userData.password)
                .then(function () {
                    _this.getUserInfo();
                    success();
                },function (err) {
                    error(err);
                });
        },
        register: function (userData, success, error) {
            var request = {
                method: 'POST',
                url: baseServiceUrl + '/api/account/register',
                data: userData
            };
            var _this = this;
            $http(request).success(function () {
                _this.getUserToken(userData.email, userData.password)
                    .then(function () {
                        _this.getUserInfo();
                        success();
                    });
            }).error(function (err) {
                error(err);
            });
        },
        logout: function () {
            sessionStorage.removeItem('currentUser');
            sessionStorage.removeItem('currentUser-Token');
        },
        getUserInfo: function () {
            var defer = $q.defer();
            var request = {
                method: 'GET',
                url: baseServiceUrl + '/users/me',
                headers: this.getAuthHeaders()
            };
            $http(request).success(function (data) {
                sessionStorage['currentUser'] = JSON.stringify(data);
                defer.resolve(data);
            }).error(function (err) {
                defer.reject(err);
            });

            return defer.promise;
        },
        getUserToken: function (username, password) {
            var defer = $q.defer();
            var request = 'username=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password) + '&grant_type=password';
            $http.post(baseServiceUrl + '/api/Token', request)
                .success(function (data) {
                    sessionStorage['currentUser-Token'] = data.access_token;
                    defer.resolve(data);
                })
                .error(function (err) {
                    defer.reject(err);
                });

            return defer.promise;
        },
        getCurrentUserToken: function () {
            var userObject = sessionStorage.getItem('currentUser-Token');
            if (userObject) {
                return sessionStorage.getItem('currentUser-Token');
            }
        },
        getCurrentUser: function () {
            var userObject = sessionStorage.getItem('currentUser');
            if (userObject) {
                return JSON.parse(sessionStorage.getItem('currentUser'));
            }
        },
        isAnonymous: function () {
            return sessionStorage['currentUser'] == undefined;
        },
        isLoggedIn: function () {
            return sessionStorage['currentUser'] != undefined;
        },
        isNormalUser: function () {
            var currentUser = this.getCurrentUser();
            return (currentUser != undefined) && (!currentUser.isAdmin);
        },
        isAdmin: function () {
            var currentUser = this.getCurrentUser();
            return (currentUser != undefined) && (currentUser.isAdmin);
        },
        getAuthHeaders: function () {
            var headers = {};
            var userAccessToken = this.getCurrentUserToken();
            if (userAccessToken) {
                headers['Authorization'] = 'Bearer ' + userAccessToken;
            }

            return headers;
        },
        //getUserProfile: function (success, error) {
        //    var request = {
        //        method: 'GET',
        //        url: baseServiceUrl + '/api/user/profile',
        //        headers: this.getAuthHeaders()
        //    };
        //    $http(request).success(success).error(error);
        //},
        editUser: function (userData, success, error) {
            var request = {
                method: 'PUT',
                url: baseServiceUrl + '/api/user/profile',
                data: userData,
                headers: this.getAuthHeaders()
            };
            $http(request).success(success).error(error);
        },
        changePass: function (passData, success, error) {
            var request = {
                method: 'PUT',
                url: baseServiceUrl + '/api/user/changePassword',
                data: passData,
                headers: this.getAuthHeaders()
            };
            $http(request).success(success).error(error);
        }
    };
}]);