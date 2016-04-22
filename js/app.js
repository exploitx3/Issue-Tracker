"use strict";

var app = angular.module('app', [
    'ngRoute',
    'LocalStorageModule',
    'ngTable',
    'ui.bootstrap.pagination',
    'angular-loading-bar']);
app.constant('baseServiceUrl', 'http://softuni-issue-tracker.azurewebsites.net');
app.constant('pageSize', 7);
app.config(function ($routeProvider, localStorageServiceProvider) {
    localStorageServiceProvider
        .setPrefix('issueTrackerData')
        .setStorageType('localStorage');

    $routeProvider.when('/', {
        templateUrl: 'templates/home-dashboard.html',
        controller: 'HomeDashboardController',
        title: 'Home'
    });

    $routeProvider.when('/login', {
        templateUrl: 'templates/login.html',
        controller: 'LoginController',
        title: 'Login'
    });

    $routeProvider.when('/register', {
        templateUrl: 'templates/register.html',
        controller: 'RegisterController',
        title: 'Register'
    });

    $routeProvider.when('/profile', {
        templateUrl: 'templates/user/edit-profile.html',
        controller: 'UserEditProfileController',
        title: 'Edit Profile'
    });

    $routeProvider.when('/all-projects', {
        templateUrl: 'templates/partials/project/all-projects-page.html',
        controller: 'ProjectsGetAllController',
        title: 'Projects'
    });

    $routeProvider.when('/projects/:projectId', {
        templateUrl: 'templates/partials/project/project-page.html',
        controller: 'ProjectController',
        title: 'Project'
    });

    $routeProvider.when('/issues/:issueId', {
        templateUrl: 'templates/partials/issue/issue-page.html',
        controller: 'IssueController',
        title: 'Issue'
    });

    $routeProvider.otherwise({
        redirectTo: '/'
    });
});

app.run(['$rootScope', '$location', 'authService', 'userService', function ($rootScope, $location, authService, userService) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
    $rootScope.$on('userLoggedOut', function (event) {
        userService.clearUserData();
    });
    $rootScope.$on('$locationChangeStart', function (event) {
        var profileCheck = $location.path().indexOf("/profile") != -1;
        var projectCheck = $location.path().indexOf("/project") != -1;
        var issueCheck = $location.path().indexOf("/issue") != -1;
        var notLoggedIn = !authService.isLoggedIn();
        if ((profileCheck || projectCheck || issueCheck) && notLoggedIn) {

            $location.path('/');
        }
    });
    $rootScope.$on('$locationChangeStart', function (event) {
        var projectsCheck = $location.path().indexOf("/all-projects") != -1;
        var notAdmin = !authService.isAdmin();
        if ((projectsCheck) && notAdmin) {
            $location.path('/');
        }
    });
}]);

