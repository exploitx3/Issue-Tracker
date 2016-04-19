app.controller('ProjectsGetAllController', ['$scope', 'projectsService', 'notifyService', 'pageSize',
    function ($scope, projectsService, notifyService, pageSize) {
    $scope.projectsParams = {
        'startPage': 1,
        'pageSize': pageSize
    };

    $scope.reloadProjects = function reloadProjects() {
        projectsService.getAllProjects(function success(data) {
            $scope.projects = data;
        }, function error(err) {
            notifyService.showError('Cannot get all projects', err);
        })
    };

    $scope.reloadProjects();
}]);