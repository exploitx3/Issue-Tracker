app.controller('HeaderController', [
    '$scope',
    '$route',
    '$location',
    'userService',
    'authService',
    'projectsService',
    'notifyService',
    function ($scope, $route, $location, userService, authService, projectsService, notifyService) {
        "use strict";

        $scope.logout = function logout() {
            authService.logout();
            $location.path('/');
            $route.reload();
        };


        $scope.openAddProjectModal = function openAddProjectModal() {
            jQuery('#add-project-modal').modal('show');
            userService.getAllUsers()
                .then(function success(users) {
                    $scope.users = users;
                }, function error(err) {
                    notifyService.showError('Cannot load users', err);
                });
        };

        $scope.addProject = function addProject(projectData) {
            var projectKey = projectData.name.split(/\s+/);
            projectKey = projectKey.map(function (word) {
                    return word.charAt(0);
                })
                .join('');
            var formattedProjectData = {
                name: projectData.name,
                description: projectData.description,
                projectKey: projectKey,
                leadId: projectData.leadId
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
            projectsService.addProject(formattedProjectData)
                .then(function () {
                        notifyService.showInfo('Successfully added a project');
                        userService.updateUserData();

                        $route.reload();
                    },
                    function (err) {
                        notifyService.showError('Cannot add project', err);
                    });

            jQuery('#add-project-modal').modal('hide');
        };

    }]);