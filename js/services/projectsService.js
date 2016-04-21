app.factory('projectsService', ['$http', '$q', 'authService', 'baseServiceUrl', function ($http, $q, authService, baseServiceUrl) {
    function getAllProjects() {
        var defer = $q.defer();
        var request = {
            method: 'GET',
            url: baseServiceUrl + '/projects',
            headers: authService.getAuthHeaders()
        };
        $http(request).success(function (data) {
            defer.resolve(data);
        }).error(function (err) {
            defer.reject(err);
        });

        return defer.promise;
    }

    function getProjectById(projectId) {
        var defer = $q.defer();
        var request = {
            method: 'GET',
            url: baseServiceUrl + '/projects/' + projectId,
            headers: authService.getAuthHeaders()
        };
        $http(request).success(function (data) {
            defer.resolve(data);
        }).error(function (err) {
            defer.reject(err);
        });

        return defer.promise;
    }

    function getProjectIssuesById(projectId) {
        var defer = $q.defer();
        var request = {
            method: 'GET',
            url: baseServiceUrl + '/projects/' + projectId + '/issues',
            headers: authService.getAuthHeaders()
        };
        $http(request).success(function (data) {
            defer.resolve(data);
        }).error(function (err) {
            defer.reject(err);
        });

        return defer.promise;
    }

    return {
        getAllProjects: getAllProjects,
        getProjectById: getProjectById,
        getProjectIssuesById: getProjectIssuesById
    }
}]);