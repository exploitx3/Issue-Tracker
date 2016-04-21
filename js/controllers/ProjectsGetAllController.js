app.controller('ProjectsGetAllController', ['$scope', 'projectsService', 'userService', 'notifyService', 'pageSize',
    function ($scope, projectsService, userService, notifyService, pageSize) {
        $scope.projectsParams = {
            'startPage': 1,
            'pageSize': pageSize
        };

        $scope.reloadProjects = function reloadProjects() {
            projectsService.getAllProjects()
                .then(function success(data) {
                    $scope.projects = data;
                }, function error(err) {
                    notifyService.showError('Cannot get all projects', err);
                })
        };

        $scope.reloadProjects();
    }]);