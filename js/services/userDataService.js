"use strict";

app.factory('userDataService', function ($http, localStorageService, baseServiceUrl, $q, projectsService, issuesService, notifyService, authService) {

    return {
        isDataSet: function () {
            var isDataSet = localStorageService.hasOwnProperty('userLeadDashboardProjectObjects') &&
                localStorageService.hasOwnProperty('userAssignedIssuesProjectObjects') &&
                localStorageService.hasOwnProperty('userLeadProjectObjects') &&
                localStorageService.hasOwnProperty('userIssues');

            return isDataSet;
        },
        clearUserdata: function () {
            localStorageService.remove('userAssignedIssuesProjectObjects');
            localStorageService.remove('userLeadProjectObjects');
            localStorageService.remove('userDashboardProjectObjects');
            localStorageService.remove('userIssues');
        },
        setUserdata: function (data) {
            var defer = $q.defer();
            localStorageService.set('userAssignedIssuesProjectObjects', data.userAssignedIssuesProjectObjects);
            localStorageService.set('userLeadProjectObjects', data.userLeadProjectObjects);
            localStorageService.set('userDashboardProjectObjects', data.userDashboardProjectObjects);
            localStorageService.set('userIssues', data.userIssues);
            defer.resolve();
            return defer.promise;
        },
        isProjectLead: function isProjectLead(projectId) {
            var userLeadProjectObjects = localStorageService.get('userLeadProjectObjects');
            var containsProject = false;
            for (var i = 0; i < userLeadProjectObjects.length; i++) {
                if (Number(projectId) === userLeadProjectObjects[i].Id) {
                    containsProject = true;
                    break;
                }
            }
            return containsProject;


        },
        hasAssignedIssueInProject: function hasAssignedIssueInProject(projectId) {
            var userAssignedIssuesProjectObjects = localStorageService.get('userAssignedIssuesProjectObjects');
            return (userAssignedIssuesProjectObjects
                    .map(function (project) {
                        return project.Id;
                    })
                    .indexOf(projectId)) !== -1;

        },
        isIssueAssignee: function isIssueAssignee(issueId) {
            var userIssues = localStorageService.get('userIssues');
            var containsIssue = false;
            for (var i = 0; i < userIssues.length; i++) {
                if (Number(issueId) === userIssues[i].Id) {
                    containsIssue = true;
                    break;
                }
            }
            return containsIssue;

        },
        getAffiliatedProjects: function () {
            var userDashboardProjectObjects = localStorageService.get('userDashboardProjectObjects');

            return userDashboardProjectObjects;

        },
        getAllAffiliatedIssues: function () {
            var userIssues = localStorageService.get('userIssues');

            return userIssues;

        },
        getProjectLeadById: function (projectId) {
            var userLeadProjectObjects = localStorageService.get('userLeadProjectObjects');
            var project;
            for (var i = 0; i < userLeadProjectObjects.length; i++) {
                if (Number(projectId) === userLeadProjectObjects[i].Id) {
                    project = userLeadProjectObjects[i];
                    break;
                }
            }
            return project;
        }
    }
});

