app.controller('IssueController', ['$scope', '$routeParams', '$filter', '$q', 'authService', 'issuesService', 'userService', 'projectsService', 'notifyService', 'pageSize', 'ngTableParams',
    function ($scope, $routeParams, $filter, $q, authService, issuesService, userService, projectsService, notifyService, pageSize, ngTableParams) {
        "use strict";

        $scope.issueParams = {
            startPage: 1,
            pageSize: 4
        };
        var _issueComments = [];
        $scope.getIssueData = function getIssueData() {
            var defer = $q.defer();
            issuesService.getIssueById($routeParams.issueId)
                .then(function success(data) {
                    $scope.issueData = data;
                    issuesService.getIssueCommentsById($routeParams.issueId)
                        .then(function success(data) {
                            $scope.issueComments = data.slice(0, $scope.issueParams.pageSize);
                            _issueComments = data;
                            $scope.issueParams.numItems = data.length;
                            defer.resolve();
                        })
                }, function error(err) {
                    notifyService.showError('Cannot get issue data', err);
                    defer.reject();
                });
            return defer.promise;
        };

        $scope.reloadIssueComments = function reloadIssueComments() {
            $scope.issueComments = _issueComments.slice(($scope.issueParams.startPage - 1) * $scope.issueParams.pageSize, ($scope.issueParams.startPage - 1) * $scope.issueParams.pageSize + $scope.issueParams.pageSize);
        };

        $scope.changeIssueStatus = function changeIssueStatus(statusId) {
            console.log(statusId);
        };

        var currentId = authService.getCurrentUser().Id;
        $scope.getIssueData()
            .then(function () {
                var isIssueAssignee = currentId === $scope.issueData.Assignee.Id;
                userService.isProjectLead($scope.issueData.Project.Id)
                    .then(function (check) {
                        var isProjectLead = check;
                        var hasAssignedIssueInProject = userService.hasAssignedIssueInProject($scope.issueData.Project.Id);
                        $scope.userParams = {
                            isIssueAssignee: isIssueAssignee,
                            isProjectLead: isProjectLead,
                            hasAssignedIssueInProject: hasAssignedIssueInProject
                        }
                    })
            }, function (err) {
                notifyService.showError('Cannot check project lead id', err);
            });

        $scope.addComment = function addComment(text) {
            issuesService.addComment($routeParams.issueId, text)
                .then(
                    function success(newComments) {

                    },
                    function error(err) {
                        notifyService.showError('Cannot add comment', err);
                    })
        }


    }]);