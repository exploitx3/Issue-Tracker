app.controller('RegisterController',
    function ($scope, $location, authService, notifyService) {
        "use strict";

        $scope.register = function register(userData) {
            authService.register(userData)
                .then(function success() {
                        notifyService.showInfo('Successfully Registered!');
                        $location.path('/');
                    },
                    function error(err) {
                        notifyService.showError('User registration failed', err);
                    })
        }
    }
);