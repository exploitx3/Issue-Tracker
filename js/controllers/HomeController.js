"use strict";

app.controller('HomeController',
    function ($scope, $rootScope, $q, userService, userDataService, issuesService, authService, notifyService, ngTableParams, $filter, pageSize) {
        $scope.homeParams = {
            'startPage': 1,
            'pageSize': 2
        };
        if (authService.isLoggedIn()) {
            userService.setUserChecks().then(function () {
                $scope.affiliatedProjects = userDataService.getAffiliatedProjects();
            });
        }


        $scope.reloadMyIssues = function (page, pageSize) {
            var defer = $q.defer();
            issuesService.getMyIssuesWithPagination(page, pageSize)
                .then(
                    function success(data) {
                        $scope.homeParams.numItems = data.TotalPages * $scope.homeParams.pageSize;
                        $scope.issues = data.Issues;
                        defer.resolve();
                    },
                    function error(err) {
                        notifyService.showError('Cannot load issues' + err);
                        defer.reject();
                    }
                );
            return defer.promise;
        };

        if (authService.isLoggedIn()) {
            $scope.reloadMyIssues(1, 2);
        }

        ////$scope.$on('categorySelectionChanged', function (event, selectedCategoryId) {
        ////    $scope.adsParams.categoryId = selectedCategoryId;
        ////    $scope.startPage = 1;
        ////    $scope.reloadAds();
        ////});
        ////
        ////$scope.$on('townSelectionChanged', function (event, selectedTownId) {
        ////    $scope.adsParams.townId = selectedTownId;
        ////    $scope.startPage = 1;
        ////    $scope.reloadAds();
        ////});
        //
        //
        //if (authService.isLoggedIn()) {
        //    $scope.reloadIssues();
        //}
        //
        //$rootScope.$on("$routeChangeSuccess", function (event, currentRoute, previousRoute) {
        //    $rootScope.title = currentRoute.title;
        //});


    }
);