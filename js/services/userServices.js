"use strict";

app.factory('userService', function ($http, baseServiceUrl, $q, projectsService, issuesService, notifyService, authService) {
    var userLeadProjects, userLeadProjectObjects, userIssues;

    function setUserChecks() {
        userLeadProjects = [];
        userLeadProjectObjects = [];
        userIssues = [];
        issuesService.getMyIssues()
            .then(function (data) {
                userIssues = data.Issues;
                data.Issues.map(function (issue) {
                        return issue.Project;
                    })
                    .forEach(function (project) {
                        var containsProject = false;
                        for (var i = 0; i < userLeadProjectObjects.length; i++) {
                            if (project.Id === userLeadProjectObjects[i].Id) {
                                containsProject = true;
                                break;
                            }
                        }
                        if (!containsProject) {
                            userLeadProjectObjects.push(project);
                        }
                    });

                data.Issues.map(function (issue) {
                        return issue.Project.Id;
                    })
                    .forEach(function (projectId) {
                        var containsProject = false;
                        for (var i = 0; i < userLeadProjects.length; i++) {
                            if (projectId === userLeadProjects[i]) {
                                containsProject = true;
                                break;
                            }
                        }
                        if (!containsProject) {
                            userLeadProjects.push(projectId);
                        }
                    });

                //console.log(userLeadProjects);
                //console.log(userLeadProjectObjects);
                //console.log(userIssues);
            }, function (err) {
                notifyService.showError('Cannot set user checks', err);
            })
    }
    if(authService.isLoggedIn()){
        setUserChecks();
    }
    return {
        setUserChecks: setUserChecks,
        isProjectLead: function isProjectLead(projectId) {
            var defer = $q.defer();
            var isProjectLeadCheck;
            var currentId = authService.getCurrentUser().Id;
            projectsService.getProjectById(projectId)
                .then(function (projectData) {
                    isProjectLeadCheck = (projectData.Lead.Id === currentId);
                    defer.resolve(isProjectLeadCheck);
                }, function (err){
                    defer.reject(err);
                });
            return defer.promise;
        },
        hasAssignedIssueInProject: function hasAssignedIssueInProject(projectId) {
            return userLeadProjects.indexOf(projectId) !== -1;
        },
        isIssueAssignee: function isIssueAssignee(issueId) {
            var containsIssue = false;
            for (var i = 0; i < userIssues.length; i++) {
                if (issueId === userIssues[i].Id) {
                    containsIssue = true;
                    break;
                }
            }
            return containsIssue;
        },
        getAffiliatedProjects: function () {
            return userLeadProjectObjects;
        },
        getAffiliatedIssues: function () {
            return userIssues;
        },
        getAllUsers: function getAllUsers(success, error) {
            var defer = $q.defer();
            var request = {
                method: 'GET',
                url: baseServiceUrl + '/users/',
                headers: authService.getAuthHeaders()
            };
            $http(request).success(function(data){
                defer.resolve(data);
            }).error(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        }
    }
});