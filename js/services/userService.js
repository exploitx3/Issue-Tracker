app.factory('userService', [
    '$http',
    '$q',
    'baseServiceUrl',
    'projectsService',
    'issuesService',
    'userDataService',
    'notifyService',
    'authService',
    function ($http, $q, baseServiceUrl, projectsService, issuesService, userDataService, notifyService, authService) {
        "use strict";

        function generateUserData() {
            var defer = $q.defer();
            var userAssignedIssuesProjectObjects= [];
            var userLeadProjectObjects = [];
            var userDashboardProjectObjects = [];
            var userIssues = [];
            issuesService.getMyIssues()
                .then(function (data) {
                    userIssues = data.Issues;
                    var allIssueProjects = userIssues.map(function (issue) {
                        return issue.Project;
                    });
                    userAssignedIssuesProjectObjects = _.uniqWith(allIssueProjects, _.isEqual);

                    projectsService.getAllProjectsByLeadId(authService.getCurrentUser().Id)
                        .then(function (projects) {
                            userLeadProjectObjects = projects.Projects;

                            userDashboardProjectObjects = _.uniqWith(userAssignedIssuesProjectObjects.concat(userLeadProjectObjects), _.isEqual);
                            defer.resolve({
                                userIssues: userIssues,
                                userAssignedIssuesProjectObjects: userAssignedIssuesProjectObjects,
                                userLeadProjectObjects: userLeadProjectObjects,
                                userDashboardProjectObjects: userDashboardProjectObjects
                            });
                        });
                }, function (err) {
                    notifyService.showError('Cannot set user checks', err);
                    defer.reject();
                });
            return defer.promise;
        }


        return {
            clearUserData: function () {
                userDataService.clearUserDataInStorage();
            },
            setUserData: function () {
                var defer = $q.defer();
                if (!userDataService.isDataSet()) {
                    generateUserData().then(function (data) {
                        userDataService.setUserDataInStorage(data)
                            .then(function () {
                                defer.resolve();
                            });
                    });
                } else {
                    defer.resolve();
                }
                return defer.promise;
            },
            updateUserData: function () {
                var defer = $q.defer();
                generateUserData().then(function (data) {
                    userDataService.setUserDataInStorage(data)
                        .then(function () {
                            defer.resolve();
                        });
                });
                return defer.promise;
            },
            getAllUsers: function getAllUsers() {
                var defer = $q.defer();
                var request = {
                    method: 'GET',
                    url: baseServiceUrl + '/users/',
                    headers: authService.getAuthHeaders()
                };
                $http(request).success(function (data) {
                    defer.resolve(data);
                }).error(function (err) {
                    defer.reject(err);
                });
                return defer.promise;
            },
            isProjectLead: function isProjectLead(projectId) {
                var userLeadProjectObjects = userDataService.getUserLeadProjectObjects();
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
                var userAssignedIssuesProjectObjects = userDataService.getUserAssignedIssuesProjectObjects();
                return (userAssignedIssuesProjectObjects
                        .map(function (project) {
                            return project.Id;
                        })
                        .indexOf(projectId)) !== -1;

            },
            isIssueAssignee: function isIssueAssignee(issueId) {
                var userIssues = userDataService.getUserIssues();
                var containsIssue = false;
                for (var i = 0; i < userIssues.length; i++) {
                    if (Number(issueId) === userIssues[i].Id) {
                        containsIssue = true;
                        break;
                    }
                }
                return containsIssue;

            },
            getProjectLeadById: function (projectId) {
                var userLeadProjectObjects = userDataService.getUserLeadProjectObjects();
                var project;
                for (var i = 0; i < userLeadProjectObjects.length; i++) {
                    if (Number(projectId) === userLeadProjectObjects[i].Id) {
                        project = userLeadProjectObjects[i];
                        break;
                    }
                }
                return project;
            },
            getAffiliatedProjects: function () {
                return userDataService.getUserDashboardProjectObjects();
            }
        }
    }]
);