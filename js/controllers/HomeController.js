"use strict";

app.controller('HomeController',
    function ($scope, $rootScope, authService, notifyService, pageSize) {
        $scope.adsParams = {
            'startPage': 1,
            'pageSize': pageSize
        };

    }
);