"use strict";

app.controller('HomeController',
    function ($scope, $rootScope, $q, userService, issuesService, authService, notifyService, ngTableParams, $filter, pageSize) {
        $scope.homeParams = {
            'startPage': 1,
            'pageSize': 2
        };
        if(authService.isLoggedIn()){
            userService.setUserChecks();
        }

        $scope.affiliatedProjects = userService.getAffiliatedProjects();

        $scope.reloadMyIssues = function (page ,pageSize) {
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

        if(authService.isLoggedIn()){
            $scope.reloadMyIssues(1, 2);
        }
    }
);