app.controller('ProjectController', ['$scope', '$routeParams', '$filter', 'issuesService', 'userService', 'projectsService', 'notifyService', 'pageSize', 'ngTableParams',
    function ($scope, $routeParams, $filter, issuesService, userService, projectsService, notifyService, pageSize, ngTableParams) {
        $scope.projectsParams = {
            'startPage': 1,
            'pageSize': pageSize
        };
        $scope.getProjectData = function getProjectData() {
            projectsService.getProjectById($routeParams.projectId, function success(data) {
                $scope.projectData = data;
                projectsService.getProjectIssuesById($routeParams.projectId, function success(issues) {
                    $scope.projectData.Issues = issues;
                    $scope.projectData.Issues.forEach(function (issue) {
                        issue.AssigneeUsername = issue.Assignee.Username;
                    });
                    $scope.issuesTable = new ngTableParams({
                        page: 1,
                        count: 10
                    }, {
                        total: $scope.projectData.Issues.length,
                        getData: function ($defer, params) {
                            $scope.data = params.sorting() ? $filter('orderBy')($scope.projectData.Issues, params.orderBy()) : $scope.projectData.Issues;
                            $scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
                            $scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                            $defer.resolve($scope.data);
                        }
                    });
                }, function error(err) {
                    notifyService.showError('Cannot get all issues for the project', err);
                });
            }, function error(err) {
                notifyService.showError('Cannot get project by id', err);
            });
        };

        $scope.openAddIssueModal = function () {
            jQuery('#add-issue-modal').modal('show');
            userService.getAllUsers(function success(users) {
                $scope.users = users;
            }, function error(err) {
                notifyService.showError('Cannot load users', err);
            });
            $scope.priorities = $scope.projectData.Priorities;
        };

        $scope.addIssue = function addIssue(issueData) {
            var formattedIssueData = {
                title: issueData.title,
                description: issueData.description,
                projectId: $routeParams.projectId,
                assigneeId: issueData.assigneeId,
                priorityId: issueData.priorityId
            };
            var labels = issueData.labels.split(',')
                .map(function (label) {
                    return label.trim();
                })
                .filter(function (label) {
                    return label !== "";
                });

            formattedIssueData.labels = labels;
            formattedIssueData.dueDate = issueData.dueDate.toISOString().substring(0, 19);
            issuesService.addIssue(formattedIssueData, function () {
                    notifyService.showInfo('Successfully added an Issue');
                },
                function (err) {
                    notifyService.showError('Cannot add Issue', err);
                });

            jQuery('#add-issue-modal').modal('hide');
        };

        $scope.getProjectData();

        $scope.getProjectData();

    }]);