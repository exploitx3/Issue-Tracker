app.controller('ProjectController', ['$scope', '$routeParams', '$filter', 'projectsService', 'notifyService', 'pageSize',
    function ($scope, $routeParams, $filter, projectsService, notifyService, pageSize) {
        $scope.projectsParams = {
            'startPage': 1,
            'pageSize': pageSize
        };
        $scope.getProjectData = function getProjectData() {
            projectsService.getProjectById($routeParams.projectId, function success(data) {
                $scope.projectData = data;
                projectsService.getProjectIssuesById($routeParams.projectId, function success(issues) {

                }, function error(err) {
                    notifyService.showError('Cannot get all issues for the project', err);
                });
            }, function error(err) {
                notifyService.showError('Cannot get project by id', err);
            });
        };


        $scope.getProjectData();

    }]);