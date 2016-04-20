"use strict";

app.factory('issuesService', function ($http, authService, baseServiceUrl) {
    function addIssue(formattedIssueData, success, error) {
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
        console.log(request);
        $http({
            method: 'POST',
            url: baseServiceUrl + '/issues/',
            data: request,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + sessionStorage['currentUser-Token']
            }
        }).success(success).error(error);
    }

    function getIssueById(issueId, success, error) {
        $http({
            method: 'GET',
            url: baseServiceUrl + '/issues/' + issueId,
            headers: authService.getAuthHeaders()
        }).success(success).error(error);
    }

    function getIssueCommentsById(issueId, success, error) {
        $http({
            method: 'GET',
            url: baseServiceUrl + '/issues/' + issueId + '/comments',
            headers: authService.getAuthHeaders()
        }).success(success).error(error);
    }

    return {
        addIssue: addIssue,
        getIssueById: getIssueById,
        getIssueCommentsById: getIssueCommentsById
    }
});
