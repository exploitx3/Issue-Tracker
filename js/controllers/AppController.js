"use strict";

app.controller('AppController',
    function ($scope, $location, authService, notifyService) {
        $scope.authService = authService;
        $scope.logout = function logout() {
            authService.logout();
            notifyService.showInfo('Successfully logged out.');
            $location.path('/');
        };
    }
);