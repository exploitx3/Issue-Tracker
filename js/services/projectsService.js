app.factory('projectsService',['$http', 'authService', 'baseServiceUrl', function ($http, authService, baseServiceUrl) {
    function getAllProjects(success, error) {
        var request = {
            method: 'GET',
            url: baseServiceUrl + '/projects',
            headers: authService.getAuthHeaders()
        };
        $http(request).success(success).error(error);
    }

    function getProjectById(projectId, success, error) {
        var request = {
            method: 'GET',
            url: baseServiceUrl + '/projects/' + projectId,
            headers: authService.getAuthHeaders()
        };
        $http(request).success(success).error(error);
    }

    function getProjectIssuesById(projectId, success, error) {
        var request = {
            method: 'GET',
            url: baseServiceUrl + '/projects/' + projectId + '/issues',
            headers: authService.getAuthHeaders()
        };
        $http(request).success(success).error(error);
    }

    return {
        getAllProjects: getAllProjects,
        getProjectById: getProjectById,
        getProjectIssuesById: getProjectIssuesById
    }
}]);