"use strict";

app.controller('UserEditProfileController',
    function ($scope, $location, authService, notifyService) {

        $scope.getUserProfile = function () {
            $scope.userData = authService.getCurrentUser();
        };

        $scope.getUserProfile();

        $scope.updateProfile = function updateProfile(userData) {
            authService.editUser(userData,
                function success() {
                    notifyService.showInfo('User Successfully Edited!');
                    $location.path('/user/ads');
                },
                function error(err) {
                    notifyService.showError('User edit failed', err);
                })
        };

        $scope.changePassword = function changePassword(passData) {
            authService.changePass(passData,
                function success() {
                    notifyService.showInfo('User Successfully Changed Password!');
                    $location.path('/user/ads');
                },
                function error(err) {
                    notifyService.showError('User password edit failed', err);
                })
        };
    }
);