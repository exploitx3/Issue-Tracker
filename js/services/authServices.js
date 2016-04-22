app.factory('authService', [
    '$rootScope',
    '$q',
    '$http',
    'baseServiceUrl',
    function ($rootScope, $q, $http, baseServiceUrl) {
        "use strict";

        return {
            login: function (userData) {
                var defer = $q.defer();
                var _this = this;
                this.getUserToken(userData.username, userData.password)
                    .then(function () {
                        _this.getUserInfo()
                            .then(function success() {
                                defer.resolve();
                            });
                    }, function (err) {
                        defer.reject(err);
                    });
                return defer.promise;
            },
            register: function (userData) {
                var defer = $q.defer();
                var request = {
                    method: 'POST',
                    url: baseServiceUrl + '/api/account/register',
                    data: userData
                };
                var _this = this;
                $http(request).success(function () {
                    _this.getUserToken(userData.email, userData.password)
                        .then(function () {
                            _this.getUserInfo()
                                .then(function success() {
                                    defer.resolve();
                                });
                        });
                }).error(function (err) {
                    defer.reject(err);
                });
                return defer.promise;
            },
            logout: function () {
                var defer = $q.defer();
                var request = {
                    method: 'POST',
                    url: baseServiceUrl + '/api/Account/Logout',
                    headers: this.getAuthHeaders()
                };
                sessionStorage.removeItem('currentUser');
                sessionStorage.removeItem('currentUser-Token');
                $rootScope.$broadcast('userLoggedOut');

                $http(request).success(function (data) {
                    defer.resolve(data);
                }).error(function (err) {
                    defer.reject(err);
                });

                return defer.promise;
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
            changePass: function (passData) {
                var defer = $q.defer();
                var request = {
                    method: 'POST',
                    url: baseServiceUrl + '/api/Account/ChangePassword',
                    data: passData,
                    headers: this.getAuthHeaders()
                };
                $http(request).success(
                    function success(data) {
                        defer.resolve(data);
                    }).error(function error(err) {
                    defer.reject(err);
                });
                return defer.promise;
            }
        };
    }]);