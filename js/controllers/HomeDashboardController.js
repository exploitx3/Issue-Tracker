app.controller('HomeDashboardController',['$scope',
    '$rootScope',
    '$q',
    '$route',
    'userService',
    'issuesService',
    'authService',
    'notifyService',
    'pageSize',
    function ($scope, $rootScope, $q, $route, userService, issuesService, authService, notifyService, pageSize) {
        "use strict";

        $scope.homeIssuesParams = {
            'startPage': 1,
            'pageSize': pageSize
        };
        $scope.homeProjectsParams = {
            'startPage': 1,
            'pageSize': pageSize
        };
        var _affiliatedProjects;
        if (authService.isLoggedIn()) {
            userService.setUserData().then(function () {
                _affiliatedProjects = userService.getAffiliatedProjects();
                $scope.homeProjectsParams.numItems = _affiliatedProjects.length;
                $scope.reloadAffiliatedProjects();
            });
        }

        $scope.reloadAffiliatedProjects = function reloadAffiliatedProjects() {
            $scope.affiliatedProjects = _affiliatedProjects.slice(($scope.homeProjectsParams.startPage - 1) * $scope.homeProjectsParams.pageSize, ($scope.homeProjectsParams.startPage - 1) * $scope.homeProjectsParams.pageSize + $scope.homeProjectsParams.pageSize);
        };


        $scope.reloadMyIssues = function (page, pageSize) {
            var defer = $q.defer();
            issuesService.getMyIssuesWithPagination(page, pageSize)
                .then(
                    function success(data) {
                        $scope.homeIssuesParams.numItems = data.TotalPages * $scope.homeIssuesParams.pageSize;
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
            $scope.reloadMyIssues(1, pageSize);
        }

        $scope.refreshDashboardDataAndDatabase = function refreshDashboardDataAndDatabase(){
            $route.reload();
        }
    }]
);