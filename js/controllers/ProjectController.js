app.controller('ProjectController', [
    '$scope',
    '$route',
    '$routeParams',
    '$filter',
    'userService',
    'authService',
    'issuesService',
    'projectsService',
    'notifyService',
    'pageSize',
    'ngTableParams',
    function ($scope, $route, $routeParams, $filter, userService, authService, issuesService, projectsService, notifyService, pageSize, ngTableParams) {
        "use strict";

        $scope.userService = userService;

        $scope.getProjectData = function getProjectData() {
            projectsService.getProjectById($routeParams.projectId)
                .then(function success(data) {
                    $scope.projectData = data;
                    projectsService.getProjectIssuesById($routeParams.projectId)
                        .then(function success(issues) {
                            $scope.projectData.Issues = issues;
                            $scope.projectData.Issues.forEach(function (issue) {
                                issue.AssigneeUsername = issue.Assignee.Username;
                            });
                            $scope.issuesTable = new ngTableParams({
                                page: 1,
                                count: pageSize
                            }, {
                                total: $scope.projectData.Issues.length,
                                getData: function ($defer, params) {
                                    $scope.data = params.sorting() ? $filter('orderBy')($scope.projectData.Issues, params.orderBy()) : $scope.projectData.Issues;
                                    $scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
                                    this.total = $scope.data.length;
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
            userService.getAllUsers()
                .then(function success(users) {
                    $scope.users = users;
                }, function error(err) {
                    notifyService.showError('Cannot load users', err);
                });
            $scope.priorities = $scope.projectData.Priorities;
        };

        $scope.openEditProjectModal = function () {
            jQuery('#edit-project-modal').modal('show');
            userService.getAllUsers()
                .then(function success(users) {
                    $scope.users = users;
                }, function error(err) {
                    notifyService.showError('Cannot load users', err);
                });
            var labels = $scope.projectData.Labels.map(function (label) {
                return label.Name;
            }).join(', ');
            var priorities = $scope.projectData.Priorities.map(function (priority) {
                return priority.Name;
            }).join(', ');
            $scope.newProjectData = {
                id: $scope.projectData.Id,
                name: $scope.projectData.Name,
                leader: $scope.projectData.Lead,
                labels: labels,
                priorities: priorities,
                description: $scope.projectData.Description
            }
        };

        $scope.editProject = function editProject(projectData) {
            var formattedProjectData = {
                name: projectData.name,
                description: projectData.description,
                leadId: projectData.leader.Id
            };
            var labels = projectData.labels.split(',')
                .map(function (label) {
                    return label.trim();
                })
                .filter(function (label) {
                    return label !== "";
                });

            var priorities = projectData.priorities.split(',')
                .map(function (priority) {
                    return priority.trim();
                })
                .filter(function (priority) {
                    return priority !== "";
                });

            formattedProjectData.labels = labels;
            formattedProjectData.priorities = priorities;
            projectsService.editProject(formattedProjectData, projectData.id)
                .then(function () {
                        notifyService.showInfo('Successfully added a project');
                    },
                    function (err) {
                        notifyService.showError('Cannot add project', err);
                    });

            jQuery('#edit-project-modal').modal('hide');
            $route.reload();
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
            issuesService.addIssue(formattedIssueData)
                .then(function () {
                        notifyService.showInfo('Successfully added an Issue');
                        $scope.getProjectData();
                        userService.updateUserData();
                        $route.reload();
                    },
                    function (err) {
                        notifyService.showError('Cannot add Issue', err);
                    });

            jQuery('#add-issue-modal').modal('hide');
        };

        $scope.getProjectData();
        $scope.ProjectAdminLeadRights = function () {
            return authService.isAdmin() || userService.isProjectLead($routeParams.projectId);
        };

        $scope.refreshProjectDataAndDatabase = function refreshProjectDataAndDatabase() {
            userService.updateUserData();
            $route.reload();
        }
    }]);