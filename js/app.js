"use strict";
var app = angular.module('app', ['ngRoute', 'LocalStorageModule', 'ngTable', 'ui.bootstrap.pagination', 'angular-loading-bar']);
app.constant('baseServiceUrl', 'http://softuni-issue-tracker.azurewebsites.net');
app.constant('pageSize', 3);
app.config(function ($routeProvider, localStorageServiceProvider) {
    localStorageServiceProvider
        .setPrefix('issueTrackerData')
        .setStorageType('localStorage');

    $routeProvider.when('/', {
        templateUrl: 'templates/home.html',
        controller: 'HomeController',
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

    //$routeProvider.when('/user/ads/publish', {
    //    templateUrl: 'templates/user/publish-new-ad.html',
    //    controller: 'UserPublishNewAdController',
    //    title: 'Publish New Ad'
    //});
    //
    //$routeProvider.when('/user/ads', {
    //    templateUrl: 'templates/user/user-ads.html',
    //    controller: 'UserAdsController',
    //    title: 'My Ad'
    //});
    //
    //
    //$routeProvider.when('/user/ads/:id/editAd', {
    //    templateUrl: 'templates/user/edit-ad.html',
    //    controller: 'UserEditAdController',
    //    title: 'Edit Ad'
    //});
    //
    //
    //$routeProvider.when('/user/ads/:id/deleteAd', {
    //    templateUrl: 'templates/user/delete-ad.html',
    //    controller: 'UserDeleteAdController',
    //    title: 'Delete Ad'
    //});

    $routeProvider.when('/profile', {
        templateUrl: 'templates/user/edit-profile.html',
        controller: 'UserEditProfileController',
        title: 'Edit Profile'
    });

    $routeProvider.when('/projects', {
        templateUrl: 'templates/partial/projects.html',
        controller: 'ProjectsGetAllController',
        title: 'Projects'
    });


    $routeProvider.when('/projects/add', {
        templateUrl: 'templates/partial/add-new-project.html',
        controller: 'AddProjectController',
        title: 'Add Project'
    });

    $routeProvider.when('/projects/:projectId', {
        templateUrl: 'templates/partial/project.html',
        controller: 'ProjectController',
        title: 'Project'
    });

    $routeProvider.when('/issues/:issueId', {
        templateUrl: 'templates/partial/issue.html',
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
        userService.clearUserChecks();
    });
    $rootScope.$on('$locationChangeStart', function (event) {
        if ($location.path().indexOf("/user/") != -1 && !authService.isLoggedIn()) {
            $location.path('/');
        }
        if ($location.path().indexOf("/user/ads") != -1) {
            $rootScope.showStatuses = true;
        } else {
            $rootScope.showStatuses = false;
        }
    });
}]);

