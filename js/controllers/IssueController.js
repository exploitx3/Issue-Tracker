app.controller('IssueController', [
    '$scope',
    '$route',
    '$routeParams',
    '$filter',
    '$q',
    'authService',
    'issuesService',
    'userService',
    'projectsService',
    'notifyService',
    'pageSize',
    'ngTableParams',
    function ($scope, $route, $routeParams, $filter, $q, authService, issuesService, userService, projectsService, notifyService, pageSize) {
        "use strict";

        $scope.commentsParams = {
            startPage: 1,
            pageSize: pageSize - 2
        };

        $scope.userService = userService;

        var _issueComments = [];
        $scope.getIssueData = function getIssueData() {
            var defer = $q.defer();
            issuesService.getIssueById($routeParams.issueId)
                .then(function success(data) {
                    $scope.issueData = data;
                    issuesService.getIssueCommentsById($routeParams.issueId)
                        .then(function success(data) {
                            $scope.issueComments = data.slice(0, $scope.commentsParams.pageSize);
                            _issueComments = data;
                            $scope.commentsParams.numItems = data.length;
                            defer.resolve();
                        })
                }, function error(err) {
                    notifyService.showError('Cannot get issue data', err);
                    defer.reject();
                });
            return defer.promise;
        };

        $scope.reloadIssueComments = function reloadIssueComments() {
            $scope.issueComments = _issueComments.slice(($scope.commentsParams.startPage - 1) * $scope.commentsParams.pageSize, ($scope.commentsParams.startPage - 1) * $scope.commentsParams.pageSize + $scope.commentsParams.pageSize);
        };

        $scope.changeIssueStatus = function changeIssueStatus(statusId) {
            issuesService.changeIssueStatus(statusId, $routeParams.issueId)
                .then(function () {
                    $route.reload();
                })
        };

        $scope.addComment = function addComment(text) {
            issuesService.addComment($routeParams.issueId, text)
                .then(
                    function success() {
                        $route.reload();
                    },
                    function error(err) {
                        notifyService.showError('Cannot add comment', err);
                    })
        };
        $scope.getIssueData();


        $scope.openEditIssueModal = function () {
            userService.getAllUsers()
                .then(function success(users) {
                    $scope.users = users;
                }, function error(err) {
                    notifyService.showError('Cannot load users', err);
                });
            var labels = $scope.issueData.Labels.map(function (label) {
                return label.Name;
            }).join(', ');

            projectsService.getProjectById($scope.issueData.Project.Id)
                .then(function (data) {
                    var priorities = data.Priorities;
                    $scope.editIssueData = {
                        priority: $scope.issueData.Priority,
                        assignee: $scope.issueData.Assignee,
                        id: $scope.issueData.Id,
                        title: $scope.issueData.Title,
                        description: $scope.issueData.Description,
                        dueDate: new Date($scope.issueData.DueDate),
                        priorities: priorities,
                        labels: labels
                    };
                    jQuery('#edit-issue-modal').modal('show');
                });

            $scope.editIssue = function(data){
                var formattedIssueData = {
                    title: data.title,
                    description: data.description,
                    assigneeId: data.assignee.Id,
                    priorityId: data.priority.Id
                };
                var labels = data.labels.split(',')
                    .map(function (label) {
                        return label.trim();
                    })
                    .filter(function (label) {
                        return label !== "";
                    });

                formattedIssueData.labels = labels;
                formattedIssueData.dueDate = data.dueDate.toISOString().substring(0, 19);
                issuesService.editIssue(formattedIssueData, data.id)
                    .then(function () {
                            notifyService.showInfo('Successfully editted an Issue');
                            userService.updateUserData();
                            $route.reload();
                        },
                        function (err) {
                            notifyService.showError('Cannot edit Issue', err);
                        });
                jQuery('#edit-issue-modal').modal('hide');
            }
        };

        $scope.refreshIssueDataAndDatabase = function refreshIssueDataAndDatabase() {
            userService.updateUserData();
            $route.reload();
        }

    }]);