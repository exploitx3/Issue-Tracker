app.controller('AllProjectsController', [
    '$scope',
    'projectsService',
    'userService',
    'notifyService',
    'pageSize',
    function ($scope, projectsService, userService, notifyService, pageSize) {
        "use strict";

        $scope.projectsParams = {
            'startPage': 1,
            'pageSize': pageSize -2
        };

        $scope.reloadAllProjects = function reloadAllProjects(params) {
            projectsService.getAllProjectsWithParams(params)
                .then(function success(data) {
                    $scope.projectsParams.numItems = data.TotalCount;
                    $scope.projects = data.Projects;
                }, function error(err) {
                    notifyService.showError('Cannot get all projects', err);
                });

        };

        $scope.reloadAllProjects($scope.projectsParams);

    }]);