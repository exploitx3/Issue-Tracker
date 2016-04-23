app.controller('UserEditProfileController',
    function ($scope, $location, authService, notifyService) {
        "use strict";

        $scope.getUserProfile = function () {
            $scope.userData = authService.getCurrentUser();
        };

        $scope.getUserProfile();


        $scope.changePassword = function changePassword(passData) {
            authService.changePass(passData)
                .then(
                function success() {
                    notifyService.showInfo('User Successfully Changed Password!');
                    $location.path('/');
                },
                function error(err) {
                    notifyService.showError('User password edit failed', err);
                })
        };
    }
);