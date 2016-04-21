"use strict";

app.factory('userService', function ($http, baseServiceUrl, $q, projectsService, issuesService, userDataService, notifyService, authService) {
        var userAssignedIssuesProjectObjects, userLeadProjectObjects, userDashboardProjectObjects, userIssues;

        function setUserChecks() {
            var defer = $q.defer();
            userAssignedIssuesProjectObjects = [];
            userLeadProjectObjects = [];
            userDashboardProjectObjects = [];
            userIssues = [];
            issuesService.getMyIssues()
                .then(function (data) {

                    userIssues = data.Issues;

                    data.Issues.map(function (issue) {
                            return issue.Project;
                        })
                        .forEach(function (project) {
                            var containsProject = false;
                            for (var i = 0; i < userAssignedIssuesProjectObjects.length; i++) {
                                if (project.Id === userAssignedIssuesProjectObjects[i].Id) {
                                    containsProject = true;
                                    break;
                                }
                            }
                            if (!containsProject) {
                                userAssignedIssuesProjectObjects.push(project);
                            }
                        });

                    projectsService.getAllProjects()
                        .then(function (allProjects) {
                            var myId = authService.getCurrentUser().Id;
                            allProjects.forEach(function (project) {
                                if (project.Lead.Id === myId) {
                                    userLeadProjectObjects.push(project);
                                }
                            });

                            userAssignedIssuesProjectObjects.forEach(function (project) {
                                var containsProject = false;
                                for (var i = 0; i < userDashboardProjectObjects.length; i += 1) {
                                    if (project.Id === userDashboardProjectObjects[i].Id) {
                                        containsProject = true;
                                        break;
                                    }
                                }
                                if (!containsProject) {
                                    userDashboardProjectObjects.push(project);
                                }
                            });

                            userLeadProjectObjects.forEach(function (project) {
                                var containsProject = false;
                                for (var i = 0; i < userDashboardProjectObjects.length; i += 1) {
                                    if (project.Id === userDashboardProjectObjects[i].Id) {
                                        containsProject = true;
                                        break;
                                    }
                                }
                                if (!containsProject) {
                                    userDashboardProjectObjects.push(project);
                                }
                            });

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
            clearUserChecks: function () {
                userDataService.clearUserdata();
            },
            setUserChecks: function () {
                var defer = $q.defer();
                if (!userDataService.isDataSet()) {
                    setUserChecks().then(function (data) {
                        userDataService.setUserdata(data)
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
                    setUserChecks().then(function (data) {
                        userDataService.setUserdata(data)
                            .then(function () {
                                defer.resolve();
                            });
                    });
                return defer.promise;
            },
            getAllUsers: function getAllUsers(success, error) {
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
            }
        }
    }
);