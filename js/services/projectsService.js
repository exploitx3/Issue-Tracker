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

    function addProject(formattedProjectData) {
        var defer = $q.defer();
        var request = 'Name=' + encodeURIComponent(formattedProjectData.name) +
            '&Description=' + encodeURIComponent(formattedProjectData.description) +
            '&ProjectKey=' + encodeURIComponent(formattedProjectData.projectKey) +
            '&LeadId=' + encodeURIComponent(formattedProjectData.leadId) + '&';
        var labelsLen = formattedProjectData.labels.length;
        for (var i = 0; i < labelsLen; i += 1) {
            request += encodeURIComponent('labels[' + i + '].Name') + '=' + encodeURIComponent(formattedProjectData.labels[i]) + '&';
        }
        var prioritiesLen = formattedProjectData.priorities.length;
        for (var i = 0; i < prioritiesLen; i += 1) {
            request += encodeURIComponent('priorities[' + i + '].Name') + '=' + encodeURIComponent(formattedProjectData.priorities[i]) + (i === prioritiesLen - 1 ? '' : '&');
        }
        $http({
            method: 'POST',
            url: baseServiceUrl + '/projects',
            data: request,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + sessionStorage['currentUser-Token']
            }
        }).success(function (data) {
            defer.resolve(data);
        }).error(function (err) {
            defer.reject(err);
        });

        return defer.promise;
    }
    function editProject(formattedProjectData, projectId) {
        var defer = $q.defer();
        var request = 'Name=' + encodeURIComponent(formattedProjectData.name) +
            '&Description=' + encodeURIComponent(formattedProjectData.description) +
            '&LeadId=' + encodeURIComponent(formattedProjectData.leadId) + '&';
        var labelsLen = formattedProjectData.labels.length;
        for (var i = 0; i < labelsLen; i += 1) {
            request += encodeURIComponent('labels[' + i + '].Name') + '=' + encodeURIComponent(formattedProjectData.labels[i]) + '&';
        }
        var prioritiesLen = formattedProjectData.priorities.length;
        for (var i = 0; i < prioritiesLen; i += 1) {
            request += encodeURIComponent('priorities[' + i + '].Name') + '=' + encodeURIComponent(formattedProjectData.priorities[i]) + (i === prioritiesLen - 1 ? '' : '&');
        }
        $http({
            method: 'PUT',
            url: baseServiceUrl + '/projects/' + projectId,
            data: request,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + sessionStorage['currentUser-Token']
            }
        }).success(function (data) {
            defer.resolve(data);
        }).error(function (err) {
            defer.reject(err);
        });

        return defer.promise;
    }
    return {
        addProject: addProject,
        editProject: editProject,
        getAllProjects: getAllProjects,
        getProjectById: getProjectById,
        getProjectIssuesById: getProjectIssuesById
    }
}]);