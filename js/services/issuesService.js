app.factory('issuesService', [
    '$http',
    '$q',
    'authService',
    'baseServiceUrl',
    function ($http, $q, authService, baseServiceUrl) {
        "use strict";

        function addIssue(formattedIssueData) {
            var defer = $q.defer();
            var request = 'Title=' + encodeURIComponent(formattedIssueData.title) +
                '&Description=' + encodeURIComponent(formattedIssueData.description) +
                '&DueDate=' + encodeURIComponent(formattedIssueData.dueDate) +
                '&ProjectId=' + encodeURIComponent(formattedIssueData.projectId) +
                '&AssigneeId=' + encodeURIComponent(formattedIssueData.assigneeId) +
                '&PriorityId=' + encodeURIComponent(formattedIssueData.priorityId) + '&';
            var len = formattedIssueData.labels.length, i;
            for (i = 0; i < len; i += 1) {
                request += encodeURIComponent('Labels[' + i + '].Name') + '=' + encodeURIComponent(formattedIssueData.labels[i]) + (i === len - 1 ? '' : '&');
            }
            $http({
                method: 'POST',
                url: baseServiceUrl + '/issues/',
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

        function editIssue(formattedIssueData, issueId) {
            var defer = $q.defer();
            var request = 'Title=' + encodeURIComponent(formattedIssueData.title) +
                '&Description=' + encodeURIComponent(formattedIssueData.description) +
                '&DueDate=' + encodeURIComponent(formattedIssueData.dueDate) +
                '&AssigneeId=' + encodeURIComponent(formattedIssueData.assigneeId) +
                '&PriorityId=' + encodeURIComponent(formattedIssueData.priorityId) + '&';
            var len = formattedIssueData.labels.length, i;
            for (i = 0; i < len; i += 1) {
                request += encodeURIComponent('Labels[' + i + '].Name') + '=' + encodeURIComponent(formattedIssueData.labels[i]) + (i === len - 1 ? '' : '&');
            }
            $http({
                method: 'PUT',
                url: baseServiceUrl + '/issues/' + issueId,
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

        function changeIssueStatus(newStatus, issueId) {
            var defer = $q.defer();
            $http({
                method: 'PUT',
                url: baseServiceUrl + '/issues/' + issueId + '/changestatus?statusid=' + newStatus,
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

        function addComment(issueId, text) {
            var defer = $q.defer();
            var request = 'Text=' + encodeURIComponent(text);
            $http({
                method: 'POST',
                url: baseServiceUrl + '/issues/' + issueId + '/comments',
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

        function getIssueById(issueId) {
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: baseServiceUrl + '/issues/' + issueId,
                headers: authService.getAuthHeaders()
            }).success(function (data) {
                defer.resolve(data);
            }).error(function (err) {
                defer.reject(err);
            });

            return defer.promise;
        }

        function getMyIssues() {
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: baseServiceUrl + '/issues/me?orderBy=DueDate desc, IssueKey&pageSize=999&pageNumber=1',
                headers: authService.getAuthHeaders()
            }).success(function (data) {
                defer.resolve(data);
            }).error(function (err) {
                defer.reject(err);
            });

            return defer.promise;
        }

        function getMyIssuesWithPagination(startPage, pageSize) {
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: baseServiceUrl + '/issues/me?orderBy=DueDate desc, IssueKey&pageSize=' + pageSize + '&pageNumber=' + startPage,
                headers: authService.getAuthHeaders()
            }).success(function (data) {
                defer.resolve(data);
            }).error(function (err) {
                defer.reject(err);
            });

            return defer.promise;
        }

        function getIssueCommentsById(issueId) {
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: baseServiceUrl + '/issues/' + issueId + '/comments',
                headers: authService.getAuthHeaders()
            }).success(function (data) {
                defer.resolve(data);
            }).error(function (err) {
                defer.reject(err);
            });

            return defer.promise;
        }

        return {
            addIssue: addIssue,
            changeIssueStatus: changeIssueStatus,
            editIssue: editIssue,
            addComment: addComment,
            getMyIssues: getMyIssues,
            getIssueById: getIssueById,
            getIssueCommentsById: getIssueCommentsById,
            getMyIssuesWithPagination: getMyIssuesWithPagination
        }
    }]);

