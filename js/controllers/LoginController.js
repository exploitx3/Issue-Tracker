"use strict";

app.controller('LoginController',
    function ($scope, $location, authService, notifyService) {
        $scope.login = function login(userData) {
            authService.login(userData)
                .then(function success() {
                        notifyService.showInfo("Login Successful");
                        $location.path('/');
                    },
                    function error(err) {
                        notifyService.showError("Login Error", err);
                    });
        }
    }
);